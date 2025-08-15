import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const { product_id } = getQuery(event)

    if (!product_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'product_id is required',
      })
    }

    const sql = `
      WITH target AS (
        SELECT id AS product_id, name AS product_name, keyword
        FROM products
        WHERE id = $1
      ),
      comment_batches AS (
        SELECT
          t.keyword,
          pc.capture_time AS batch_time
        FROM target t
        JOIN products p           ON p.keyword = t.keyword
        JOIN product_comments pc  ON pc.product_id = p.id
        GROUP BY t.keyword, pc.capture_time
      ),
      snap_mapped AS (
        SELECT
          t.product_id,
          t.product_name,
          t.keyword,
          s.capture_time  AS snapshot_time,
          s.sales_count,
          cb_near.batch_time
        FROM target t
        JOIN sales_snapshots s ON s.product_id = t.product_id
        LEFT JOIN LATERAL (
          SELECT cb.batch_time
          FROM comment_batches cb
          WHERE cb.keyword = t.keyword
            AND cb.batch_time <= s.capture_time
          ORDER BY cb.batch_time DESC
          LIMIT 1
        ) AS cb_near ON TRUE
      ),
      batch_repr AS (
        SELECT *
        FROM (
          SELECT
            product_id,
            product_name,
            keyword,
            batch_time,
            sales_count,
            snapshot_time,
            ROW_NUMBER() OVER (
              PARTITION BY product_id, batch_time
              ORDER BY snapshot_time DESC
            ) AS rn
          FROM snap_mapped
          WHERE batch_time IS NOT NULL
        ) x
        WHERE rn = 1
      )
      SELECT
        t.product_id,
        t.product_name,
        t.keyword,
        cb.batch_time AS batch_capture_time,
        COALESCE(br.sales_count, 0) AS sales_count
      FROM target t
      JOIN comment_batches cb
        ON cb.keyword = t.keyword
      LEFT JOIN batch_repr br
        ON br.product_id = t.product_id
       AND br.batch_time = cb.batch_time
      ORDER BY cb.batch_time;
    `

    const result = await query<any>(sql, [parseInt(product_id as string)])

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found',
      })
    }

    const productInfo = result[0]
    const points = result.map(row => ({
      batch_capture_time: row.batch_capture_time,
      sales_count: row.sales_count
    }))

    return {
      success: true,
      product_id: productInfo.product_id,
      product_name: productInfo.product_name,
      keyword: productInfo.keyword,
      points
    }
  } catch (error) {
    console.error('Error in product-sales-series API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
