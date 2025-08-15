import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const { keywords, from, to, limit = '50', offset = '0' } = getQuery(event)

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
      conditions.push(`s.capture_time >= $${idx++}`)
      params.push(from as string)
    }
    if (to) {
      conditions.push(`s.capture_time <= $${idx++}`)
      params.push(to as string)
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const sql = `
      WITH s AS (
        SELECT s.*,
               -- 找到 <= 該快照時間 的最近一筆評論時間
               pc_near.capture_time AS aligned_capture_time
          FROM sales_snapshots s
          JOIN products p ON p.id = s.product_id
          LEFT JOIN LATERAL (SELECT pc.capture_time
                               FROM product_comments pc
                              WHERE pc.product_id = s.product_id
                                AND pc.capture_time <= s.capture_time
                              ORDER BY pc.capture_time DESC
                              LIMIT 1
          ) AS pc_near ON TRUE
          ${whereClause}
      ),
      flagged AS (
        SELECT id,
               product_id,
               sales_count,
               capture_time AS original_capture_time,
               COALESCE(aligned_capture_time, capture_time) AS batch_capture_time,
               LAG(sales_count) OVER (
                 PARTITION BY product_id
                 ORDER BY COALESCE(aligned_capture_time, capture_time), capture_time, id
               ) AS prev_sales
          FROM s
      ),
      product_with_drop AS (
        SELECT DISTINCT product_id
          FROM flagged
         WHERE prev_sales IS NOT NULL
           AND sales_count < prev_sales           -- 下降條件
      )
      SELECT
        f.product_id,
        p.name AS product_name,
        p.keyword,
        p.product_link,
        f.sales_count,
        f.original_capture_time,
        f.batch_capture_time,
        f.prev_sales,
        (f.sales_count - f.prev_sales) AS delta
      FROM flagged f
      JOIN products p ON p.id = f.product_id
      WHERE f.product_id IN (SELECT product_id FROM product_with_drop)
      ORDER BY f.product_id, f.batch_capture_time, f.original_capture_time
      LIMIT $${idx++} OFFSET $${idx++};
    `

    // 計算總數的 SQL
    const countSql = `
      WITH s AS (
        SELECT s.*,
               pc_near.capture_time AS aligned_capture_time
          FROM sales_snapshots s
          JOIN products p ON p.id = s.product_id
          LEFT JOIN LATERAL (SELECT pc.capture_time
                               FROM product_comments pc
                              WHERE pc.product_id = s.product_id
                                AND pc.capture_time <= s.capture_time
                              ORDER BY pc.capture_time DESC
                              LIMIT 1
          ) AS pc_near ON TRUE
          ${whereClause}
      ),
      flagged AS (
        SELECT id,
               product_id,
               sales_count,
               LAG(sales_count) OVER (
                 PARTITION BY product_id
                 ORDER BY COALESCE(aligned_capture_time, capture_time), capture_time, id
               ) AS prev_sales
          FROM s
      ),
      product_with_drop AS (
        SELECT DISTINCT product_id
          FROM flagged
         WHERE prev_sales IS NOT NULL
           AND sales_count < prev_sales
      )
      SELECT COUNT(*) as count FROM product_with_drop;
    `

    // 執行查詢
    const [result, countResult] = await Promise.all([
      query<any>(sql, [...params, parseInt(limit as string), parseInt(offset as string)]),
      query<any>(countSql, params)
    ])

    const count = countResult[0]?.count || 0

    return {
      success: true,
      count,
      items: result
    }
  } catch (error) {
    console.error('Error in sales-drops API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
