import { query } from '~/server/utils/db';
import type { AnalysisBatch } from '~/types';

export default defineEventHandler(async (event): Promise<AnalysisBatch[]> => {
  try {
    // 獲取所有批次
    const batchesSql = `
      SELECT 
        analysis_id,
        analysis_timestamp,
        mode_code
      FROM fa_batches 
      ORDER BY analysis_timestamp DESC
    `;
    
    const batches = await query(batchesSql);

    // 為每個批次獲取相關的 runs 資訊
    const batchesWithRuns = await Promise.all(
      batches.map(async (batch: any) => {
        // 獲取相關的 runs
        const relatedRunsSql = `
          SELECT run_id
          FROM fa_related_runs
          WHERE analysis_id = $1
        `;
        const relatedRuns = await query(relatedRunsSql, [batch.analysis_id]);

        if (relatedRuns.length === 0) {
          return {
            id: batch.analysis_id,
            name: `${batch.mode_code} Analysis`,
            date: batch.analysis_timestamp.toISOString().split('T')[0],
            experiment_count: 0,
            best_auc: 0,
            best_precision: 0
          };
        }

        const runIds = relatedRuns.map((r: any) => r.run_id);
        const placeholders = runIds.map((_, i) => `$${i + 1}`).join(',');
        
        // 獲取這些 runs 的指標
        const runSummariesSql = `
          SELECT auc_mean, precision_1_mean
          FROM ml_run_summary
          WHERE run_id IN (${placeholders})
        `;
        const runSummaries = await query(runSummariesSql, runIds);

        const aucs = runSummaries.map((s: any) => s.auc_mean || 0);
        const precisions = runSummaries.map((s: any) => s.precision_1_mean || 0);

        return {
          id: batch.analysis_id,
          name: `${batch.analysis_id} Analysis`,
          date: batch.analysis_timestamp.toISOString().split('T')[0],
          experiment_count: relatedRuns.length,
          best_auc: aucs.length > 0 ? Math.max(...aucs) : 0,
          best_precision: precisions.length > 0 ? Math.max(...precisions) : 0
        };
      })
    );

    return batchesWithRuns;

  } catch (error) {
    console.error('Error fetching analysis batches:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
