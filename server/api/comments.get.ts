import { query } from '../utils/db';
import type { Comment, CommentsResponse } from '~/types';

export default defineEventHandler(async (event) => {
  try {
    const { 
      product_id, 
      comment_text, 
      capture_time,
      sortBy = 'id', 
      sortOrder = 'asc', 
      limit = '10', 
      offset = '0',
      page = '1'
    } = getQuery(event);

    let sql = `
      SELECT 
        id,
        comment_id,
        product_id,
        comment_text,
        customer_name,
        comment_date,
        goods_type,
        image_urls,
        like_count,
        reply_content,
        reply_date,
        score,
        video_url,
        capture_time,
        created_at
      FROM product_comments 
      WHERE 1=1
    `;
    const params: any[] = [];

    // 篩選條件
    if (product_id) {
      sql += ` AND product_id = $${params.length + 1}`;
      params.push(parseInt(product_id as string));
    }
    if (comment_text) {
      sql += ` AND comment_text ILIKE '%' || $${params.length + 1} || '%'`;
      params.push(comment_text);
    }
    if (capture_time) {
      sql += ` AND capture_time::date = $${params.length + 1}::date`;
      params.push(capture_time);
    }

    // 計算總筆數
    const countSql = sql.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM');
    const countResult = await query<{ total: number }>(countSql, params);
    const total = countResult[0]?.total || 0;

    // 排序
    const safeFields = ['id', 'comment_id', 'product_id', 'comment_text', 'customer_name', 'comment_date', 'goods_type', 'like_count', 'reply_content', 'reply_date', 'score', 'capture_time', 'created_at'];
    const field = safeFields.includes(sortBy as string) ? sortBy : 'id';
    const order = (sortOrder === 'desc' ? 'DESC' : 'ASC');
    sql += ` ORDER BY ${field} ${order}`;

    // 分頁
    const limitNum = parseInt(limit as string) || 10;
    const offsetNum = parseInt(offset as string) || 0;
    sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limitNum, offsetNum);

    const rows = await query<any>(sql, params);
    const currentPage = parseInt(page as string) || 1;
    const totalPages = Math.ceil(total / limitNum);

    // 處理 image_urls 欄位
    const processedRows = rows.map((row: any) => {
      let imageUrls: string[] = [];
      try {
        if (row.image_urls && typeof row.image_urls === 'string') {
          imageUrls = JSON.parse(row.image_urls);
        } else if (Array.isArray(row.image_urls)) {
          imageUrls = row.image_urls;
        }
      } catch (error) {
        console.warn('Failed to parse image_urls for row:', row.id, error);
        imageUrls = [];
      }

      return {
        ...row,
        image_urls: imageUrls,
        reply_count: 0 // 添加預設值，因為資料庫中沒有這個欄位
      };
    });

    return {
      items: processedRows,
      total,
      page: currentPage,
      limit: limitNum,
      totalPages
    } as CommentsResponse;

  } catch (error) {
    console.error('Error fetching comments:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch comments'
    });
  }
}); 