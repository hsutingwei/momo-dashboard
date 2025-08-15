import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const { keywords, from, to } = getQuery(event)

    // 解析 keywords：空字串或未提供 => 取全部
    const raw = (keywords ?? '').toString().trim()
    const keywordArray = raw
      ? raw.split(',').map(k => k.trim()).filter(Boolean)
      : []  // 空陣列 => 不加 keyword 條件

    // 動態條件與參數
    const conditions: string[] = []
    const params: any[] = []
    let idx = 1

    // keywords 條件（可空）
    if (keywordArray.length > 0) {
      conditions.push(`p.keyword = ANY($${idx}::text[])`)
      params.push(keywordArray)
      idx++
    }

    if (from) {
      conditions.push(`pc.capture_time >= $${idx++}`)
      params.push(from as string)
    }
    if (to) {
      conditions.push(`pc.capture_time <= $${idx++}`)
      params.push(to as string)
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const sql = `
      -- 以「評論批次」為準：每筆快照歸到同關鍵字、時間 <= 快照時間 的最近一筆評論時間
      WITH comment_batches AS (
        SELECT
          p.keyword,
          pc.capture_time AS batch_time
        FROM product_comments pc
        JOIN products p ON p.id = pc.product_id
        ${whereClause}
        GROUP BY p.keyword, pc.capture_time
      ),

      -- 把每筆快照對齊到最近且不晚於它的「評論批次時間」
      snap_mapped AS (
        SELECT
          p.keyword,
          s.product_id,
          s.capture_time  AS snapshot_time,
          s.sales_count,
          cb_near.batch_time
        FROM sales_snapshots s
        JOIN products p ON p.id = s.product_id
        LEFT JOIN LATERAL (
          SELECT cb.batch_time
          FROM comment_batches cb
          WHERE cb.keyword = p.keyword
            AND cb.batch_time <= s.capture_time
          ORDER BY cb.batch_time DESC
          LIMIT 1
        ) AS cb_near ON TRUE
      ),

      -- 同商品×同批：只取該批「最後一筆快照」作代表
      batch_repr AS (
        SELECT *
        FROM (
          SELECT
            keyword,
            product_id,
            batch_time,
            sales_count,
            snapshot_time,
            ROW_NUMBER() OVER (
              PARTITION BY keyword, product_id, batch_time
              ORDER BY snapshot_time DESC
            ) AS rn
          FROM snap_mapped
          WHERE batch_time IS NOT NULL
        ) t
        WHERE rn = 1
      ),

      -- 跨批比較
      with_prev AS (
        SELECT
          keyword,
          product_id,
          batch_time,
          sales_count,
          LAG(sales_count) OVER (
            PARTITION BY keyword, product_id
            ORDER BY batch_time
          ) AS prev_sales
        FROM batch_repr
      ),

      -- 彙總
      aggregated AS (
        SELECT
          keyword,
          batch_time AS batch_capture_time,
          COUNT(DISTINCT product_id) AS total_products_in_batch,
          COUNT(DISTINCT product_id) FILTER (
            WHERE prev_sales IS NOT NULL
              AND sales_count IS DISTINCT FROM prev_sales
          ) AS changed_products_count,
          COUNT(*) FILTER (
            WHERE prev_sales IS NOT NULL
              AND sales_count IS DISTINCT FROM prev_sales
          ) AS total_change_events
        FROM with_prev
        GROUP BY keyword, batch_time
      ),

      -- 計算批次序號
      with_batch_index AS (
        SELECT
          keyword,
          batch_capture_time,
          total_products_in_batch,
          changed_products_count,
          total_change_events,
          ROW_NUMBER() OVER (
            PARTITION BY keyword 
            ORDER BY batch_capture_time
          ) AS batch_index
        FROM aggregated
      )

      SELECT
        keyword,
        batch_capture_time,
        total_products_in_batch,
        changed_products_count,
        total_change_events,
        batch_index
      FROM with_batch_index
      ORDER BY keyword, batch_capture_time;
    `

    const result = await query<any>(sql, params)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Error in batch-changes API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
