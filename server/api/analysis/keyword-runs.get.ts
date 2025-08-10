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
      WITH base AS (
        SELECT
          p.keyword,
          pc.capture_time AS run_ts,
          COUNT(*) AS comment_count
        FROM product_comments pc
        JOIN products p ON p.id = pc.product_id
        ${whereClause}
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
    `

    const result = await query<any>(sql, params)
    const maxRuns = result.reduce((m, r) => Math.max(m, r?.max_runs ?? 0), 0)

    return {
      success: true,
      data: result,
      max_runs: maxRuns,
    }
  } catch (error) {
    console.error('Error in keyword-runs API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
