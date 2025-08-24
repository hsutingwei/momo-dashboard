import { query } from '~/server/utils/db';
import type { RunSummary } from '~/types';

export default defineEventHandler(async (event): Promise<RunSummary> => {
  const runId = getRouterParam(event, 'run_id');
  
  if (!runId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'run_id is required'
    });
  }

  try {
    // 獲取 run 詳細資訊
    const runDataSql = `
      SELECT 
        r.run_id,
        r.date_cutoff,
        a.algorithm,
        a.fs_method,
        a.cv_splits,
        a.hyperparams,
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
      WHERE r.run_id = $1
    `;
    
    const runData = await query(runDataSql, [runId]);

    if (runData.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Run not found'
      });
    }

    const data = runData[0];

    return {
      run_id: runId,
      algorithm: data.algorithm || 'Unknown',
      fs_method: data.fs_method || 'Unknown',
      cv_splits: data.cv_splits || 0,
      cutoff_date: data.date_cutoff ? data.date_cutoff.toISOString().split('T')[0] : '',
      hyperparams: data.hyperparams || {},
      metrics: {
        auc: data.auc_mean || 0,
        accuracy: data.accuracy_mean || 0,
        f1_macro: data.f1_macro_mean || 0,
        f1_weighted: data.f1_weighted_mean || 0,
        precision_1: data.precision_1_mean || 0,
        recall_1: data.recall_1_mean || 0,
        f1_1: data.f1_1_mean || 0,
        precision_0: data.precision_0_mean || 0,
        recall_0: data.recall_0_mean || 0,
        f1_0: data.f1_0_mean || 0
      }
    };

  } catch (error) {
    console.error('Error fetching run summary:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
