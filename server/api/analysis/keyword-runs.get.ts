import { query } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event);
    const { keywords, from, to } = queryParams;

    if (!keywords) {
      throw createError({
        statusCode: 400,
        statusMessage: 'keywords parameter is required'
      });
    }

    const keywordArray = (keywords as string).split(',').map(k => k.trim());
    
    // 建立 WHERE 條件
    let whereConditions = [`p.keyword IN (${keywordArray.map((_, i) => `$${i + 1}`).join(',')})`];
    const params = [...keywordArray];
    let paramIndex = keywordArray.length + 1;
    
    if (from) {
      whereConditions.push(`pc.capture_time >= $${paramIndex++}`);
      params.push(from as string);
    }
    
    if (to) {
      whereConditions.push(`pc.capture_time <= $${paramIndex++}`);
      params.push(to as string);
    }

    const whereClause = whereConditions.join(' AND ');

    const sql = `
      WITH base AS (
        SELECT
          p.keyword,
          pc.capture_time AS run_ts,
          COUNT(*) AS comment_count
        FROM product_comments pc
        JOIN products p ON p.id = pc.product_id
        WHERE ${whereClause}
        GROUP BY p.keyword, pc.capture_time
      ),
      seq AS (
        SELECT
          keyword,
          run_ts,
          comment_count,
          ROW_NUMBER() OVER (PARTITION BY keyword ORDER BY run_ts) AS run_index_from_start,
          COUNT(*)     OVER (PARTITION BY keyword)                AS total_runs
        FROM base
      ),
      maxn AS (
        SELECT MAX(total_runs) AS max_runs FROM seq
      ),
      aligned AS (
        SELECT
          s.keyword,
          s.run_ts,
          to_char(s.run_ts, 'YYYY-MM-DD HH24MI') AS run_ts_label,
          s.comment_count,
          s.run_index_from_start,
          s.total_runs,
          m.max_runs,
          (m.max_runs - s.total_runs) + s.run_index_from_start AS aligned_index
        FROM seq s
        CROSS JOIN maxn m
      )
      SELECT
        keyword,
        aligned_index,
        run_index_from_start,
        run_ts,
        run_ts_label,
        comment_count,
        total_runs,
        max_runs
      FROM aligned
      ORDER BY aligned_index, keyword;
    `;

    const result = await query<any>(sql, params);

    return {
      success: true,
      data: result,
      max_runs: result.length > 0 ? result[0].max_runs : 0
    };

  } catch (error) {
    console.error('Error in keyword-runs API:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
}); 