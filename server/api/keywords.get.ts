import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const sql = `
      SELECT DISTINCT keyword
      FROM products
      WHERE keyword IS NOT NULL AND keyword != ''
      ORDER BY keyword
    `

    const result = await query<{ keyword: string }>(sql)

    return {
      success: true,
      keywords: result.map(row => row.keyword)
    }
  } catch (error) {
    console.error('Error in keywords API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
