<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">ML Experiment Batches</h1>
            <p class="text-gray-600 mt-2">Browse and compare machine learning experiment batches</p>
          </div>
          <NuxtLink to="/" class="btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Dashboard
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Loading experiment batches...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
        <h3 class="text-red-800 font-semibold mb-3">Error Loading Data</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button @click="retry" class="btn-danger">Retry</button>
      </div>

      <!-- Content -->
      <div v-else-if="batches.length > 0" class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Batches</p>
                <p class="text-3xl font-bold text-gray-900">{{ batches.length }}</p>
              </div>
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Experiments</p>
                <p class="text-3xl font-bold text-green-600">{{ totalExperiments }}</p>
              </div>
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Best Overall AUC</p>
                <p class="text-3xl font-bold text-purple-600">{{ bestOverallAUC.toFixed(3) }}</p>
              </div>
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Best Precision</p>
                <p class="text-3xl font-bold text-orange-600">{{ bestOverallPrecision.toFixed(3) }}</p>
              </div>
              <div class="p-2 bg-orange-100 rounded-lg">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Batches Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="batch in batches" 
            :key="batch.id"
            class="card hover:shadow-lg transition-shadow cursor-pointer"
            @click="navigateToBatch(batch.id)"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ batch.name }}</h3>
                <p class="text-sm text-gray-600">{{ batch.date }}</p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-blue-600">{{ batch.best_auc.toFixed(3) }}</div>
                <div class="text-xs text-gray-500">Best AUC</div>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Experiments:</span>
                <span class="font-medium">{{ batch.experiment_count }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Best Precision:</span>
                <span class="font-medium text-green-600">{{ batch.best_precision.toFixed(3) }}</span>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Click to view details
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No Experiment Batches</h3>
        <p class="text-gray-600">No experiment batches have been created yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useExperiments } from '~/composables/useExperiments';

const {
  batches,
  loading,
  error,
  fetchBatches
} = useExperiments();

const totalExperiments = computed(() => 
  batches.value.reduce((sum, batch) => sum + batch.experiment_count, 0)
);

const bestOverallAUC = computed(() => 
  batches.value.length > 0 
    ? Math.max(...batches.value.map(batch => batch.best_auc))
    : 0
);

const bestOverallPrecision = computed(() => 
  batches.value.length > 0 
    ? Math.max(...batches.value.map(batch => batch.best_precision))
    : 0
);

const retry = () => {
  fetchBatches();
};

const navigateToBatch = (batchId: string) => {
  navigateTo(`/experiments/${batchId}`);
};

onMounted(() => {
  fetchBatches();
});
</script>
