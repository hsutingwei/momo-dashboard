# Tailwind CSS 遷移文檔

## 概述

本項目已成功從內聯樣式遷移到 Tailwind CSS，提供了更好的響應式設計和維護性。

## 配置詳情

### 1. 安裝的依賴
```bash
pnpm add -D tailwindcss postcss autoprefixer @tailwindcss/forms @tailwindcss/typography
```

### 2. 配置文件
- `tailwind.config.js` - Tailwind CSS 主配置
- `postcss.config.js` - PostCSS 配置
- `assets/css/tailwind.css` - Tailwind CSS 入口文件

### 3. Nuxt 配置
在 `nuxt.config.ts` 中添加了 CSS 引用：
```typescript
css: ['~/assets/css/tailwind.css']
```

## 自定義組件類別

### 按鈕組件
- `.btn-primary` - 主要按鈕樣式
- `.btn-secondary` - 次要按鈕樣式  
- `.btn-danger` - 危險按鈕樣式

### 卡片組件
- `.card` - 通用卡片樣式

### 表單組件
- `.input-field` - 輸入框樣式

### 表格組件
- `.table-header` - 表格標題樣式
- `.table-cell` - 表格單元格樣式

### 徽章組件
- `.badge` - 基礎徽章樣式
- `.badge-primary` - 主要徽章
- `.badge-success` - 成功徽章
- `.badge-warning` - 警告徽章
- `.badge-danger` - 危險徽章

## 響應式設計

### 斷點
- `sm:` - 640px 及以上
- `md:` - 768px 及以上
- `lg:` - 1024px 及以上
- `xl:` - 1280px 及以上
- `2xl:` - 1536px 及以上

### 網格系統
- `grid-cols-1` - 單列（手機）
- `sm:grid-cols-2` - 雙列（平板）
- `lg:grid-cols-4` - 四列（桌面）

### 間距
- `p-4 sm:p-6 lg:p-8` - 響應式內邊距
- `gap-4 sm:gap-6` - 響應式間距

## 顏色系統

### 主色調
- `primary-50` 到 `primary-900` - 藍色系
- `gray-50` 到 `gray-900` - 灰色系

### 語義顏色
- `text-green-600` - 成功文字
- `text-red-600` - 錯誤文字
- `text-yellow-600` - 警告文字

## 遷移的頁面

### 1. Dashboard (`pages/index.vue`)
- 響應式 KPI 卡片網格
- 狀態指示器
- 成功消息樣式

### 2. Comments (`pages/comments.vue`)
- 搜尋篩選器
- 統計摘要卡片
- 評論表格
- 分頁組件

### 3. Products (`pages/products.vue`)
- 產品搜尋篩選器
- 產品表格
- 分頁組件

### 4. 組件
- `CommentTable.vue` - 評論表格組件
- `ProductTable.vue` - 產品表格組件
- `Navigation.vue` - 響應式導航組件

## 新增功能

### 1. 響應式導航
- 桌面端水平導航
- 移動端漢堡菜單
- 當前頁面高亮

### 2. 改進的用戶體驗
- 懸停效果
- 過渡動畫
- 更好的視覺層次

### 3. 移動端優化
- 觸摸友好的按鈕大小
- 適當的間距
- 可滾動的表格

## 使用建議

### 1. 開發時
```bash
pnpm dev
```

### 2. 構建時
```bash
pnpm build
```

### 3. 自定義樣式
在 `assets/css/tailwind.css` 中添加自定義組件：
```css
@layer components {
  .custom-component {
    @apply /* Tailwind 類別 */;
  }
}
```

## 注意事項

1. **Tailwind CSS v4 語法**：使用了新的 `@import "tailwindcss/preflight"` 語法
2. **CSS 警告**：構建時可能出現 CSS 語法警告，但不影響功能
3. **瀏覽器兼容性**：支持現代瀏覽器和 IE11+

## 性能優化

- 使用 PurgeCSS 自動移除未使用的樣式
- 響應式圖片和媒體查詢
- 優化的 CSS 打包大小

## 維護

- 定期更新 Tailwind CSS 版本
- 檢查自定義組件的使用情況
- 監控 CSS 包大小 