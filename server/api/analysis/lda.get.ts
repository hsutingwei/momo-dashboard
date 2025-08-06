import { query } from '../../utils/db';

interface LdaResult {
  id: number;
  product_id: number;
  topic_id: number;
  topic_words: string[];
  score: number;
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
        topic_id,
        topic_words,
        score,
        created_at
      FROM lda_analysis 
      WHERE product_id = $1
      ORDER BY score DESC
      LIMIT 10
    `;

    const results = await query<LdaResult>(sql, [productId]);

    return results.map(row => ({
      id: row.id,
      productId: row.product_id,
      topicId: row.topic_id,
      topicWords: row.topic_words,
      score: row.score,
      createdAt: row.created_at
    }));
  } catch (error) {
    console.error('Error fetching LDA analysis:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch LDA analysis'
    });
  }
}); 