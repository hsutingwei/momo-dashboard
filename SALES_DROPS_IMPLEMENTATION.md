# 銷售下降商品功能實作總結

## 已完成的功能

### 1. API 端點實作 ✅
- **檔案**: `server/api/analysis/sales-drops.get.ts`
- **功能**: 提供銷售下降商品分析的 API 端點
- **SQL 邏輯**: 完全按照需求說明實作，包含：
  - 評論批次對齊（<= 快照時間 最近一筆評論時間）
  - 銷售快照標記和比較
  - 下降商品識別（sales_count < prev_sales）
  - 商品資訊 JOIN（name, keyword, product_link）
  - 分頁支援（limit, offset）

### 2. 類型定義 ✅
- **檔案**: `types/index.ts`
- **新增**: 
  - `SalesDropItem` 介面
  - `SalesDropResp` 介面
- **包含**: 所有必要欄位（product_id, product_name, keyword, delta 等）

### 3. Composable 實作 ✅
- **檔案**: `composables/useSalesDrops.ts`
- **功能**: 銷售下降商品數據的邏輯處理
- **特色**:
  - 獲取下降商品數量
  - 錯誤處理和載入狀態
  - 響應式數據管理

### 4. Modal 元件實作 ✅
- **檔案**: `components/SalesDropsModal.vue`
- **功能**: 銷售下降商品明細的 Modal 元件
- **特色**:
  - 完整的篩選功能（關鍵字、時間範圍）
  - 分頁支援
  - 詳細的數據表格
  - 商品連結和跳轉功能
  - 錯誤處理和載入狀態

### 5. 首頁整合 ✅
- **檔案**: `pages/index.vue`
- **功能**: 在首頁添加銷售下降商品數卡片
- **特色**:
  - 紅色高亮顯示
  - 可點擊打開 Modal
  - 載入狀態和錯誤處理
  - 響應式設計

### 6. 測試頁面 ✅
- **檔案**: `pages/test-sales-drops.vue`
- **功能**: 用於測試和驗證銷售下降商品功能
- **特色**:
  - API 測試功能
  - 功能展示
  - 手動操作測試

## 功能特色

### 銷售下降定義
- ✅ 某商品在後續的評論批次中，其 `sales_count` 小於前一批（同商品、相鄰批次）時，即視為該商品發生下降
- ✅ 計算有幾個商品出現此現象（去重數量）

### API 功能
- ✅ **查詢參數**: `from`, `to`, `keywords`（逗號分隔）、`limit`, `offset`
- ✅ **回應格式**: 包含 `count` 和 `items` 陣列
- ✅ **商品資訊**: JOIN products 表獲取 name, keyword, product_link
- ✅ **變化計算**: 回傳 `prev_sales`, `sales_count`, `delta`

### 前端功能
- ✅ **首頁卡片**: 紅色高亮顯示下降商品數量
- ✅ **Modal 明細**: 完整的篩選和分頁功能
- ✅ **表格顯示**: 包含所有必要欄位
- ✅ **互動功能**: 商品連結、跳轉到商品頁面
- ✅ **錯誤處理**: 完整的載入狀態和錯誤提示

## 使用方式

### 1. 首頁使用
```vue
<!-- 在首頁 KPI 卡片區域 -->
<div class="card cursor-pointer hover:shadow-lg transition-shadow" @click="openSalesDropsModal">
  <h3 class="text-sm font-medium text-gray-500 mb-3">銷售下降商品數</h3>
  <div class="flex items-center justify-between">
    <p class="text-3xl font-bold text-red-600">{{ formatNumber(salesDropsCount) }}</p>
    <svg class="w-5 h-5 text-red-500 ml-2">...</svg>
  </div>
  <p class="text-xs text-gray-500 mt-2">點擊查看明細</p>
</div>

<!-- Modal -->
<SalesDropsModal v-model="showSalesDropsModal" />
```

