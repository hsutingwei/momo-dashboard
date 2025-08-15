<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">銷售下降商品功能測試</h1>
    
    <!-- API 測試 -->
    <div class="card mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">API 測試</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
      
      <!-- 測試結果 -->
      <div v-if="apiResult" class="bg-gray-50 p-4 rounded-md">
        <h3 class="text-sm font-medium text-gray-700 mb-2">API 回應：</h3>
        <div class="text-sm">
          <p><strong>總數：</strong>{{ apiResult.count }}</p>
          <p><strong>項目數：</strong>{{ apiResult.items?.length || 0 }}</p>
        </div>
        <details class="mt-2">
          <summary class="cursor-pointer text-blue-600 hover:text-blue-800">查看完整回應</summary>
          <pre class="text-xs mt-2 overflow-auto bg-white p-2 rounded border">{{ JSON.stringify(apiResult, null, 2) }}</pre>
        </details>
      </div>
    </div>

    <!-- 功能展示 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 銷售下降商品卡片 -->
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">銷售下降商品卡片</h2>
        <div class="card cursor-pointer hover:shadow-lg transition-shadow" @click="openModal">
          <h3 class="text-sm font-medium text-gray-500 mb-3">銷售下降商品數</h3>
          <div class="flex items-center justify-between">
            <div v-if="loading" class="flex items-center">
              <div class="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              <span class="text-gray-400">載入中...</span>
            </div>
            <div v-else-if="error" class="text-red-600 text-sm">
              {{ error }}
            </div>
            <div v-else class="flex items-center">
              <p class="text-3xl font-bold text-red-600">{{ formatNumber(count) }}</p>
              <svg class="w-5 h-5 text-red-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">點擊查看明細</p>
        </div>
      </div>

      <!-- 手動觸發 -->
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">手動操作</h2>
        <div class="space-y-3">
          <button @click="refreshCount" class="btn-primary w-full">
            重新載入數量
          </button>
          <button @click="openModal" class="btn-secondary w-full">
            打開 Modal
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <SalesDropsModal v-model="showModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSalesDrops } from '~/composables/useSalesDrops';
import { formatNumber } from '~/utils/global';
import SalesDropsModal from '~/components/SalesDropsModal.vue';

// 使用 composable
const { count, loading, error, fetchCount } = useSalesDrops();

// 測試相關
const testKeywords = ref('');
const testing = ref(false);
const apiResult = ref<any>(null);

// Modal 狀態
const showModal = ref(false);

// 打開 Modal
const openModal = () => {
  showModal.value = true;
};

// 重新載入數量
const refreshCount = () => {
  fetchCount();
};

// 測試 API
const testAPI = async () => {
  testing.value = true;
  
  try {
    const params = new URLSearchParams({
      limit: '10',
      offset: '0'
    });
    
    if (testKeywords.value) {
      params.append('keywords', testKeywords.value);
    }
    
    const response = await $fetch(`/api/analysis/sales-drops?${params}`) as any;
    apiResult.value = response;
  } catch (err: any) {
    console.error('API test error:', err);
    apiResult.value = { error: err.message };
  } finally {
    testing.value = false;
  }
};
</script>
