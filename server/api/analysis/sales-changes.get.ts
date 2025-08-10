import { query } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event);
    const { product_id } = queryParams;

    let sql: string;
    let params: any[];

    if (product_id) {
      // 單一產品的銷售變化次數
      sql = `
        WITH ordered AS (
          SELECT
            s.sales_count,
            LAG(s.sales_count) OVER (ORDER BY s.capture_time) AS prev_sales_count
          FROM sales_snapshots s
          WHERE s.product_id = $1
        )
        SELECT
          $1::bigint AS product_id,
          COUNT(*) FILTER (
            WHERE prev_sales_count IS NOT NULL
              AND sales_count IS NOT NULL
              AND sales_count <> prev_sales_count
          ) AS change_times;
      `;
      params = [product_id];
    } else {
      // 所有關鍵字的銷售變化統計
      sql = `
        WITH ordered AS (
          SELECT
            p.keyword,
            s.product_id,
            s.capture_time,
            s.sales_count,
            LAG(s.sales_count) OVER (
              PARTITION BY s.product_id
              ORDER BY s.capture_time
            ) AS prev_sales_count
          FROM sales_snapshots s
          JOIN products p ON p.id = s.product_id
        ),
        changes AS (
          SELECT
            keyword,
            product_id,
            (prev_sales_count IS NOT NULL AND sales_count IS NOT NULL AND sales_count <> prev_sales_count) AS changed
          FROM ordered
        ),
        per_product AS (
          SELECT
            keyword,
            product_id,
            COUNT(*) FILTER (WHERE changed) AS change_times,
            BOOL_OR(changed) AS has_change
          FROM changes
          GROUP BY keyword, product_id
        )
        SELECT
          keyword,
          SUM(change_times) AS total_change_events,
          COUNT(*) FILTER (WHERE has_change) AS changed_products_count
        FROM per_product
        GROUP BY keyword
        ORDER BY keyword;
      `;
      params = [];
    }

    const result = await query<any>(sql, params);

    return {
      success: true,
      data: result,
      has_product_filter: !!product_id
    };

  } catch (error) {
    console.error('Error in sales-changes API:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
}); 