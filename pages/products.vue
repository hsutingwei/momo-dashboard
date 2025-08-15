<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Product List</h1>
      
      <!-- Loading State -->
      <div v-if="pending" class="text-center py-16">
        <p class="text-gray-600">Loading products...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
        <h3 class="text-red-800 font-semibold mb-3">Error Loading Products</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="() => fetchProducts()" 
          class="btn-danger"
        >
          Retry
        </button>
      </div>

      <!-- Products Content -->
      <div v-else>
        <!-- Search Filters -->
        <div class="card mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Search Filters</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Product ID</label>
              <input 
                v-model="searchFilters.productId" 
                type="text" 
                placeholder="Enter product ID"
                class="input-field"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input 
                v-model="searchFilters.name" 
                type="text" 
                placeholder="Enter product name"
                class="input-field"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
              <input 
                v-model="searchFilters.keyword" 
                type="text" 
                placeholder="Enter keyword"
                class="input-field"
              />
            </div>
          </div>
          <div class="flex flex-wrap gap-3 mt-4">
            <button 
              @click="handleSearch" 
              class="btn-primary"
            >
              Search
            </button>
            <button 
              @click="handleClearFilters" 
              class="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Products Table -->
        <ProductTable 
          :items="products" 
          :total="total"
          :current-page="currentPage"
          :total-pages="totalPages"
          :pending="pending"
          :current-sort-by="filters.sortBy"
          :current-sort-order="filters.sortOrder"
          @sort="handleSort"
          @page-change="handlePageChange"
          @open-detail="openProductDetail"
        />

        <!-- Summary -->
        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mt-6">
          <h3 class="text-blue-800 font-semibold mb-3">Products Summary</h3>
          <div class="space-y-2">
            <p class="text-gray-800">Total Products: {{ total }}</p>
            <p class="text-gray-800">Current Page: {{ currentPage }} of {{ totalPages }}</p>
            <p class="text-gray-800">Items per page: {{ limit }}</p>
            <p class="text-gray-600 text-sm">Showing {{ products.length }} products on this page</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <ProductDetailModal 
      v-model="showProductModal" 
      :product="selectedProduct" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProducts } from '../composables/useProducts';
import type { Product } from '~/types';
import ProductDetailModal from '~/components/ProductDetailModal.vue';

const route = useRoute();
const { 
  products, 
  total, 
  currentPage, 
  totalPages, 
  limit,
  error, 
  pending, 
  filters,
  fetchProducts, 
  sortBy, 
  goToPage, 
  search, 
  clearFilters 
} = useProducts();

// 搜尋篩選條件
const searchFilters = ref({
  productId: '',
  name: '',
  keyword: ''
});

// 處理搜尋
const handleSearch = () => {
  const filters: any = {};
  if (searchFilters.value.productId) filters.productId = searchFilters.value.productId;
  if (searchFilters.value.name) filters.name = searchFilters.value.name;
  if (searchFilters.value.keyword) filters.keyword = searchFilters.value.keyword;
  
  search(filters);
};

// 處理清除篩選
const handleClearFilters = () => {
  searchFilters.value = { productId: '', name: '', keyword: '' };
  clearFilters();
};

// 處理排序
const handleSort = (field: string) => {
  sortBy(field);
};

// 處理分頁
const handlePageChange = (page: number) => {
  goToPage(page);
};

// Modal states
const showProductModal = ref(false);
const selectedProduct = ref<Product | null>(null);

// 開啟商品詳細資訊
const openProductDetail = (item: Product) => {
  selectedProduct.value = item;
  showProductModal.value = true;
};

// 從 URL 參數初始化
const initializeFromRoute = () => {
  const query = route.query;
  const initialFilters: any = {};
  
  if (query.product_id) {
    searchFilters.value.productId = query.product_id as string;
    initialFilters.productId = query.product_id as string;
  }
  if (query.name) {
    searchFilters.value.name = query.name as string;
    initialFilters.name = query.name as string;
  }
  if (query.keyword) {
    searchFilters.value.keyword = query.keyword as string;
    initialFilters.keyword = query.keyword as string;
  }
  if (query.sortBy) {
    initialFilters.sortBy = query.sortBy as string;
  }
  if (query.sortOrder) {
    initialFilters.sortOrder = query.sortOrder as 'asc' | 'desc';
  }
  if (query.page) {
    initialFilters.page = parseInt(query.page as string);
  }
  if (query.limit) {
    initialFilters.limit = parseInt(query.limit as string);
  }
  
  // 如果有篩選條件，立即搜尋
  if (Object.keys(initialFilters).length > 0) {
    fetchProducts(initialFilters);
  } else {
    fetchProducts();
  }
};

// 監聽路由變化
watch(() => route.query, () => {
  initializeFromRoute();
}, { deep: true });

// 組件掛載時初始化
onMounted(() => {
  initializeFromRoute();
});
</script> 