import { query as dbQuery } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const q = getQuery(event);
    const productIdRaw = q.product_id as string | undefined;

    // 解析 & 驗證 product_id
    const pid = productIdRaw != null && productIdRaw !== ''
      ? Number(productIdRaw)
      : null;

    if (productIdRaw != null && (pid === null || Number.isNaN(pid))) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid product_id' });
    }

    let sql = '';
    let params: any[] = [];

    if (pid != null) {
      // 單一 product 的「銷售變化次數」
      // 注意：參數已經是 number，不需要在 SQL 裡再 cast 參數本身
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
          ) AS change_times
        FROM ordered;
      `;
      params = [pid];
    } else {
      // 所有關鍵字的銷售變化統計（雙 Y 值用）
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

    const result = await dbQuery<any>(sql, params);

    return {
      success: true,
      data: result,
      has_product_filter: pid != null,
    };
  } catch (error) {
    // 務必把細節印出來，方便你在終端機看到真正的 SQL / 參數與錯誤
    console.error('[sales-changes] query:', event.path, getQuery(event));
    console.error('[sales-changes] error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});