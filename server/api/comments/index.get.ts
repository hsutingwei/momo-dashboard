import { db } from '~/server/utils/database';
import { productComments, products } from '~/server/database/schema';
import { sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const search = query.search as string;
    const productId = query.productId as string;
    const sentiment = query.sentiment as string;
    const limit = parseInt(query.limit as string) || 50;
    const offset = parseInt(query.offset as string) || 0;

    let commentsQuery = db
      .select({
        comment_id: productComments.comment_id,
        product_id: productComments.product_id,
        score: productComments.score,
        comment_text: productComments.comment_text,
        comment_date: productComments.comment_date,
        is_like: productComments.is_like,
        sentiment_score: productComments.sentiment_score,
        product_name: products.name
      })
      .from(productComments)
      .leftJoin(products, sql`${productComments.product_id} = ${products.id}`);

    // 搜尋過濾
    if (search) {
      commentsQuery = commentsQuery.where(
        sql`${productComments.comment_text} ilike ${`%${search}%`}`
      );
    }

    // 商品過濾
    if (productId && productId !== 'all') {
      commentsQuery = commentsQuery.where(sql`${productComments.product_id} = ${productId}`);
    }

    // 情緒過濾
    if (sentiment && sentiment !== 'all') {
      switch (sentiment) {
        case 'positive':
          commentsQuery = commentsQuery.where(sql`${productComments.sentiment_score} > 0.3`);
          break;
        case 'neutral':
          commentsQuery = commentsQuery.where(
            sql`${productComments.sentiment_score} >= -0.3 and ${productComments.sentiment_score} <= 0.3`
          );
          break;
        case 'negative':
          commentsQuery = commentsQuery.where(sql`${productComments.sentiment_score} < -0.3`);
          break;
      }
    }

    // 分頁
    commentsQuery = commentsQuery.limit(limit).offset(offset);

    const commentList = await commentsQuery;

    // 總數查詢
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(productComments);
    if (search) {
      countQuery = countQuery.where(sql`comment_text ilike ${`%${search}%`}`);
    }
    if (productId && productId !== 'all') {
      countQuery = countQuery.where(sql`product_id = ${productId}`);
    }
    if (sentiment && sentiment !== 'all') {
      switch (sentiment) {
        case 'positive':
          countQuery = countQuery.where(sql`sentiment_score > 0.3`);
          break;
        case 'neutral':
          countQuery = countQuery.where(
            sql`sentiment_score >= -0.3 and sentiment_score <= 0.3`
          );
          break;
        case 'negative':
          countQuery = countQuery.where(sql`sentiment_score < -0.3`);
          break;
      }
    }
    const totalCount = await countQuery;

    return {
      comments: commentList,
      total: totalCount[0]?.count || 0,
      limit,
      offset
    };
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch comments'
    });
  }
}); 