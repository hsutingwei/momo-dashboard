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
        product_id: salesSnapshots.product_id,
        sales_count: salesSnapshots.sales_count,
        capture_time: salesSnapshots.capture_time,
        previous_count: salesSnapshots.previous_count,
        change_percent: salesSnapshots.change_percent,
        product_name: products.name
      })
      .from(salesSnapshots)
      .leftJoin(products, sql`${salesSnapshots.product_id} = ${products.id}`);

    // 商品過濾
    if (productId && productId !== 'all') {
      salesQuery = salesQuery.where(sql`${salesSnapshots.product_id} = ${productId}`);
    }

    // 分頁
    salesQuery = salesQuery.limit(limit).offset(offset);

    const salesList = await salesQuery;

    // 總數查詢
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(salesSnapshots);
    if (productId && productId !== 'all') {
      countQuery = countQuery.where(sql`product_id = ${productId}`);
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