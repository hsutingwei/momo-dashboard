import { query } from '~/server/utils/db';
import type { ExperimentBatch } from '~/types';

export default defineEventHandler(async (event): Promise<ExperimentBatch> => {
  const faBatchId = getRouterParam(event, 'fa_batch_id');
  
  if (!faBatchId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'fa_batch_id is required'
    });
  }

  try {
    // 1. 先檢查此批次是否存在
    const batchExistsSql = `
      SELECT analysis_id FROM fa_batches WHERE analysis_id = $1
    `;
    const batchExists = await query(batchExistsSql, [faBatchId]);

    if (batchExists.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Analysis batch not found'
      });
    }

    // 2. 獲取此批次的所有 codes
    const codesSql = `
      SELECT code FROM fa_analysis_codes WHERE analysis_id = $1
    `;
    const codes = await query(codesSql, [faBatchId]);

    if (codes.length === 0) {
      return {
        fa_batch_id: faBatchId,
        codes: []
      };
    }

    // 3. 獲取各 code 對應的 run_id
    const codeList = codes.map((c: any) => c.code);
    const placeholders = codeList.map((_, i) => `$${i + 2}`).join(',');
    const relatedRunsSql = `
      SELECT code, run_id 
      FROM fa_related_runs 
      WHERE analysis_id = $1 AND code IN (${placeholders})
    `;
    const relatedRuns = await query(relatedRunsSql, [faBatchId, ...codeList]);

    if (relatedRuns.length === 0) {
      return {
        fa_batch_id: faBatchId,
        codes: []
      };
    }

    const runIds = relatedRuns.map((r: any) => r.run_id);
    
    // 檢查是否有 run_ids
    if (runIds.length === 0) {
      return {
        fa_batch_id: faBatchId,
        codes: []
      };
    }
    
    const runPlaceholders = runIds.map((_, i) => `$${i + 1}`).join(',');

    // 4. 獲取算法和指標資訊
    const runsDataSql = `
      SELECT 
        r.run_id,
        mm.mode_desc_short,
        mm.mode_desc_long,
        a.algorithm,
        a.fs_method,
        r.cv_splits,
        s.auc_mean,
        s.accuracy_mean,
        s.f1_macro_mean,
        s.f1_weighted_mean,
        s.precision_1_mean,
        s.recall_1_mean,
        s.f1_1_mean,
        s.precision_0_mean,
        s.recall_0_mean,
        s.f1_0_mean
      FROM ml_runs r
      LEFT JOIN ml_run_algorithms a ON a.run_id = r.run_id
      LEFT JOIN ml_run_summary s ON s.run_id = r.run_id
      LEFT JOIN ml_modes mm ON mm.id = r.mode_id 
      WHERE r.run_id IN (${runPlaceholders})
    `;
    const runsData = await query(runsDataSql, runIds);

    // 5. 組裝結果
    const codesWithRuns = relatedRuns.map((relatedRun: any) => {
      const runData = runsData.find((r: any) => r.run_id === relatedRun.run_id);

      if (!runData) {
        return null;
      }

      return {
        code: relatedRun.code,
        run_id: relatedRun.run_id,
        mode_desc_short: runData.mode_desc_short || 'Unknown',
        mode_desc_long: runData.mode_desc_long || 'Unknown',
        algorithm: runData.algorithm || 'Unknown',
        fs_method: runData.fs_method || 'Unknown',
        cv_splits: runData.cv_splits || 0,
        metrics: {
          auc: runData.auc_mean || 0,
          accuracy: runData.accuracy_mean || 0,
          precision_1: runData.precision_1_mean || 0,
          recall_1: runData.recall_1_mean || 0,
          f1_1: runData.f1_1_mean || 0,
          precision_0: runData.precision_0_mean || 0,
          recall_0: runData.recall_0_mean || 0,
          f1_0: runData.f1_0_mean || 0
        }
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);

    return {
      fa_batch_id: faBatchId,
      codes: codesWithRuns
    };

  } catch (error) {
    console.error('Error fetching experiment runs:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