### 2. 使用 Composable
```vue
<script setup>
import { useSalesDrops } from '~/composables/useSalesDrops';

const { count, loading, error, fetchCount } = useSalesDrops();

// 獲取數量
await fetchCount();

// 帶篩選條件
await fetchCount({
  keywords: '手機,筆電',
  from: '2024-01-01T00:00:00',
  to: '2024-12-31T23:59:59'
});
</script>
```

### 3. API 直接使用
```javascript
// 獲取數量
const countResponse = await $fetch('/api/analysis/sales-drops?limit=0');

// 獲取詳細列表
const listResponse = await $fetch('/api/analysis/sales-drops?limit=50&offset=0&keywords=手機');
```

## API 端點詳情

### GET /api/analysis/sales-drops

**查詢參數:**
- `keywords` (可選): 關鍵字篩選，多個用逗號分隔
- `from` (可選): 開始時間
- `to` (可選): 結束時間
- `limit` (可選): 每頁數量，預設 50
- `offset` (可選): 偏移量，預設 0

**回應格式:**
```json
{
  "success": true,
  "count": 25,
  "items": [
    {
      "product_id": 123,
      "product_name": "iPhone 15 Pro",
      "keyword": "手機",
      "product_link": "https://example.com/product/123",
      "batch_capture_time": "2024-01-15T10:30:00Z",
      "original_capture_time": "2024-01-15T10:25:00Z",
      "prev_sales": 150,
      "sales_count": 120,
      "delta": -30
    }
  ]
}
```

## 互動流程

1. **首頁載入** → 呼叫 `/api/analysis/sales-drops?limit=0` 獲取數量
2. **顯示紅色高亮數字** → 在 KPI 卡片區域顯示
3. **點擊卡片** → 打開 Modal
4. **Modal 開啟** → 呼叫 `/api/analysis/sales-drops?limit=50&offset=0` 獲取列表
5. **使用者操作** → 分頁、篩選、點擊商品連結
6. **商品跳轉** → 點擊「查看商品」跳轉到 `/products?product_id=xxx`

## 技術架構

### 後端技術
- **SQL**: 複雜的批次對齊和下降識別邏輯
- **PostgreSQL**: 使用 LATERAL JOIN 和窗口函數
- **Nuxt 3**: API 路由處理

### 前端技術
- **Vue 3**: Composition API
- **TypeScript**: 完整的類型定義
- **Tailwind CSS**: 響應式設計
- **ECharts**: 圖表渲染（未來可擴展）

### 架構模式
- **API 優先**: 清晰的 API 設計
- **Composable**: 邏輯復用
- **元件化**: 可重複使用的 Modal 元件
- **類型安全**: 完整的 TypeScript 支援

## 測試和驗證

### 可用的測試頁面
1. **http://localhost:3000/** - 首頁功能展示
2. **http://localhost:3000/test-sales-drops** - 功能測試

### 測試內容
- ✅ API 端點功能
- ✅ 數據篩選和分頁
- ✅ Modal 元件渲染
- ✅ 錯誤處理
- ✅ 響應式設計
- ✅ 商品跳轉功能

## 下一步建議

1. **性能優化**: 對於大量數據的查詢優化
2. **快取機制**: 添加 Redis 快取
3. **匯出功能**: 支援 CSV 匯出
4. **圖表展示**: 添加銷售下降趨勢圖
5. **通知功能**: 銷售下降警報
6. **更多篩選**: 支援更多維度的數據篩選

## 總結

所有需求都已完整實作，包括：
- ✅ 銷售下降商品定義和識別
- ✅ 完整的 API 端點
- ✅ 首頁高亮顯示
- ✅ 詳細的 Modal 明細
- ✅ 篩選和分頁功能
- ✅ 商品跳轉功能
- ✅ 完整的錯誤處理
- ✅ 響應式設計

功能已經準備好投入使用，可以立即在專案中使用。
