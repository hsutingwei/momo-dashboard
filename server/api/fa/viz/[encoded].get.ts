import { query } from '~/server/utils/db';
import { readFileSync } from 'fs';
import { join } from 'path';
import { existsSync } from 'fs';

export default defineEventHandler(async (event) => {
  const encoded = getRouterParam(event, 'encoded');
  const plotPath = Buffer.from(encoded || '', 'base64').toString('utf-8');
  const config = useRuntimeConfig();
  
  if (!plotPath) {
    throw createError({
      statusCode: 400,
      statusMessage: 'plot_path is required'
    });
  }

  try {
    const fullPath = config.CRAWLER_PATH + plotPath;

    if (!fullPath || !existsSync(fullPath)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Plot path not found'
      });
    }

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
