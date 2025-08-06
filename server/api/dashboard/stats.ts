import { db } from '~/server/utils/database';
import { products, productComments, salesSnapshots } from '~/server/database/schema';
import { sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const totalProducts = await db.select({ count: sql<number>`count(*)` }).from(products);
    const totalComments = await db.select({ count: sql<number>`count(*)` }).from(productComments);
    const uniqueKeywords = await db.select({ count: sql<number>`count(distinct keyword)` }).from(products);
    
    // Products with sales changes - count distinct products that have multiple sales records
    const productsWithSalesChanges = await db.select({
      count: sql<number>`count(distinct product_id)`
    }).from(salesSnapshots).where(sql`sales_count is not null`);
    
    const topKeywords = await db.select({
      keyword: products.keyword,
      count: sql<number>`count(*)`
    })
    .from(products)
    .where(sql`keyword is not null and keyword != ''`)
    .groupBy(products.keyword)
    .orderBy(sql`count(*) desc`)
    .limit(5);

    return {
      totalProducts: totalProducts[0]?.count || 0,
      totalComments: totalComments[0]?.count || 0,
      uniqueKeywords: uniqueKeywords[0]?.count || 0,
      productsWithSalesChanges: productsWithSalesChanges[0]?.count || 0,
      topKeywords: topKeywords.map(k => ({ keyword: k.keyword, count: k.count }))
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch dashboard statistics'
    });
  }
}); 