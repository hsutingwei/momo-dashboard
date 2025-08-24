import { query } from '~/server/utils/db';
import { readFileSync } from 'fs';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  const faBatchId = getRouterParam(event, 'fa_batch_id');
  const vizType = getRouterParam(event, 'viz_type');
  
  if (!faBatchId || !vizType) {
    throw createError({
      statusCode: 400,
      statusMessage: 'fa_batch_id and viz_type are required'
    });
  }

  try {
    // 獲取視覺化資訊
    const visualizationSql = `
      SELECT plot_path
      FROM fa_visualizations
      WHERE analysis_id = $1 AND viz_type = $2
    `;
    const visualization = await query(visualizationSql, [faBatchId, vizType]);

    if (visualization.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Visualization not found'
      });
    }

    const plotPath = visualization[0].plot_path;
    if (!plotPath) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Plot path not found'
      });
    }

    // 構建完整的檔案路徑
    // 假設 SVG 檔案存放在 public/visualizations 目錄下
    const fullPath = join(process.cwd(), 'public', 'visualizations', plotPath);

    try {
      // 讀取 SVG 檔案
      const svgContent = readFileSync(fullPath, 'utf-8');
      
      // 設定正確的 Content-Type
      setHeader(event, 'Content-Type', 'image/svg+xml');
      setHeader(event, 'Cache-Control', 'public, max-age=3600'); // 快取 1 小時
      
      return svgContent;
    } catch (fileError) {
      console.error('Error reading SVG file:', fileError);
      throw createError({
        statusCode: 404,
        statusMessage: 'SVG file not found'
      });
    }

  } catch (error) {
    console.error('Error serving visualization:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
