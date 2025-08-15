<template>
  <Modal 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)" 
    title="銷售下降商品明細" 
    class="max-w-6xl"
  >
    <div class="space-y-6">
      <!-- 篩選面板 -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 mb-3">篩選條件</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">關鍵字</label>
            <input 
              v-model="filters.keywords" 
              type="text" 
              placeholder="輸入關鍵字，多個用逗號分隔"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">開始時間</label>
            <input 
              v-model="filters.from" 
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">結束時間</label>
            <input 
              v-model="filters.to" 
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        <div class="mt-3 flex gap-2">
          <button 
            @click="applyFilters" 
            class="btn-primary text-sm px-4 py-2"
            :disabled="loading"
          >
            {{ loading ? '載入中...' : '套用篩選' }}
          </button>
          <button 
            @click="clearFilters" 
            class="btn-secondary text-sm px-4 py-2"
          >
            清除篩選
          </button>
        </div>
      </div>

      <!-- 統計資訊 -->
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          共找到 <span class="font-semibold text-gray-900">{{ totalCount }}</span> 個下降商品
        </div>
        <div class="text-sm text-gray-600">
          顯示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalCount) }} 筆
        </div>
      </div>

      <!-- 載入狀態 -->
      <div v-if="loading" class="text-center py-8">
        <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-gray-500">載入資料中...</p>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 p-4 rounded-lg">
        <p class="text-red-600">{{ error }}</p>
        <button @click="fetchData" class="btn-primary mt-2 text-sm">重試</button>
      </div>

      <!-- 數據表格 -->
      <div v-else-if="items.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品 ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名稱</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">關鍵字</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">批次時間</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">原始時間</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">銷售變化</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">變化量</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in items" :key="`${item.product_id}-${item.batch_capture_time}-${item.original_capture_time}`">
              <td class="px-4 py-4 whitespace-nowrap text-sm">
                <a 
                  v-if="item.product_link" 
                  :href="item.product_link" 
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {{ item.product_id }}
                </a>
                <span v-else class="text-gray-500">{{ item.product_id }}</span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {{ item.product_name }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.keyword }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(item.batch_capture_time) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(item.original_capture_time) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm">
                <span v-if="item.prev_sales !== null" class="text-gray-600">
                  {{ formatNumber(item.prev_sales) }} → {{ formatNumber(item.sales_count) }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm">
                <span v-if="item.delta < 0" class="text-red-600 font-medium">
                  {{ formatNumber(item.delta) }}
                </span>
                <span v-else class="text-gray-500">
                  {{ formatNumber(item.delta) }}
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm">
                <button 
                  @click="viewProduct(item.product_id)"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  查看商品
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空狀態 -->
      <div v-else class="text-center py-8">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        <p class="text-gray-500">目前沒有下降商品</p>
      </div>

      <!-- 分頁 -->
      <div v-if="totalCount > pageSize" class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          每頁 {{ pageSize }} 筆
        </div>
        <div class="flex gap-2">
          <button 
            @click="prevPage" 
            :disabled="currentPage <= 1"
            class="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            上一頁
          </button>
          <span class="px-3 py-1 text-sm text-gray-600">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <button 
            @click="nextPage" 
            :disabled="currentPage >= totalPages"
            class="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            下一頁
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { SalesDropItem, SalesDropResp } from '~/types';
import Modal from '~/components/ui/Modal.vue';

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

// 響應式數據
const items = ref<SalesDropItem[]>([]);
const totalCount = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);

// 分頁設定
const pageSize = 50;
const currentPage = ref(1);

// 篩選條件
const filters = ref({
  keywords: '',
  from: '',
  to: ''
});

// 計算屬性
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));

// 格式化函數
const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatNumber = (num: number): string => {
  return (num || 0).toLocaleString();
};

// 獲取數據
const fetchData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const params = new URLSearchParams({
      limit: pageSize.toString(),
      offset: ((currentPage.value - 1) * pageSize).toString()
    });
    
    if (filters.value.keywords) params.append('keywords', filters.value.keywords);
    if (filters.value.from) params.append('from', filters.value.from);
    if (filters.value.to) params.append('to', filters.value.to);
    
    const response = await $fetch(`/api/analysis/sales-drops?${params}`) as SalesDropResp;
    items.value = response.items;
    totalCount.value = response.count;
  } catch (err: any) {
    error.value = err.message || '載入數據失敗';
    console.error('Error fetching sales drops data:', err);
  } finally {
    loading.value = false;
  }
};

// 篩選功能
const applyFilters = () => {
  currentPage.value = 1;
  fetchData();
};

const clearFilters = () => {
  filters.value = {
    keywords: '',
    from: '',
    to: ''
  };
  currentPage.value = 1;
  fetchData();
};

// 分頁功能
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchData();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchData();
  }
};

// 查看商品
const viewProduct = (productId: number) => {
  navigateTo({ 
    path: '/products', 
    query: { product_id: productId.toString() } 
  });
};

// 監聽 Modal 開啟
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    fetchData();
  }
});
</script>
