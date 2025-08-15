# 批次變化圖表元件使用說明

## 概述

本專案實作了兩個可重複使用的前端元件，用於呈現批次變化數據的柱狀圖：

1. **BatchChangesChart.vue** - 專用的批次變化圖表元件
2. **BarChart.vue** - 通用的柱狀圖元件
3. **useBatchChanges.ts** - 批次變化數據處理的 composable

## 功能特色

### 圖表功能
- **X 軸**：批次時間（batch_capture_time）
- **Y 軸**：變化商品數量（changed_products_count）
- **圖表類型**：柱狀圖（bar chart）
- **多組資料**：按關鍵字分組顯示，不同顏色區分
- **Tooltip**：滑鼠移過顯示詳細資訊

### 批次序號計算
批次序號（n）的計算邏輯與 `keyword-runs.get.ts` 一致，按時間順序為每個關鍵字的批次編號。

## 元件使用方式

### 1. 專用元件：BatchChangesChart.vue

```vue
<template>
  <BatchChangesChart 
    title="批次變化分析"
    keywords="手機,筆電"
    from="2024-01-01T00:00:00"
    to="2024-12-31T23:59:59"
  />
</template>

<script setup>
// 元件會自動從 API 獲取數據並渲染圖表
</script>
```

**Props:**
- `title` (string, 可選): 圖表標題
- `keywords` (string, 可選): 關鍵字篩選，多個用逗號分隔
- `from` (string, 可選): 開始時間
- `to` (string, 可選): 結束時間
- `data` (BatchChangeData[], 可選): 直接傳入數據而不從 API 獲取

### 2. 通用元件：BarChart.vue

```vue
<template>
  <BarChart 
    title="自定義柱狀圖"
    :config="chartConfig"
    :loading="loading"
    :error="error"
    :on-retry="fetchData"
  />
</template>

<script setup>
import { BarChart } from '~/components/charts/BarChart.vue';

const chartConfig = {
  xAxisData: ['2024-01', '2024-02', '2024-03'],
  series: [
    {
      name: '系列1',
      data: [10, 20, 30],
      color: '#5470c6'
    },
    {
      name: '系列2', 
      data: [15, 25, 35],
      color: '#91cc75'
    }
  ],
  xAxisName: '時間',
  yAxisName: '數量',
  tooltipFormatter: (params) => {
    // 自定義 tooltip 格式
    return `自定義格式: ${params[0].value}`;
  }
};
</script>
```

**Props:**
- `title` (string, 可選): 圖表標題
- `config` (BarChartConfig): 圖表配置
- `loading` (boolean, 可選): 載入狀態
- `error` (string, 可選): 錯誤訊息
- `onRetry` (function, 可選): 重試函數

### 3. Composable：useBatchChanges.ts

```vue
<script setup>
import { useBatchChanges } from '~/composables/useBatchChanges';

const { 
  data, 
  pending, 
  error, 
  fetchData, 
  toChartConfig, 
  formatTime 
} = useBatchChanges();

// 獲取數據
await fetchData({
  keywords: '手機,筆電',
  from: '2024-01-01T00:00:00',
  to: '2024-12-31T23:59:59'
});

// 轉換為圖表配置
const chartConfig = toChartConfig();
</script>
```

## 數據格式

### BatchChangeData 介面

```typescript
interface BatchChangeData {
  keyword: string;                    // 關鍵字
  batch_capture_time: string;         // 批次時間 (ISO datetime)
  total_products_in_batch: number;    // 該批次總商品數
  changed_products_count: number;     // 變化商品數量
  total_change_events: number;        // 變化事件總數
  batch_index: number;                // 批次序號 (第 n 次)
}
```

### BarChartConfig 介面

```typescript
interface BarChartConfig {
  xAxisData: string[];                // X 軸數據
  series: BarChartSeries[];           // 系列數據
  xAxisName?: string;                 // X 軸名稱
  yAxisName?: string;                 // Y 軸名稱
  tooltipFormatter?: (params: any) => string; // 自定義 tooltip
  colors?: string[];                  // 自定義顏色
}

interface BarChartSeries {
  name: string;                       // 系列名稱
  data: number[];                     // 數據陣列
  color?: string;                     // 自定義顏色
}
```

## API 端點

### GET /api/analysis/batch-changes

**查詢參數:**
- `keywords` (可選): 關鍵字篩選，多個用逗號分隔
- `from` (可選): 開始時間
- `to` (可選): 結束時間

**回應格式:**
```json
{
  "success": true,
  "data": [
    {
      "keyword": "手機",
      "batch_capture_time": "2024-01-15T10:30:00Z",
      "total_products_in_batch": 50,
      "changed_products_count": 5,
      "total_change_events": 8,
      "batch_index": 1
    }
  ]
}
```

## 使用範例

完整的使用範例請參考 `pages/batch-changes.vue`，該頁面展示了：

1. 篩選面板的使用
2. 兩種元件的並排展示
3. 原始數據的表格顯示
4. 錯誤處理和重試機制

## 自定義樣式

圖表使用 ECharts 渲染，可以通過以下方式自定義：

1. **顏色**: 在 `BarChartConfig` 中設定 `colors` 陣列
2. **Tooltip**: 自定義 `tooltipFormatter` 函數
3. **軸標籤**: 設定 `xAxisName` 和 `yAxisName`
4. **圖表大小**: 修改元件的 CSS 類別

## 注意事項

1. 元件依賴 ECharts 和 vue-echarts，確保已正確安裝
2. 批次序號計算邏輯與現有的 keyword-runs API 保持一致
3. 時間格式化使用台灣地區設定
4. 圖表支援響應式設計，會自動調整大小
