<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">批次變化分析</h1>
    
    <!-- 篩選面板 -->
    <div class="card mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">篩選條件</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">關鍵字</label>
          <input 
            v-model="filters.keywords" 
            type="text" 
            placeholder="輸入關鍵字，多個用逗號分隔"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">開始時間</label>
          <input 
            v-model="filters.from" 
            type="datetime-local"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">結束時間</label>
          <input 
            v-model="filters.to" 
            type="datetime-local"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div class="mt-4">
        <button 
          @click="applyFilters" 
          class="btn-primary mr-2"
        >
          套用篩選
        </button>
        <button 
          @click="clearFilters" 
          class="btn-secondary"
        >
          清除篩選
        </button>
      </div>
    </div>

    <!-- 圖表展示 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 方法一：使用專用的 BatchChangesChart 元件 -->
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">方法一：專用元件</h2>
        <BatchChangesChart 
          title="批次變化分析 - 專用元件"
          :keywords="filters.keywords"
          :from="filters.from"
          :to="filters.to"
        />
      </div>

      <!-- 方法二：使用通用 BarChart 元件 -->
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">方法二：通用元件</h2>
        <BarChart 
          title="批次變化分析 - 通用元件"
          :config="chartConfig"
          :loading="pending"
          :error="error"
          :on-retry="fetchData"
        />
      </div>
    </div>

    <!-- 數據表格 -->
    <div class="card mt-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">原始數據</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">關鍵字</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">批次序號</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">批次時間</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">總商品數</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">變化商品數</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">變化事件數</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in data" :key="`${item.keyword}-${item.batch_capture_time}`">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.keyword }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">第{{ item.batch_index }}次</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatTime(item.batch_capture_time) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.total_products_in_batch }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.changed_products_count }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.total_change_events }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { BatchChangeData } from '~/types';
import { useBatchChanges } from '~/composables/useBatchChanges';

// 篩選條件
const filters = ref({
  keywords: '',
  from: '',
  to: ''
});

// 使用 composable
const { 
  data, 
  pending, 
  error, 
  fetchData, 
  toChartConfig, 
  formatTime 
} = useBatchChanges();

// 圖表配置
const chartConfig = computed(() => toChartConfig());

// 套用篩選
const applyFilters = () => {
  fetchData({
    keywords: filters.value.keywords || undefined,
    from: filters.value.from || undefined,
    to: filters.value.to || undefined
  });
};

// 清除篩選
const clearFilters = () => {
  filters.value = {
    keywords: '',
    from: '',
    to: ''
  };
  applyFilters();
};

// 組件掛載時獲取數據
onMounted(() => {
  applyFilters();
});
</script>
