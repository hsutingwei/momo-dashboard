import { query } from '../../utils/db';

interface SentimentResult {
  id: number;
  product_id: number;
  comment_id: string;
  sentiment_score: number;
  sentiment_label: string;
  confidence: number;
  method: string;
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
        comment_id,
        sentiment_score,
        sentiment_label,
        confidence,
        method,
        created_at
      FROM sentiment_analysis 
      WHERE product_id = $1
      ORDER BY sentiment_score DESC
      LIMIT 50
    `;

    const results = await query<SentimentResult>(sql, [productId]);

    return results.map(row => ({
      id: row.id,
      productId: row.product_id,
      commentId: row.comment_id,
      sentimentScore: row.sentiment_score,
      sentimentLabel: row.sentiment_label,
      confidence: row.confidence,
      method: row.method,
      createdAt: row.created_at
    }));
  } catch (error) {
    console.error('Error fetching sentiment analysis:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch sentiment analysis'
    });
  }
}); 