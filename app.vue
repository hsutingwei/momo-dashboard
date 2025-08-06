<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <DashboardHeader 
      @toggle-filters="showFilters = !showFilters"
      @export="handleExport"
    />

    <div class="container mx-auto px-6 py-6">
      <!-- Filter Panel -->
      <div v-if="showFilters" class="mb-6">
        <FilterPanel 
          v-model:search-query="dashboardStore.filters.searchQuery"
          v-model:selected-product="dashboardStore.filters.selectedProduct"
          v-model:date-range="dashboardStore.filters.dateRange"
          :products="products"
          @reset="dashboardStore.resetFilters"
        />
        <div class="border-t my-6"></div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Products"
          :value="dashboardStore.stats.totalProducts"
          subtitle="+12% from last month"
          :icon="Package"
          @click="activeTab = 'products'"
        />
        <KPICard
          title="Total Comments"
          :value="dashboardStore.stats.totalComments"
          subtitle="+23% from last month"
          :icon="MessageSquare"
          @click="activeTab = 'comments'"
        />
        <KPICard
          title="Unique Keywords"
          :value="dashboardStore.stats.uniqueKeywords"
          subtitle="+5% from last month"
          :icon="Tag"
        />
        <KPICard
          title="Sales Changes"
          :value="dashboardStore.stats.productsWithSalesChanges"
          subtitle="Products with changes"
          :icon="TrendingUp"
          @click="activeTab = 'sales'"
        />
      </div>

      <!-- Main Content -->
      <div class="space-y-6">
        <!-- Tab Navigation -->
        <div class="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
              activeTab === tab.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="space-y-6">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <AnalysisPanel />
          </div>

          <!-- Products Tab -->
          <div v-if="activeTab === 'products'">
            <ProductTable 
              :search-query="dashboardStore.filters.searchQuery"
              :selected-product="dashboardStore.filters.selectedProduct"
            />
          </div>

          <!-- Comments Tab -->
          <div v-if="activeTab === 'comments'">
            <CommentTable 
              :search-query="dashboardStore.filters.searchQuery"
              :selected-product="dashboardStore.filters.selectedProduct"
            />
          </div>

          <!-- Sales Tab -->
          <div v-if="activeTab === 'sales'">
            <SalesTable 
              :search-query="dashboardStore.filters.searchQuery"
              :selected-product="dashboardStore.filters.selectedProduct"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Package, MessageSquare, Tag, TrendingUp } from 'lucide-vue-next';
import { useDashboardStore } from '~/stores/dashboard';

// Store
const dashboardStore = useDashboardStore();

// Local state
const activeTab = ref('overview');
const showFilters = ref(false);
const products = ref([]);

// Tab configuration
const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'products', label: 'Products' },
  { value: 'comments', label: 'Comments' },
  { value: 'sales', label: 'Sales Snapshots' }
];

// Methods
const handleExport = () => {
  // TODO: Implement export functionality
  console.log('Export clicked');
};

// Load initial data
onMounted(async () => {
  await dashboardStore.fetchStats();
  
  // Load products for filter dropdown
  try {
    const { data } = await $fetch('/api/products/index');
    products.value = data.products || [];
  } catch (error) {
    console.error('Failed to load products:', error);
  }
});
</script> 