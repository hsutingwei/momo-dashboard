<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Momo Dashboard</h1>
      
      <!-- Loading State -->
      <div v-if="pending" class="text-center py-16">
        <p class="text-gray-600">Loading dashboard data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
        <h3 class="text-red-800 font-semibold mb-3">Error Loading Data</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="() => refresh()" 
          class="btn-danger"
        >
          Retry
        </button>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div class="card">
            <h3 class="text-sm font-medium text-gray-500 mb-3">Total Products</h3>
            <NuxtLink to="/products" class="block">
              <p class="text-3xl font-bold text-gray-900">{{ formatNumber(stats.totalProducts) }}</p>
            </NuxtLink>
            <p class="text-xs text-gray-500 mt-2">+12% from last month</p>
          </div>
  
          <div class="card">
            <h3 class="text-sm font-medium text-gray-500 mb-3">Total Comments</h3>
            <NuxtLink to="/comments" class="block">
              <p class="text-3xl font-bold text-gray-900">{{ formatNumber(stats.totalComments) }}</p>
            </NuxtLink>
            <p class="text-xs text-gray-500 mt-2">+23% from last month</p>
          </div>
  
          <div class="card">
            <h3 class="text-sm font-medium text-gray-500 mb-3">Unique Keywords</h3>
            <p class="text-3xl font-bold text-gray-900">{{ formatNumber(stats.uniqueKeywords) }}</p>
            <p class="text-xs text-gray-500 mt-2">+5% from last month</p>
          </div>
  
          <div class="card">
            <h3 class="text-sm font-medium text-gray-500 mb-3">Sales Changes</h3>
            <p class="text-3xl font-bold text-gray-900">{{ formatNumber(stats.productsWithSalesChanges) }}</p>
            <p class="text-xs text-gray-500 mt-2">Products with changes</p>
          </div>

          <!-- 銷售下降商品數 -->
          <div class="card cursor-pointer hover:shadow-lg transition-shadow" @click="openSalesDropsModal">
            <h3 class="text-sm font-medium text-gray-500 mb-3">銷售下降商品數</h3>
            <div class="flex items-center justify-between">
              <div v-if="salesDropsLoading" class="flex items-center">
                <div class="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span class="text-gray-400">載入中...</span>
              </div>
              <div v-else-if="salesDropsError" class="text-red-600 text-sm">
                {{ salesDropsError }}
              </div>
              <div v-else class="flex items-center">
                <p class="text-3xl font-bold text-red-600">{{ formatNumber(salesDropsCount) }}</p>
                <svg class="w-5 h-5 text-red-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">點擊查看明細</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KeywordRunsChart/>
          <SalesChangesChart />
          <BatchChangesChart />
        </div>

        <Collapsible title="TF-IDF" :default-open="false" class="card mb-6">
          <template #icon>
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
            </svg>
          </template>
          <TfidfWordCloud />
        </Collapsible>
  
        <!-- Status Card -->
        <div class="card mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Dashboard Status</h2>
          <div class="space-y-3">
            <p class="flex items-center">
              <span class="font-medium mr-2">Server Status:</span>
              <span class="text-green-600 font-medium">Running</span>
            </p>
            <p class="flex items-center">
              <span class="font-medium mr-2">Database Connection:</span>
              <span class="text-green-600 font-medium">Connected</span>
            </p>
            <p class="flex items-center">
              <span class="font-medium mr-2">API Endpoints:</span>
              <span class="text-green-600 font-medium">Available</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 銷售下降商品 Modal -->
    <SalesDropsModal v-model="showSalesDropsModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDashboardStats } from '../composables/useDashboardStats';
import { useSalesDrops } from '../composables/useSalesDrops';
import { formatNumber } from '~/utils/global';
import KeywordRunsChart from '~/components/charts/KeywordRunsChart.vue';
import SalesChangesChart from '~/components/charts/SalesChangesChart.vue';
import BatchChangesChart from '~/components/charts/BatchChangesChart.vue';
import SalesDropsModal from '~/components/SalesDropsModal.vue';
import Collapsible from '~/components/ui/Collapsible.vue';
import TfidfWordCloud from '~/components/TfidfWordCloud.vue';

const { stats, error, refresh, pending } = useDashboardStats();
const { count: salesDropsCount, loading: salesDropsLoading, error: salesDropsError, fetchCount } = useSalesDrops();

// Modal 狀態
const showSalesDropsModal = ref(false);

// 打開銷售下降商品 Modal
const openSalesDropsModal = () => {
  showSalesDropsModal.value = true;
};

// 組件掛載時獲取銷售下降商品數量
onMounted(() => {
  fetchCount();
});
</script> 