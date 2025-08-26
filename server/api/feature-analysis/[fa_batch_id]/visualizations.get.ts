import { query } from '~/server/utils/db';
import type { FeatureAnalysisVisualizations } from '~/types';

export default defineEventHandler(async (event): Promise<FeatureAnalysisVisualizations> => {
  // 小工具：Base64URL encode
  function base64UrlEncode(s: string) {
    return Buffer.from(s, 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  const faBatchId = getRouterParam(event, 'fa_batch_id');

  if (!faBatchId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'fa_batch_id is required'
    });
  }

  try {
    // 獲取視覺化列表
    const visualizationsSql = `
      SELECT 
        viz_type,
        plot_path,
        separation_score,
        explained_var_1,
        explained_var_2,
        cumulative_var_2
      FROM fa_visualizations
      WHERE analysis_id = $1
    `;

    const visualizations = await query(visualizationsSql, [faBatchId]);

    return {
      batch_id: faBatchId,
      visualizations: visualizations.map((viz: any) => {
        const encoded = viz.plot_path ? base64UrlEncode(String(viz.plot_path)) : '';
        return {
          viz_type: viz.viz_type as 'pca' | 'tsne' | 'umap',
          url: encoded ? `/api/fa/viz/${encoded}` : '',
          separation_score: viz.separation_score ?? undefined,
          explained_var_1: viz.explained_var_1 ?? undefined,
          explained_var_2: viz.explained_var_2 ?? undefined,
          cumulative_var_2: viz.cumulative_var_2 ?? undefined,
        };
      })
    };

  } catch (error) {
    console.error('Error fetching visualizations:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
