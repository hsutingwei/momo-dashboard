import { Pool } from 'pg';

// 從環境變數獲取資料庫配置
const config = useRuntimeConfig();

const pool = new Pool({
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  max: 20, // 最大連線數
  idleTimeoutMillis: 30000, // 閒置連線超時
  connectionTimeoutMillis: 2000, // 連線超時
});

// 通用查詢函式
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
}

// 測試連線
export async function testConnection(): Promise<boolean> {
  try {
    await query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

// 關閉連線池
export async function closePool(): Promise<void> {
  await pool.end();
} 