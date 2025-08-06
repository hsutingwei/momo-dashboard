import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '#app';

// 資料庫連接配置
const connectionString = `postgresql://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

// 建立 postgres 客戶端
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// 建立 drizzle ORM 實例
export const db = drizzle(client);

// 導出客戶端用於手動查詢
export { client }; 