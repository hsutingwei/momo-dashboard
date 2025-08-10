import { query } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event);
    const { product_id } = queryParams;

    if (!product_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'product_id parameter is required'
      });
    }

    const sql = `
      WITH runs AS (
        SELECT
          pc.product_id,
          pc.capture_time AS run_ts,
          COUNT(*) AS comment_count
        FROM product_comments pc
        WHERE pc.product_id = $1
        GROUP BY pc.product_id, pc.capture_time
      )
      SELECT
        product_id,
        run_ts,
        to_char(run_ts, 'YYYY-MM-DD HH24MI') AS run_ts_label,
        comment_count,
        ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY run_ts) AS run_index_from_start,
        COUNT(*) OVER (PARTITION BY product_id) AS total_runs
      FROM runs
      ORDER BY run_ts;
    `;

    const result = await query<any>(sql, [product_id]);

    return {
      success: true,
      data: result
    };

  } catch (error) {
    console.error('Error in product-runs API:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
}); 