# Momo Dashboard - Sales & Comment Analytics

一個基於 Nuxt 3 + TypeScript + Tailwind CSS 的互動式 Dashboard，用於分析商品表現和客戶反饋趨勢。

## 🚀 功能特色

### 📊 核心功能
- **KPI 總覽**: 商品總數、評論總數、關鍵字統計、銷售變化商品數
- **商品管理**: 商品列表瀏覽、搜尋、分類、匯出
- **評論分析**: 客戶評論瀏覽、情緒分析、關鍵字篩選
- **銷售追蹤**: 銷售快照、變化趨勢、歷史數據
- **關聯分析**: LDA/TF-IDF 關鍵字分析、CKIP/BERT 情緒分析

### 🎯 分析功能
- **多種分析方法**: LDA、TF-IDF、CKIP、BERT
- **時間窗口控制**: 可調整分析區間
- **關聯性視覺化**: 特徵與銷售變化的相關性分析
- **趨勢圖表**: 銷售與分析指標的時間序列圖

### 🔧 技術特色
- **現代化架構**: Nuxt 3 + TypeScript + Tailwind CSS
- **資料庫整合**: PostgreSQL + Drizzle ORM
- **狀態管理**: Pinia
- **響應式設計**: 支援桌面和行動裝置
- **CSV 匯出**: 支援數據匯出功能

## 🛠️ 技術棧

- **前端框架**: Nuxt 3
- **程式語言**: TypeScript
- **樣式框架**: Tailwind CSS v4
- **狀態管理**: Pinia
- **資料庫**: PostgreSQL
- **ORM**: Drizzle ORM
- **圖表庫**: Chart.js (預留)
- **圖標**: Lucide Vue Next

## 📋 系統需求

- Node.js 18+
- PostgreSQL 12+
- pnpm (推薦) 或 npm

## 🚀 快速開始

### 1. 克隆專案
```bash
git clone <repository-url>
cd momo_dashboard
```

### 2. 安裝依賴
```bash
pnpm install
```

### 2.1. Tailwind CSS 配置 (已預配置)
專案已預先配置 Tailwind CSS v4，包含：
- 自定義組件類別 (按鈕、卡片、輸入框等)
- 響應式設計支援
- 顏色系統配置
- PostCSS 整合

### 3. 設置環境變數
建立 `.env` 文件：
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=postgres
```

### 4. 設置資料庫
```bash
# 連接到 PostgreSQL
psql -U postgres -d postgres

# 執行初始化腳本
\i server/database/init.sql
```

### 5. 啟動開發伺服器
```bash
pnpm dev
```

訪問 http://localhost:3000 查看應用程式。

## 📁 專案結構

```
momo_dashboard/
├── app.vue                 # 主應用程式
├── components/             # Vue 組件
│   ├── ui/                # 基礎 UI 組件
│   ├── Navigation.vue     # 響應式導航組件
│   ├── DashboardHeader.vue
│   ├── KPICard.vue
│   ├── FilterPanel.vue
│   ├── ProductTable.vue
│   ├── CommentTable.vue
│   ├── SalesTable.vue
│   └── AnalysisPanel.vue
├── stores/                # Pinia 狀態管理
│   └── dashboard.ts
├── server/                # 服務端 API
│   ├── api/              # API 路由
│   ├── database/         # 資料庫相關
│   │   ├── schema.ts
│   │   └── init.sql
│   └── utils/            # 工具函數
│       └── database.ts
├── assets/               # 靜態資源
│   └── css/
│       └── tailwind.css  # Tailwind CSS 入口文件
├── tailwind.config.js    # Tailwind CSS 配置
├── nuxt.config.ts        # Nuxt 配置 (包含 PostCSS)
└── FIGMA-UI/            # 原始設計檔案
```

## 🗄️ 資料庫結構

### 主要表格
- **products**: 商品資訊
- **product_comments**: 商品評論
- **sales_snapshots**: 銷售快照
- **keyword_analysis**: 關鍵字分析結果
- **sentiment_analysis**: 情緒分析結果
- **correlation_analysis**: 關聯性分析結果

## 📊 API 端點

- `GET /api/dashboard/stats` - 獲取 Dashboard KPI 統計
- `GET /api/products/index` - 獲取商品列表
- `GET /api/comments/index` - 獲取評論列表
- `GET /api/sales/index` - 獲取銷售數據
- `GET /api/analysis/correlation` - 獲取關聯性分析

## 🎨 設計特色

- **現代化 UI**: 基於 Figma 設計的現代化介面
- **響應式設計**: 支援各種螢幕尺寸
- **深色模式支援**: 預留深色主題支援
- **無障礙設計**: 符合 WCAG 標準

## 🔧 開發指南

### 新增功能
1. 在 `components/` 建立新組件
2. 在 `server/api/` 建立對應 API
3. 在 `stores/` 更新狀態管理
4. 更新 `app.vue` 整合新功能

### 樣式指南
- 使用 Tailwind CSS 類別
- 遵循設計系統的顏色和間距
- 支援響應式設計

#### 自定義組件類別
專案定義了以下自定義類別，可直接使用：
- `.btn-primary`, `.btn-secondary`, `.btn-danger`: 按鈕樣式
- `.card`: 卡片容器
- `.input-field`: 輸入框樣式
- `.table-header`, `.table-cell`: 表格樣式
- `.badge`, `.badge-primary`, `.badge-success`, `.badge-warning`, `.badge-danger`: 徽章樣式

#### 響應式設計
使用 Tailwind CSS 的響應式前綴：
- `sm:` (640px+): 平板設備
- `md:` (768px+): 小型桌面
- `lg:` (1024px+): 桌面設備
- `xl:` (1280px+): 大型桌面

### 資料庫操作
- 使用 Drizzle ORM 進行資料庫操作
- 在 `server/database/schema.ts` 定義 schema
- 使用 `server/utils/database.ts` 進行連接

## 📈 未來規劃

- [ ] 整合 Chart.js 圖表庫
- [ ] 實作深色模式
- [ ] 新增更多分析算法
- [ ] 實作即時數據更新
- [ ] 新增用戶權限管理
- [ ] 優化性能和分析功能

## 🎯 Tailwind CSS 遷移完成

### ✅ 已完成的工作
- [x] 從內聯樣式遷移到 Tailwind CSS v4
- [x] 實現響應式設計 (RWD)
- [x] 創建自定義組件類別
- [x] 配置 PostCSS 和 Nuxt 整合
- [x] 解決 Tailwind CSS v4 兼容性問題
- [x] 添加響應式導航組件
- [x] 創建測試頁面 (`/test`)

### 🔧 技術細節
- **Tailwind CSS v4**: 使用最新的 v4 版本
- **PostCSS 配置**: 整合到 `nuxt.config.ts`
- **自定義樣式**: 使用標準 CSS 而非 `@apply` 指令
- **響應式設計**: 支援所有設備尺寸

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支
3. 提交變更
4. 發起 Pull Request

## 📄 授權

MIT License

## 📞 支援

如有問題或建議，請開啟 Issue 或聯繫開發團隊。
