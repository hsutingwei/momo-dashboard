<template>
  <div style="min-height: 100vh; background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h1 style="color: #333; font-size: 2rem; margin-bottom: 20px;">Comment List</h1>
      
      <!-- Loading State -->
      <div v-if="pending" style="text-align: center; padding: 40px;">
        <p style="color: #666;">Loading comments...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" style="background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #c33; margin: 0 0 10px 0;">Error Loading Comments</h3>
        <p style="color: #666; margin: 0;">{{ error }}</p>
        <button 
          @click="() => fetchComments()" 
          style="margin-top: 10px; padding: 8px 16px; background: #c33; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Retry
        </button>
      </div>

      <!-- Comments Content -->
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
              <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Comment Text</label>
              <input 
                v-model="searchFilters.commentText" 
                type="text" 
                placeholder="Enter comment text"
                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
              />
            </div>
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9rem;">Capture Time</label>
              <input 
                v-model="searchFilters.captureTime" 
                type="date" 
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

        <!-- Statistics Summary -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #666; font-size: 0.9rem; margin: 0 0 10px 0;">Total Comments</h3>
            <p style="font-size: 2rem; font-weight: bold; margin: 0; color: #333;">{{ formatNumber(commentStats.totalComments) }}</p>
            <p style="font-size: 0.8rem; color: #666; margin: 5px 0 0 0;">Based on current filters</p>
          </div>

          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #666; font-size: 0.9rem; margin: 0 0 10px 0;">Keyword Runs</h3>
            <div v-if="commentStats.keywordRuns && commentStats.keywordRuns.length > 0" style="height: 200px; display: flex; align-items: center; justify-content: center;">
              <p style="color: #333; font-size: 1.5rem; font-weight: bold;">{{ commentStats.keywordRuns.length }} data points</p>
            </div>
            <div v-else style="height: 200px; display: flex; align-items: center; justify-content: center;">
              <p style="color: #666;">No data available</p>
            </div>
          </div>

          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #666; font-size: 0.9rem; margin: 0 0 10px 0;">Product Runs</h3>
            <div v-if="commentStats.productRuns && commentStats.productRuns.length > 0" style="height: 200px; display: flex; align-items: center; justify-content: center;">
              <p style="color: #333; font-size: 1.5rem; font-weight: bold;">{{ commentStats.productRuns.length }} data points</p>
            </div>
            <div v-else style="height: 200px; display: flex; align-items: center; justify-content: center;">
              <p style="color: #666;">No data available</p>
            </div>
          </div>

          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #666; font-size: 0.9rem; margin: 0 0 10px 0;">Sales Changes</h3>
            <div v-if="commentStats.salesChanges && commentStats.salesChanges.length > 0" style="height: 200px; display: flex; align-items: center; justify-content: center;">
              <p style="color: #333; font-size: 1.5rem; font-weight: bold;">{{ commentStats.salesChanges.length }} data points</p>
            </div>
            <div v-else style="height: 200px; display: flex; align-items: center; justify-content: center;">
              <p style="color: #666;">No data available</p>
            </div>
          </div>
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
        />

        <!-- Summary -->
        <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
          <h3 style="margin: 0 0 10px 0; color: #1976d2;">Comments Summary</h3>
          <p style="margin: 5px 0; color: #333;">Total Comments: {{ formatNumber(total) }}</p>
          <p style="margin: 5px 0; color: #333;">Current Page: {{ currentPage }} of {{ totalPages }}</p>
          <p style="margin: 5px 0; color: #333;">Items per page: {{ limit }}</p>
          <p style="margin: 5px 0; color: #666;">Showing {{ comments.length }} comments on this page</p>
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