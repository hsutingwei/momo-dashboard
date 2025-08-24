import { query } from '~/server/utils/db';
import type { RunFolds } from '~/types';

export default defineEventHandler(async (event): Promise<RunFolds> => {
  const runId = getRouterParam(event, 'run_id');
  
  if (!runId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'run_id is required'
    });
  }

  try {
    // 獲取每折指標
    const foldMetricsSql = `
      SELECT 
        fold,
        auc,
        accuracy,
        precision_1,
        recall_1,
        f1_1
      FROM ml_fold_metrics
      WHERE run_id = $1
      ORDER BY fold ASC
    `;
    
    const foldMetrics = await query(foldMetricsSql, [runId]);

    if (foldMetrics.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Fold metrics not found'
      });
    }

    // 計算統計資訊
    const aucs = foldMetrics.map((f: any) => f.auc || 0);
    const f1s = foldMetrics.map((f: any) => f.f1_1 || 0);

    const auc_mean = aucs.reduce((sum, val) => sum + val, 0) / aucs.length;
    const f1_mean = f1s.reduce((sum, val) => sum + val, 0) / f1s.length;

    const auc_std = Math.sqrt(
      aucs.reduce((sum, val) => sum + Math.pow(val - auc_mean, 2), 0) / aucs.length
    );
    const f1_std = Math.sqrt(
      f1s.reduce((sum, val) => sum + Math.pow(val - f1_mean, 2), 0) / f1s.length
    );

    return {
      run_id: runId,
      folds: foldMetrics.map((fold: any) => ({
        fold: fold.fold,
        auc: fold.auc || 0,
        accuracy: fold.accuracy || 0,
        precision_1: fold.precision_1 || 0,
        recall_1: fold.recall_1 || 0,
        f1_1: fold.f1_1 || 0
      })),
      stats: {
        auc_mean,
        auc_std,
        f1_1_mean: f1_mean,
        f1_1_std: f1_std
      }
    };

  } catch (error) {
    console.error('Error fetching fold metrics:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
