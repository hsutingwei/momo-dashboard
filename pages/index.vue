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
        <button @click="() => refresh()" class="btn-danger">
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
          </div>

          <div class="card">
            <h3 class="text-sm font-medium text-gray-500 mb-3">Total Comments</h3>
            <NuxtLink to="/comments" class="block">
              <p class="text-3xl font-bold text-gray-900">{{ formatNumber(stats.totalComments) }}</p>
            </NuxtLink>
          </div>

          <div class="card">
            <h3 class="text-sm font-medium text-gray-500 mb-3">Unique Keywords</h3>
            <p class="text-3xl font-bold text-gray-900">{{ formatNumber(stats.uniqueKeywords) }}</p>
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">點擊查看明細</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div class="cursor-pointer hover:shadow-lg transition-shadow" @click="openChartModal('keyword-runs')">
            <KeywordRunsChart />
          </div>
          <div class="cursor-pointer hover:shadow-lg transition-shadow" @click="openChartModal('sales-changes')">
            <SalesChangesChart />
          </div>
          <div class="cursor-pointer hover:shadow-lg transition-shadow" @click="openChartModal('batch-changes')">
            <BatchChangesChart />
          </div>
        </div>

        <div class="card mb-6">
          <div v-if="experimentsLoading" class="flex items-center justify-center py-8">
            <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span class="text-gray-600">Loading experiments...</span>
          </div>

          <div v-else-if="experimentsError" class="text-center py-8">
            <p class="text-red-600 mb-4">{{ experimentsError }}</p>
            <button @click="fetchBatches" class="btn-primary">Retry</button>
          </div>

          <div v-else-if="experimentsBatches.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
              </path>
            </svg>
            <p class="text-gray-500">No experiment batches available</p>
          </div>

          <div v-else class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ experimentsBatches.length }}</div>
                <div class="text-sm text-gray-600">Analysis Batches</div>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ totalExperiments }}</div>
                <div class="text-sm text-gray-600">Total Experiments</div>
              </div>
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <div class="text-2xl font-bold text-purple-600">{{ bestOverallAUC.toFixed(3) }}</div>
                <div class="text-sm text-gray-600">Best Overall AUC</div>
              </div>
            </div>

            <div class="space-y-3">
              <h4 class="font-medium text-gray-900">Recent Analysis Batches</h4>
              <div v-for="batch in experimentsBatches.slice(0, 3)" :key="batch.id"
                class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                @click="navigateToExperiment(batch.id)">
                <div class="flex items-center justify-between">
                  <div>
                    <h5 class="font-medium text-gray-900">{{ batch.name }}</h5>
                    <p class="text-sm text-gray-600">{{ batch.date }} • {{ batch.experiment_count }} experiments</p>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold text-blue-600">{{ batch.best_auc.toFixed(3) }}</div>
                    <div class="text-xs text-gray-500">Best AUC</div>
                  </div>
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                    </path>
                  </svg>
                  Click to view details
                </div>
              </div>

              <div v-if="experimentsBatches.length > 3" class="text-center pt-2">
                <NuxtLink to="/experiments" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all {{ experimentsBatches.length }} batches →
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>


        <!-- <Collapsible title="TF-IDF" :default-open="false" class="card mb-6">
          <template #icon>
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
            </svg>
          </template>
          <TfidfWordCloud />
        </Collapsible> -->
        <div class="card mb-6">
          <TfidfWordCloud />
        </div>

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

    <!-- 圖表 Modal -->
    <ChartModal v-model="showChartModal" :title="chartModalTitle">
      <div v-if="activeChart === 'keyword-runs'">
        <KeywordRunsChart />
      </div>
      <div v-else-if="activeChart === 'sales-changes'">
        <SalesChangesChart />
      </div>
      <div v-else-if="activeChart === 'batch-changes'">
        <BatchChangesChart />
      </div>
    </ChartModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDashboardStats } from '../composables/useDashboardStats';
import { useSalesDrops } from '../composables/useSalesDrops';
import { useExperiments } from '../composables/useExperiments';
import { formatNumber } from '~/utils/global';
import KeywordRunsChart from '~/components/charts/KeywordRunsChart.vue';
import SalesChangesChart from '~/components/charts/SalesChangesChart.vue';
import BatchChangesChart from '~/components/charts/BatchChangesChart.vue';
import SalesDropsModal from '~/components/SalesDropsModal.vue';
import Collapsible from '~/components/ui/Collapsible.vue';
import TfidfWordCloud from '~/components/TfidfWordCloud.vue';
import ChartModal from '~/components/ChartModal.vue';

const { stats, error, refresh, pending } = useDashboardStats();
const { count: salesDropsCount, loading: salesDropsLoading, error: salesDropsError, fetchCount } = useSalesDrops();

// Experiments
const { batches: experimentsBatches, loading: experimentsLoading, error: experimentsError, fetchBatches } = useExperiments();

// Modal 狀態
const showSalesDropsModal = ref(false);
const showChartModal = ref(false);
const activeChart = ref<string>('');

// 計算屬性
const chartModalTitle = computed(() => {
  switch (activeChart.value) {
    case 'keyword-runs':
      return '關鍵字批次分析';
    case 'sales-changes':
      return '銷售變化分析';
    case 'batch-changes':
      return '批次變化分析';
    default:
      return '圖表詳情';
  }
});

const totalExperiments = computed(() =>
  experimentsBatches.value.reduce((sum, batch) => sum + batch.experiment_count, 0)
);

const bestOverallAUC = computed(() =>
  experimentsBatches.value.length > 0
    ? Math.max(...experimentsBatches.value.map(batch => batch.best_auc))
    : 0
);

// 打開銷售下降商品 Modal
const openSalesDropsModal = () => {
  showSalesDropsModal.value = true;
};

// 打開圖表 Modal
const openChartModal = (chartType: string) => {
  activeChart.value = chartType;
  showChartModal.value = true;
};

// 導航到實驗頁面
const navigateToExperiment = (batchId: string) => {
  navigateTo(`/experiments/${batchId}`);
};

// 組件掛載時獲取銷售下降商品數量
onMounted(() => {
  fetchCount();
  fetchBatches();
});
</script>