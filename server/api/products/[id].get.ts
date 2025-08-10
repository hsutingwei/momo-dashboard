import { query } from '../../utils/db';
import type { Product } from '~/types';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
      });
    }

    const sql = `
      SELECT 
        id,
        name,
        price,
        product_link,
        keyword,
        is_complete,
        created_at,
        updated_at
      FROM products 
      WHERE id = $1
    `;

    const rows = await query<Product>(sql, [parseInt(id)]);
    
    if (rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      });
    }

    return rows[0];

  } catch (error) {
    console.error('Error fetching product:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch product'
    });
  }
}); 