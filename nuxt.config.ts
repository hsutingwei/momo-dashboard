// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // 環境變數
  runtimeConfig: {
    // 私有變數（僅服務端）
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: parseInt(process.env.DB_PORT || '5432'),
    dbUser: process.env.DB_USER || 'postgres',
    dbPassword: process.env.DB_PASSWORD || '123456',
    dbName: process.env.DB_NAME || 'postgres',
    
    // 公開變數（客戶端也可訪問）
    public: {
      appName: 'Momo Dashboard'
    }
  },
  
  // 應用程式配置
  app: {
    head: {
      title: 'Momo Dashboard - Sales & Comment Analytics',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Interactive dashboard for analyzing product performance and customer feedback trends' }
      ]
    }
  }
})
