import { query } from '~/server/utils/db';

interface DashboardStats {
  total_products: number;
  total_comments: number;
  unique_keywords: number;
  products_with_sales_changes: number;
}

export default defineEventHandler(async (event) => {
  try {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM products) AS total_products,
        (SELECT COUNT(*) FROM product_comments) AS total_comments,
        (SELECT COUNT(DISTINCT keyword) FROM products WHERE keyword IS NOT NULL AND keyword <> '') AS unique_keywords,
        (SELECT COUNT(*) 
         FROM (
           SELECT product_id
           FROM sales_snapshots
           GROUP BY product_id
           HAVING MIN(sales_count) <> MAX(sales_count)
         ) AS changed
        ) AS products_with_sales_changes;
    `;

    const results = await query<DashboardStats>(sql);
    const stats = results[0];

    return {
      totalProducts: stats.total_products,
      totalComments: stats.total_comments,
      uniqueKeywords: stats.unique_keywords,
      productsWithSalesChanges: stats.products_with_sales_changes
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch dashboard stats'
    });
  }
}); 