<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">商品詳細資訊 Modal 測試</h1>
    
    <!-- 測試商品列表 -->
    <div class="card mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">測試商品</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="product in testProducts" 
          :key="product.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          @click="openProductDetail(product)"
        >
          <h3 class="font-medium text-gray-900 mb-2">{{ product.name }}</h3>
          <div class="space-y-1 text-sm text-gray-600">
            <p>ID: {{ product.id }}</p>
            <p>關鍵字: {{ product.keyword }}</p>
            <p v-if="product.price">價格: {{ formatPrice(product.price) }}</p>
            <p>狀態: {{ product.is_complete ? '已完成' : '未完成' }}</p>
          </div>
          <button class="mt-3 btn-primary text-sm w-full">
            查看詳細資訊
          </button>
        </div>
      </div>
    </div>

    <!-- API 測試 -->
    <div class="card mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">API 測試</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">商品 ID</label>
          <input 
            v-model="testProductId" 
            type="number" 
            placeholder="輸入商品 ID"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex items-end space-x-2">
          <button 
            @click="testSalesAPI" 
            class="btn-primary"
            :disabled="testingSales"
          >
            {{ testingSales ? '測試中...' : '測試銷售 API' }}
          </button>
          <button 
            @click="testTfidfAPI" 
            class="btn-secondary"
            :disabled="testingTfidf"
          >
            {{ testingTfidf ? '測試中...' : '測試 TF-IDF API' }}
          </button>
        </div>
      </div>
      
      <!-- 測試結果 -->
      <div v-if="apiResult" class="mt-4">
        <h3 class="text-sm font-medium text-gray-700 mb-2">API 回應：</h3>
        <details class="bg-gray-50 p-4 rounded-md">
          <summary class="cursor-pointer text-blue-600 hover:text-blue-800">查看完整回應</summary>
          <pre class="text-xs mt-2 overflow-auto bg-white p-2 rounded border">{{ JSON.stringify(apiResult, null, 2) }}</pre>
        </details>
      </div>
    </div>

    <!-- 手動觸發 -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">手動操作</h2>
      <div class="space-y-3">
        <button @click="openProductDetail(testProducts[0])" class="btn-primary w-full">
          打開第一個商品詳細資訊
        </button>
        <button @click="openProductDetail(testProducts[1])" class="btn-secondary w-full">
          打開第二個商品詳細資訊
        </button>
      </div>
    </div>

    <!-- Modal -->
    <ProductDetailModal 
      v-model="showModal" 
      :product="selectedProduct" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Product } from '~/types';
import { formatPrice } from '~/utils/global';
import ProductDetailModal from '~/components/ProductDetailModal.vue';

// 測試商品數據
const testProducts: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    price: 45900,
    product_link: 'https://www.momoshop.com.tw/goods/GoodsDetail.jsp?i_code=123456',
    keyword: '手機',
    is_complete: true,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:20:00Z'
  },
  {
    id: 2,
    name: 'MacBook Pro 14"',
    price: 69900,
    product_link: 'https://www.momoshop.com.tw/goods/GoodsDetail.jsp?i_code=789012',
    keyword: '筆電',
    is_complete: false,
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-18T16:45:00Z'
  },
  {
    id: 3,
    name: 'AirPods Pro',
    price: 7490,
    product_link: null,
    keyword: '耳機',
    is_complete: true,
    created_at: '2024-01-12T11:20:00Z',
    updated_at: '2024-01-19T13:30:00Z'
  }
];

// 測試相關
const testProductId = ref('1');
const testingSales = ref(false);
const testingTfidf = ref(false);
const apiResult = ref<any>(null);

// Modal 狀態
const showModal = ref(false);
const selectedProduct = ref<Product | null>(null);

// 打開商品詳細資訊
const openProductDetail = (product: Product) => {
  selectedProduct.value = product;
  showModal.value = true;
};

// 測試銷售 API
const testSalesAPI = async () => {
  if (!testProductId.value) return;
  
  testingSales.value = true;
  apiResult.value = null;
  
  try {
    const response = await $fetch(`/api/analysis/product-sales-series?product_id=${testProductId.value}`) as any;
    apiResult.value = response;
  } catch (err: any) {
    console.error('Sales API test error:', err);
    apiResult.value = { error: err.message };
  } finally {
    testingSales.value = false;
  }
};

// 測試 TF-IDF API
const testTfidfAPI = async () => {
  if (!testProductId.value) return;
  
  testingTfidf.value = true;
  apiResult.value = null;
  
  try {
    const response = await $fetch(`/api/nlp/product-tfidf-top?product_id=${testProductId.value}&limit=50`) as any;
    apiResult.value = response;
  } catch (err: any) {
    console.error('TF-IDF API test error:', err);
    apiResult.value = { error: err.message };
  } finally {
    testingTfidf.value = false;
  }
};
</script>
