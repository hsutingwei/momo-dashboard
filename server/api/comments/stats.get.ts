import { query } from '../../utils/db';

interface CommentStats {
  totalComments: number;
  keywordRuns?: any[];
  productRuns?: any[];
  salesChanges?: any[];
}

export default defineEventHandler(async (event) => {
  try {
    const { product_id, comment_text, capture_time } = getQuery(event);

    // 構建篩選條件
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (product_id) {
      whereClause += ` AND pc.product_id = $${params.length + 1}`;
      params.push(parseInt(product_id as string));
    }
    if (comment_text) {
      whereClause += ` AND pc.comment_text ILIKE '%' || $${params.length + 1} || '%'`;
      params.push(comment_text);
    }
    if (capture_time) {
      whereClause += ` AND pc.capture_time::date = $${params.length + 1}::date`;
      params.push(capture_time);
    }

    // 1. 總評論數
    const totalSql = `SELECT COUNT(*) as total FROM product_comments pc ${whereClause}`;
    const totalResult = await query<{ total: number }>(totalSql, params);
    const totalComments = totalResult[0]?.total || 0;

    const stats: CommentStats = {
      totalComments
    };

    // 2. 關鍵字批次分析（如果沒有 product_id 篩選）
    if (!product_id) {
      const keywordRunsSql = `
        WITH base AS (
          SELECT
            p.keyword,
            pc.capture_time AS run_ts,
            COUNT(*) AS comment_count
          FROM product_comments pc
          JOIN products p ON p.id = pc.product_id
          ${whereClause.replace('pc.', '')}
          GROUP BY p.keyword, pc.capture_time
        ),
        seq AS (
          SELECT
            keyword,
            run_ts,
            comment_count,
            ROW_NUMBER() OVER (PARTITION BY keyword ORDER BY run_ts) AS run_index_from_start,
            COUNT(*) OVER (PARTITION BY keyword) AS total_runs
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
        ORDER BY aligned_index, keyword
      `;
      
      const keywordRuns = await query(keywordRunsSql, params);
      stats.keywordRuns = keywordRuns;
    } else {
      // 3. 產品批次分析（如果有 product_id 篩選）
      const productRunsSql = `
        WITH runs AS (
          SELECT
            pc.product_id,
            pc.capture_time AS run_ts,
            COUNT(*) AS comment_count
          FROM product_comments pc
          WHERE pc.product_id = $${params.length + 1}
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
        ORDER BY run_ts
      `;
      
      const productRuns = await query(productRunsSql, [...params, parseInt(product_id as string)]);
      stats.productRuns = productRuns;
    }

    // 4. 銷售變化分析
    if (!product_id) {
      // 沒有 product_id 時，顯示關鍵字維度的銷售變化
      const salesChangesSql = `
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
        ORDER BY keyword
      `;
      
      const salesChanges = await query(salesChangesSql);
      stats.salesChanges = salesChanges;
    } else {
      // 有 product_id 時，顯示該產品的銷售變化次數
      const salesChangesSql = `
        WITH ordered AS (
          SELECT
            s.sales_count,
            LAG(s.sales_count) OVER (ORDER BY s.capture_time) AS prev_sales_count
          FROM sales_snapshots s
          WHERE s.product_id = $${params.length + 1}
        )
        SELECT
          $${params.length + 1}::bigint AS product_id,
          COUNT(*) FILTER (
            WHERE prev_sales_count IS NOT NULL
              AND sales_count IS NOT NULL
              AND sales_count <> prev_sales_count
          ) AS change_times
      `;
      
      const salesChanges = await query(salesChangesSql, [...params, parseInt(product_id as string)]);
      stats.salesChanges = salesChanges;
    }

    return stats;

  } catch (error) {
    console.error('Error fetching comment stats:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch comment stats'
    });
  }
}); 