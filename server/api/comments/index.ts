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
        id: productComments.id,
        commentId: productComments.commentId,
        productId: productComments.productId,
        commentText: productComments.commentText,
        customerName: productComments.customerName,
        commentDate: productComments.commentDate,
        goodsType: productComments.goodsType,
        isLike: productComments.isLike,
        isShowLike: productComments.isShowLike,
        likeCount: productComments.likeCount,
        replyContent: productComments.replyContent,
        replyDate: productComments.replyDate,
        score: productComments.score,
        videoThumbnailImg: productComments.videoThumbnailImg,
        videoUrl: productComments.videoUrl,
        captureTime: productComments.captureTime,
        createdAt: productComments.createdAt,
        productName: products.name, // Joined field
        productKeyword: products.keyword // Joined field
      })
      .from(productComments)
      .leftJoin(products, sql`${productComments.productId} = ${products.id}`);

    if (search) {
      commentsQuery = commentsQuery.where(
        sql`${productComments.commentText} ilike ${`%${search}%`}`
      );
    }

    if (productId && productId !== 'all') {
      commentsQuery = commentsQuery.where(sql`${productComments.productId} = ${parseInt(productId)}`);
    }

    if (sentiment && sentiment !== 'all') {
      // Note: We'll need to implement sentiment analysis logic here
      // For now, we'll use a simple score-based approach
      if (sentiment === 'positive') {
        commentsQuery = commentsQuery.where(sql`${productComments.score} >= 4`);
      } else if (sentiment === 'negative') {
        commentsQuery = commentsQuery.where(sql`${productComments.score} <= 2`);
      } else if (sentiment === 'neutral') {
        commentsQuery = commentsQuery.where(sql`${productComments.score} > 2 and ${productComments.score} < 4`);
      }
    }

    commentsQuery = commentsQuery.limit(limit).offset(offset);
    const commentList = await commentsQuery;

    // Get total count
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(productComments);
    if (search) {
      countQuery = countQuery.where(sql`comment_text ilike ${`%${search}%`}`);
    }
    if (productId && productId !== 'all') {
      countQuery = countQuery.where(sql`product_id = ${parseInt(productId)}`);
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