import postgres from 'postgres';

// 資料庫連接配置
const connectionString = `postgresql://postgres:123456@localhost:5432/postgres`;

async function testConnection() {
  const sql = postgres(connectionString, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    console.log('Testing database connection...');
    
    // 測試連接
    const result = await sql`SELECT version()`;
    console.log('✅ Database connection successful!');
    console.log('PostgreSQL version:', result[0].version);
    
    // 測試查詢 products 表
    const products = await sql`SELECT COUNT(*) as count FROM products`;
    console.log('✅ Products table accessible!');
    console.log('Products count:', products[0].count);
    
    // 測試查詢 product_comments 表
    const comments = await sql`SELECT COUNT(*) as count FROM product_comments`;
    console.log('✅ Product comments table accessible!');
    console.log('Comments count:', comments[0].count);
    
    // 測試查詢 sales_snapshots 表
    const sales = await sql`SELECT COUNT(*) as count FROM sales_snapshots`;
    console.log('✅ Sales snapshots table accessible!');
    console.log('Sales count:', sales[0].count);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await sql.end();
  }
}

testConnection(); 