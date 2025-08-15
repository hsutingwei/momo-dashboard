<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">批次變化圖表測試</h1>
    
    <!-- 測試數據 -->
    <div class="card mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">測試數據</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">關鍵字</label>
          <input 
            v-model="testKeywords" 
            type="text" 
            placeholder="輸入關鍵字，多個用逗號分隔"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex items-end">
          <button 
            @click="testAPI" 
            class="btn-primary"
            :disabled="testing"
          >
            {{ testing ? '測試中...' : '測試 API' }}
          </button>
        </div>
      </div>
    </div>

    <!-- API 測試結果 -->
    <div v-if="apiResult" class="card mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">API 測試結果</h2>
      <div class="bg-gray-50 p-4 rounded-md">
        <pre class="text-sm overflow-auto">{{ JSON.stringify(apiResult, null, 2) }}</pre>
      </div>
    </div>

    <!-- 圖表展示 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 專用元件 -->
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">專用元件測試</h2>
        <BatchChangesChart 
          title="批次變化分析 - 專用元件"
          :keywords="testKeywords"
        />
      </div>

      <!-- 通用元件 -->
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">通用元件測試</h2>
        <BarChart 
          title="批次變化分析 - 通用元件"
          :config="testChartConfig"
          :loading="testing"
          :error="apiError"
          :on-retry="testAPI"
        />
      </div>
    </div>

    <!-- 手動數據測試 -->
    <div class="card mt-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">手動數據測試</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 class="text-md font-semibold text-gray-900 mb-2">使用專用元件</h3>
          <BatchChangesChart 
            title="手動數據 - 專用元件"
            :data="mockData"
          />
        </div>
        <div>
          <h3 class="text-md font-semibold text-gray-900 mb-2">使用通用元件</h3>
          <BarChart 
            title="手動數據 - 通用元件"
            :config="mockChartConfig"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { BatchChangeData } from '~/types';
import type { BarChartConfig } from '~/components/charts/BarChart.vue';

// 測試參數
const testKeywords = ref('手機,筆電');
const testing = ref(false);
const apiResult = ref<any>(null);
const apiError = ref<string | null>(null);

// 模擬數據
const mockData: BatchChangeData[] = [
  {
    keyword: '手機',
    batch_capture_time: '2024-01-15T10:30:00Z',
    total_products_in_batch: 50,
    changed_products_count: 5,
    total_change_events: 8,
    batch_index: 1
  },
  {
    keyword: '手機',
    batch_capture_time: '2024-01-16T14:20:00Z',
    total_products_in_batch: 52,
    changed_products_count: 3,
    total_change_events: 5,
    batch_index: 2
  },
  {
    keyword: '筆電',
    batch_capture_time: '2024-01-15T10:30:00Z',
    total_products_in_batch: 30,
    changed_products_count: 2,
    total_change_events: 3,
    batch_index: 1
  },
  {
    keyword: '筆電',
    batch_capture_time: '2024-01-16T14:20:00Z',
    total_products_in_batch: 32,
    changed_products_count: 4,
    total_change_events: 6,
    batch_index: 2
  }
];

// 模擬圖表配置
const mockChartConfig = computed<BarChartConfig>(() => {
  const keywordGroups = new Map<string, BatchChangeData[]>();
  const allBatchTimes = new Set<string>();

  mockData.forEach(item => {
    if (!keywordGroups.has(item.keyword)) {
      keywordGroups.set(item.keyword, []);
    }
    keywordGroups.get(item.keyword)!.push(item);
    allBatchTimes.add(item.batch_capture_time);
  });

  const sortedBatchTimes = Array.from(allBatchTimes).sort();
  const series = Array.from(keywordGroups.entries()).map(([keyword, items], index) => {
    const seriesData = sortedBatchTimes.map(batchTime => {
      const item = items.find(i => i.batch_capture_time === batchTime);
      return item ? item.changed_products_count : 0;
    });

    return {
      name: keyword,
      data: seriesData,
      color: ['#5470c6', '#91cc75'][index % 2]
    };
  });

  const xAxisData = sortedBatchTimes.map(time => {
    const date = new Date(time);
    return date.toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  return {
    xAxisData,
    series,
    xAxisName: '批次時間',
    yAxisName: '變化商品數量',
    tooltipFormatter: (params: any) => {
      let result = `${params[0].axisValue}<br/>`;
      params.forEach((param: any) => {
        if (param.value > 0) {
          const item = mockData.find(d =>
            d.keyword === param.seriesName &&
            new Date(d.batch_capture_time).toLocaleString('zh-TW', {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }) === param.axisValue
          );
          const batchIndex = item ? item.batch_index : '';
          result += `${param.marker}${param.seriesName} 第${batchIndex}次: ${param.value}個商品<br/>`;
        }
      });
      return result;
    }
  };
});

// 測試圖表配置（從 API 數據轉換）
const testChartConfig = computed<BarChartConfig>(() => {
  if (!apiResult.value?.data?.length) {
    return {
      xAxisData: [],
      series: []
    };
  }

  const { useBatchChanges } = useBatchChanges();
  const { toChartConfig } = useBatchChanges();
  
  // 這裡需要模擬數據轉換，因為 composable 需要響應式數據
  const data = apiResult.value.data;
  const keywordGroups = new Map<string, any[]>();
  const allBatchTimes = new Set<string>();

  data.forEach((item: any) => {
    if (!keywordGroups.has(item.keyword)) {
      keywordGroups.set(item.keyword, []);
    }
    keywordGroups.get(item.keyword)!.push(item);
    allBatchTimes.add(item.batch_capture_time);
  });

  const sortedBatchTimes = Array.from(allBatchTimes).sort();
  const series = Array.from(keywordGroups.entries()).map(([keyword, items], index) => {
    const seriesData = sortedBatchTimes.map(batchTime => {
      const item = items.find((i: any) => i.batch_capture_time === batchTime);
      return item ? item.changed_products_count : 0;
    });

    return {
      name: keyword,
      data: seriesData,
      color: ['#5470c6', '#91cc75', '#fac858', '#ee6666'][index % 4]
    };
  });

  const xAxisData = sortedBatchTimes.map(time => {
    const date = new Date(time);
    return date.toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  return {
    xAxisData,
    series,
    xAxisName: '批次時間',
    yAxisName: '變化商品數量'
  };
});

// 測試 API
const testAPI = async () => {
  testing.value = true;
  apiError.value = null;
  
  try {
    const params = new URLSearchParams();
    if (testKeywords.value) {
      params.append('keywords', testKeywords.value);
    }
    
    const response = await $fetch(`/api/analysis/batch-changes?${params}`) as any;
    apiResult.value = response;
  } catch (err: any) {
    apiError.value = err.message || 'API 測試失敗';
    console.error('API test error:', err);
  } finally {
    testing.value = false;
  }
};
</script>
