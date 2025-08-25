import { query } from '~/server/utils/db';
import type { FeatureAnalysisSummary } from '~/types';

export default defineEventHandler(async (event): Promise<FeatureAnalysisSummary> => {
  const faBatchId = getRouterParam(event, 'fa_batch_id');
  
  if (!faBatchId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'fa_batch_id is required'
    });
  }

  try {
    // 獲取批次資訊
    const batchDataSql = `
      SELECT summary_json FROM fa_data_summary WHERE analysis_id = $1
    `;
    const batchData = await query(batchDataSql, [faBatchId]);

    if (batchData.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Analysis batch not found'
      });
    }

    const summaryJson = batchData[0].summary_json;

    // 獲取特徵統計
    const featureStatsSql = `
      SELECT 
        feature_name,
        cohens_d,
        mutual_info,
        p_value,
        overlap_coefficient,
        is_significant,
        has_high_separation
      FROM fa_feature_stats
      WHERE analysis_id = $1
      ORDER BY cohens_d DESC
    `;
    const featureStats = await query(featureStatsSql, [faBatchId]);

    return {
      batch_id: faBatchId,
      data_overview: {
        total_samples: summaryJson?.total_samples || 0,
        y1: summaryJson?.positive_samples || 0,
        y0: summaryJson?.negative_samples || 0,
        imbalance_ratio: summaryJson?.imbalance_ratio || '0:0',
        dense_features: summaryJson?.dense_features_count || 0,
        tfidf_features: summaryJson?.tfidf_features_count || 0
      },
      dense_feature_stats: featureStats.map((stat: any) => ({
        feature_name: stat.feature_name,
        cohens_d: stat.cohens_d || 0,
        mutual_info: stat.mutual_info || 0,
        p_value: stat.p_value || 0,
        overlap_coefficient: stat.overlap_coefficient || 0,
        is_significant: stat.is_significant || false,
        has_high_separation: stat.has_high_separation || false
      }))
    };

  } catch (error) {
    console.error('Error fetching feature analysis summary:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
