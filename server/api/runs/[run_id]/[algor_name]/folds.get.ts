import { query } from '~/server/utils/db';
import type { RunFolds } from '~/types';

export default defineEventHandler(async (event): Promise<RunFolds> => {
  const runId = getRouterParam(event, 'run_id');
  const algorName = getRouterParam(event, 'algor_name');

  console.log(runId, algorName);
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
        m.fold,
        m.auc,
        m.accuracy,
        m.precision_1,
        m.recall_1,
        m.f1_1
      FROM ml_fold_metrics m
      left join ml_run_algorithms mra 
        on m.algorithm_id = mra.id 
      WHERE m.run_id = $1 and mra.algorithm like '%' || $2 || '%'
      ORDER BY m.fold ASC
    `;
    
    const foldMetrics = await query(foldMetricsSql, [runId, algorName]);

    if (foldMetrics.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Fold metrics not found'
      });
    }

    // 計算統計資訊
    const aucs = foldMetrics.map((f: any) => f.auc || 0);
    const f1s = foldMetrics.map((f: any) => f.f1_1 || 0);
    const recall = foldMetrics.map((f: any) => f.recall_1 || 0);
    const prec = foldMetrics.map((f: any) => f.precision_1 || 0);

    const auc_mean = aucs.reduce((sum, val) => sum + Number(val), 0) / aucs.length;
    const f1_mean = f1s.reduce((sum, val) => sum + Number(val), 0) / f1s.length;
    const recall_mean = recall.reduce((sum, val) => sum + Number(val), 0) / recall.length;
    const prec_mean = prec.reduce((sum, val) => sum + Number(val), 0) / prec.length;

    const auc_std = Math.sqrt(
      aucs.reduce((sum, val) => sum + Math.pow(Number(val) - auc_mean, 2), 0) / aucs.length
    );
    const f1_std = Math.sqrt(
      f1s.reduce((sum, val) => sum + Math.pow(Number(val) - f1_mean, 2), 0) / f1s.length
    );
    const recall_std = Math.sqrt(
      recall.reduce((sum, val) => sum + Math.pow(Number(val) - recall_mean, 2), 0) / recall.length
    );
    const prec_std = Math.sqrt(
      prec.reduce((sum, val) => sum + Math.pow(Number(val) - prec_mean, 2), 0) / prec.length
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
        f1_1_std: f1_std,
        recall_1_mean: recall_mean,
        recall_1_std: recall_std,
        prec_1_mean: prec_mean,
        prec_1_std: prec_std
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
