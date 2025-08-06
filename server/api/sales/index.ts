import { db } from '~/server/utils/database';
import { salesSnapshots, products } from '~/server/database/schema';
import { sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const productId = query.productId as string;
    const limit = parseInt(query.limit as string) || 50;
    const offset = parseInt(query.offset as string) || 0;

    let salesQuery = db
      .select({
        id: salesSnapshots.id,
        productId: salesSnapshots.productId,
        salesCount: salesSnapshots.salesCount,
        salesUnit: salesSnapshots.salesUnit,
        captureTime: salesSnapshots.captureTime,
        createdAt: salesSnapshots.createdAt,
        productName: products.name, // Joined field
        productKeyword: products.keyword // Joined field
      })
      .from(salesSnapshots)
      .leftJoin(products, sql`${salesSnapshots.productId} = ${products.id}`);

    if (productId && productId !== 'all') {
      salesQuery = salesQuery.where(sql`${salesSnapshots.productId} = ${parseInt(productId)}`);
    }

    salesQuery = salesQuery.limit(limit).offset(offset);
    const salesList = await salesQuery;

    let countQuery = db.select({ count: sql<number>`count(*)` }).from(salesSnapshots);
    if (productId && productId !== 'all') {
      countQuery = countQuery.where(sql`product_id = ${parseInt(productId)}`);
    }
    const totalCount = await countQuery;

    return {
      sales: salesList,
      total: totalCount[0]?.count || 0,
      limit,
      offset
    };
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch sales data'
    });
  }
}); 