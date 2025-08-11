<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Comment List</h1>
      
      <!-- Loading State -->
      <div v-if="pending" class="text-center py-16">
        <p class="text-gray-600">Loading comments...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
        <h3 class="text-red-800 font-semibold mb-3">Error Loading Comments</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="() => fetchComments()" 
          class="btn-danger"
        >
          Retry
        </button>
      </div>

      <!-- Comments Content -->
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
              <label class="block text-sm font-medium text-gray-700 mb-2">Comment Text</label>
              <input 
                v-model="searchFilters.commentText" 
                type="text" 
                placeholder="Enter comment text"
                class="input-field"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Capture Time</label>
              <input 
                v-model="searchFilters.captureTime" 
                type="date" 
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

        <!-- Charts Section -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <!-- 第一張圖：總評論數 -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">總評論數統計</h3>
            <div class="text-center py-8 w-full h-full flex flex-col items-center justify-center">
              <p class="text-4xl font-bold text-blue-600">{{ formatNumber(total) }}</p>
              <p class="text-gray-600 mt-2">總共評論數</p>
            </div>
          </div>

          <!-- 第二張圖：關鍵字比較或產品趨勢 -->
          <KeywordRunsChart 
            v-if="!searchFilters.productId"
            :keywords="''"
            :from="searchFilters.captureTime"
          />
          <ProductRunsChart 
            v-else
            :product-id="searchFilters.productId"
          />

          <!-- 第三張圖：銷售變化 -->
          <SalesChangesChart 
            :product-id="searchFilters.productId"
          />
        </div>

        <!-- Comments Table -->
        <CommentTable 
          :items="comments" 
          :total="total"
          :current-page="currentPage"
          :total-pages="totalPages"
          :pending="pending"
          :current-sort-by="filters.sortBy"
          :current-sort-order="filters.sortOrder"
          @sort="handleSort"
          @page-change="handlePageChange"
          @open-detail="openCommentDetail"
        />

        <!-- Comment Detail Modal -->
        <CommentDetailModal 
          v-if="selectedComment"
          v-model="showCommentModal"
          :comment="selectedComment"
        />

        <!-- Summary -->
        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mt-6">
          <h3 class="text-blue-800 font-semibold mb-3">Comments Summary</h3>
          <div class="space-y-2">
            <p class="text-gray-800">Total Comments: {{ formatNumber(total) }}</p>
            <p class="text-gray-800">Current Page: {{ currentPage }} of {{ totalPages }}</p>
            <p class="text-gray-800">Items per page: {{ limit }}</p>
            <p class="text-gray-600 text-sm">Showing {{ comments.length }} comments on this page</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useComments } from '../composables/useComments';
import { useCommentStats } from '../composables/useCommentStats';
import { formatNumber } from '~/utils/global';
import type { Comment } from '~/types';
import KeywordRunsChart from '~/components/charts/KeywordRunsChart.vue';
import ProductRunsChart from '~/components/charts/ProductRunsChart.vue';
import SalesChangesChart from '~/components/charts/SalesChangesChart.vue';
import CommentDetailModal from '~/components/CommentDetailModal.vue';

const route = useRoute();
const { 
  comments, 
  total, 
  currentPage, 
  totalPages, 
  limit,
  error, 
  pending, 
  filters,
  fetchComments, 
  sortBy, 
  goToPage, 
  search, 
  clearFilters 
} = useComments();

const { stats: commentStats, fetchStats } = useCommentStats();

// 搜尋篩選條件
const searchFilters = ref({
  productId: '',
  commentText: '',
  captureTime: ''
});

// 處理搜尋
const handleSearch = () => {
  const filters: any = {};
  if (searchFilters.value.productId) filters.productId = searchFilters.value.productId;
  if (searchFilters.value.commentText) filters.commentText = searchFilters.value.commentText;
  if (searchFilters.value.captureTime) filters.captureTime = searchFilters.value.captureTime;
  
  search(filters);
  fetchStats(filters);
};

// 處理清除篩選
const handleClearFilters = () => {
  searchFilters.value = { productId: '', commentText: '', captureTime: '' };
  clearFilters();
  fetchStats();
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
const showCommentModal = ref(false);
const selectedComment = ref<Comment | null>(null);

// 開啟評論詳細資訊
const openCommentDetail = (comment: Comment) => {
  selectedComment.value = comment;
  showCommentModal.value = true;
};

// 從 URL 參數初始化
const initializeFromRoute = () => {
  const query = route.query;
  const initialFilters: any = {};
  
  if (query.product_id) {
    searchFilters.value.productId = query.product_id as string;
    initialFilters.productId = query.product_id as string;
  }
  if (query.comment_text) {
    searchFilters.value.commentText = query.comment_text as string;
    initialFilters.commentText = query.comment_text as string;
  }
  if (query.capture_time) {
    searchFilters.value.captureTime = query.capture_time as string;
    initialFilters.captureTime = query.capture_time as string;
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
    fetchComments(initialFilters);
    fetchStats(initialFilters);
  } else {
    fetchComments();
    fetchStats();
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