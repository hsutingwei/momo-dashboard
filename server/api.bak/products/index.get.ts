import { db } from '~/server/utils/database';
import { products } from '~/server/database/schema';
import { sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const search = query.search as string;
    const limit = parseInt(query.limit as string) || 50;
    const offset = parseInt(query.offset as string) || 0;

    let productsQuery = db.select().from(products);

    // 搜尋過濾
    if (search) {
      productsQuery = productsQuery.where(
        sql`(name ilike ${`%${search}%`} or keyword ilike ${`%${search}%`})`
      );
    }

    // 分頁
    productsQuery = productsQuery.limit(limit).offset(offset);

    const productList = await productsQuery;

    // 總數查詢
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(products);
    if (search) {
      countQuery = countQuery.where(
        sql`(name ilike ${`%${search}%`} or keyword ilike ${`%${search}%`})`
      );
    }
    const totalCount = await countQuery;

    return {
      products: productList,
      total: totalCount[0]?.count || 0,
      limit,
      offset
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products'
    });
  }
}); 