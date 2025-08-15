import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const { 
      product_id, 
      pipeline_version, 
      min_len = '2', 
      max_len = '4', 
      limit = '100' 
    } = getQuery(event)

    // 使用環境變數的預設 pipeline_version
    const defaultPipelineVersion = process.env.PIPELINE_VERSION || null
    const finalPipelineVersion = pipeline_version || defaultPipelineVersion

    const sql = `
      WITH prod_comments AS (
        SELECT pc.comment_id
        FROM product_comments pc
        WHERE ($1::integer IS NULL OR pc.product_id = $1::integer)
      )
      SELECT
        ts.token,
        SUM(ts.tfidf)                 AS total_tfidf,
        COUNT(DISTINCT ts.comment_id) AS doc_count,
        SUM(ts.tf)                    AS total_tf,
        MAX(ts.idf)                   AS idf_any
      FROM tfidf_scores ts
      JOIN prod_comments pc
        ON pc.comment_id = ts.comment_id
      LEFT JOIN nlp_stopwords sw
        ON ($2::text IS NOT NULL
            AND sw.pipeline_version = $2::text
            AND sw.token = ts.token)
      WHERE ($2::text IS NULL OR sw.token IS NULL)
        AND char_length(ts.token) BETWEEN $3::integer AND $4::integer
        AND ts.token !~ '[[:space:][:punct:]]'
      GROUP BY ts.token
      ORDER BY total_tfidf DESC
      LIMIT $5::integer;
    `

    const result = await query<any>(sql, [
      product_id ? parseInt(product_id as string) : null,
      finalPipelineVersion,
      parseInt(min_len as string),
      parseInt(max_len as string),
      parseInt(limit as string)
    ])

    return {
      success: true,
      scope: product_id ? 'product' : 'global',
      product_id: product_id ? parseInt(product_id as string) : undefined,
      pipeline_version: finalPipelineVersion,
      limit: parseInt(limit as string),
      terms: result.map(row => ({
        term: row.token,
        total_tfidf: parseFloat(row.total_tfidf),
        doc_count: parseInt(row.doc_count),
        total_tf: parseFloat(row.total_tf),
        idf_any: parseFloat(row.idf_any)
      }))
    }
  } catch (error) {
    console.error('Error in product-tfidf-top API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
