# 圖表功能實作完成

## 🎯 已完成的功能

### 1. 總評論數統計
- **位置**: comments.vue 頁面第一張圖
- **功能**: 顯示總共幾則評論
- **實作**: 使用簡單的數字顯示卡片

### 2. 關鍵字比較 - 分批次評論數 (柱狀圖)
- **位置**: comments.vue 頁面第二張圖
- **條件**: 當沒有 product_id 篩選條件時顯示
- **功能**: 
  - 比較不同關鍵字在各批次的評論數
  - 向右對齊顯示（最新批次對齊）
  - 支援多關鍵字比較
- **API**: `/api/analysis/keyword-runs`
- **組件**: `KeywordRunsChart.vue`

### 3. 產品評論趨勢 (折線圖)
- **位置**: comments.vue 頁面第二張圖
- **條件**: 當有 product_id 篩選條件時顯示
- **功能**:
  - 顯示單一產品的評論數趨勢
  - X軸為爬蟲次數，Y軸為評論數
  - 支援 Tooltip 顯示時間和評論數
- **API**: `/api/analysis/product-runs`
- **組件**: `ProductRunsChart.vue`

### 4. 銷售變化統計
- **位置**: comments.vue 頁面第三張圖
- **功能**:
  - **無 product_id**: 顯示關鍵字銷售變化統計（柱狀圖）
    - 總變化事件數
    - 變化商品數
  - **有 product_id**: 顯示單一產品銷售變化次數（圓餅圖）
- **API**: `/api/analysis/sales-changes`
- **組件**: `SalesChangesChart.vue`

## 🛠️ 技術實作

### 後端 API
1. **keyword-runs.get.ts**: 關鍵字比較 API
   - 支援 keywords 參數（逗號分隔）
   - 支援 from/to 時間篩選
   - 使用複雜的 SQL 實現向右對齊

2. **product-runs.get.ts**: 產品評論趨勢 API
   - 支援 product_id 參數
   - 按時間順序排列數據

3. **sales-changes.get.ts**: 銷售變化 API
   - 支援有無 product_id 的雙模式
   - 使用 LAG 函數計算變化

### 前端組件
1. **KeywordRunsChart.vue**: 關鍵字比較柱狀圖
   - 使用 ECharts BarChart
   - 支援多系列數據
   - 自定義 Tooltip

2. **ProductRunsChart.vue**: 產品趨勢折線圖
   - 使用 ECharts LineChart
   - 平滑曲線和漸層填充
   - 時間標籤 Tooltip

3. **SalesChangesChart.vue**: 銷售變化圖表
   - 支援柱狀圖和圓餅圖
   - 根據篩選條件動態切換

### 圖表庫
- **Apache ECharts 5.6.0**: 主要圖表庫
- **vue-echarts 7.0.3**: Vue 3 整合
- **支援的圖表類型**: 柱狀圖、折線圖、圓餅圖

## 📊 圖表特色

### 響應式設計
- 所有圖表都支援響應式佈局
- 自動調整大小適應容器

### 互動功能
- **Tooltip**: 滑鼠懸停顯示詳細信息
- **圖例**: 可點擊隱藏/顯示系列
- **縮放**: 支援圖表縮放功能

### 視覺設計
- 使用 Tailwind CSS 配色方案
- 統一的卡片容器設計
- 載入和錯誤狀態處理

## 🔧 使用方式

### 訪問圖表
1. 啟動開發伺服器: `pnpm dev`
2. 訪問: http://localhost:3000/comments
3. 圖表會自動載入並顯示

### 篩選功能
- **關鍵字比較**: 在搜尋過濾器中輸入 product_id 來切換到產品趨勢圖
- **時間篩選**: 使用 capture_time 篩選來限制數據範圍

### 自定義關鍵字
- 修改 `KeywordRunsChart` 組件的 `keywords` prop
- 預設值: `'益生菌,口罩'`

## 📈 數據流程

1. **前端組件** → 發送 API 請求
2. **後端 API** → 執行 SQL 查詢
3. **資料庫** → 返回結果數據
4. **前端組件** → 處理數據並渲染圖表

## 🎨 樣式整合

所有圖表組件都使用 Tailwind CSS 類別：
- `.card`: 卡片容器
- `.btn-primary`: 重試按鈕
- 響應式類別: `h-96`, `text-center` 等

## ✅ 測試狀態

- ✅ 建置成功
- ✅ 開發伺服器運行正常
- ✅ API 端點已建立
- ✅ 圖表組件已整合
- ✅ 響應式設計已實作

## 🚀 下一步

1. 測試圖表功能是否正常顯示
2. 根據實際數據調整圖表樣式
3. 添加更多互動功能（如數據導出）
4. 優化圖表性能 