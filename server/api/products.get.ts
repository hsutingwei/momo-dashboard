import { query } from '../utils/db';

interface Product {
  id: number;
  name: string;
  price: number;
  product_link: string;
  keyword: string;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default defineEventHandler(async (event) => {
  try {
    const { 
      product_id, 
      name, 
      keyword,
      sortBy = 'id', 
      sortOrder = 'asc', 
      limit = '20', 
      offset = '0',
      page = '1'
    } = getQuery(event);

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    // 篩選條件
    if (product_id) {
      sql += ` AND id = $${params.length + 1}`;
      params.push(parseInt(product_id as string));
    }
    if (name) {
      sql += ` AND name ILIKE '%' || $${params.length + 1} || '%'`;
      params.push(name);
    }
    if (keyword) {
      sql += ` AND keyword ILIKE '%' || $${params.length + 1} || '%'`;
      params.push(keyword);
    }

    // 計算總筆數
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await query<{ total: number }>(countSql, params);
    const total = countResult[0]?.total || 0;

    // 排序
    const safeFields = ['id', 'name', 'price', 'keyword', 'created_at', 'updated_at'];
    const field = safeFields.includes(sortBy as string) ? sortBy : 'id';
    const order = (sortOrder === 'desc' ? 'DESC' : 'ASC');
    sql += ` ORDER BY ${field} ${order}`;

    // 分頁
    const limitNum = parseInt(limit as string) || 20;
    const offsetNum = parseInt(offset as string) || 0;
    sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limitNum, offsetNum);

    const rows = await query<Product>(sql, params);
    const currentPage = parseInt(page as string) || 1;
    const totalPages = Math.ceil(total / limitNum);

    return {
      items: rows,
      total,
      page: currentPage,
      limit: limitNum,
      totalPages
    } as ProductsResponse;

  } catch (error) {
    console.error('Error fetching products:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products'
    });
  }
}); 