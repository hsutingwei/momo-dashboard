import { query } from '../../utils/db';

interface TfidfResult {
  id: number;
  product_id: number;
  keyword: string;
  tfidf_score: number;
  frequency: number;
  created_at: string;
}

export default defineEventHandler(async (event) => {
  try {
    const { productId } = getQuery(event);
    
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
      });
    }

    const sql = `
      SELECT 
        id,
        product_id,
        keyword,
        tfidf_score,
        frequency,
        created_at
      FROM tfidf_analysis 
      WHERE product_id = $1
      ORDER BY tfidf_score DESC
      LIMIT 20
    `;

    const results = await query<TfidfResult>(sql, [productId]);

    return results.map(row => ({
      id: row.id,
      productId: row.product_id,
      keyword: row.keyword,
      tfidfScore: row.tfidf_score,
      frequency: row.frequency,
      createdAt: row.created_at
    }));
  } catch (error) {
    console.error('Error fetching TF-IDF analysis:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch TF-IDF analysis'
    });
  }
}); 