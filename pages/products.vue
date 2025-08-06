<template>
  <div style="min-height: 100vh; background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h1 style="color: #333; font-size: 2rem; margin-bottom: 20px;">Product List</h1>
      
      <!-- Loading State -->
      <div v-if="pending" style="text-align: center; padding: 40px;">
        <p style="color: #666;">Loading products...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" style="background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #c33; margin: 0 0 10px 0;">Error Loading Products</h3>
        <p style="color: #666; margin: 0;">{{ error }}</p>
        <button 
          @click="() => fetchProducts()" 
          style="margin-top: 10px; padding: 8px 16px; background: #c33; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Retry
        </button>
      </div>

      <!-- Products Content -->
      <div v-else>
        <!-- Search Filters -->
        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <h3 style="color: #333; font-size: 1.2rem; margin: 0 0 15px 0;">Search Filters</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Product ID</label>
              <input 
                v-model="searchFilters.productId" 
                type="text" 
                placeholder="Enter product ID"
                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
              />
            </div>
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Product Name</label>
              <input 
                v-model="searchFilters.name" 
                type="text" 
                placeholder="Enter product name"
                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
              />
            </div>
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Keyword</label>
              <input 
                v-model="searchFilters.keyword" 
                type="text" 
                placeholder="Enter keyword"
                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
              />
            </div>
          </div>
          <div style="margin-top: 15px; display: flex; gap: 10px;">
            <button 
              @click="handleSearch" 
              style="padding: 8px 16px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              Search
            </button>
            <button 
              @click="handleClearFilters" 
              style="padding: 8px 16px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;"
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
        />

        <!-- Summary -->
        <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
          <h3 style="margin: 0 0 10px 0; color: #1976d2;">Products Summary</h3>
          <p style="margin: 5px 0; color: #333;">Total Products: {{ total }}</p>
          <p style="margin: 5px 0; color: #333;">Current Page: {{ currentPage }} of {{ totalPages }}</p>
          <p style="margin: 5px 0; color: #333;">Items per page: {{ limit }}</p>
          <p style="margin: 5px 0; color: #666;">Showing {{ products.length }} products on this page</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProducts } from '../composables/useProducts';

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