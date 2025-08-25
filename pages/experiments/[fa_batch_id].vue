<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">ML Experiment Dashboard</h1>
            <p class="text-gray-600 mt-2">Compare machine learning experiments and analyze model performance</p>
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
        <p class="text-gray-600">Loading experiment data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
        <h3 class="text-red-800 font-semibold mb-3">Error Loading Data</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button @click="retry" class="btn-danger">Retry</button>
      </div>

      <!-- Content -->
      <div v-else-if="hasData" class="space-y-8">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Experiments</p>
                <p class="text-3xl font-bold text-gray-900">{{ experimentData?.codes.length || 0 }}</p>
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
                <p class="text-sm font-medium text-gray-600">Best AUC</p>
                <p class="text-3xl font-bold text-blue-600">{{ bestAUC != null ? Number(bestAUC).toFixed(3) : "-" }}</p>
              </div>
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Best Precision (y=1)</p>
                <p class="text-3xl font-bold text-green-600">{{ bestPrecision != null ? Number(bestPrecision).toFixed(3) : "-" }}</p>
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
                <p class="text-sm font-medium text-gray-600">Best F1 (y=1)</p>
                <p class="text-3xl font-bold text-purple-600">{{ bestF1 != null ? Number(bestF1).toFixed(3) : "-" }}</p>
              </div>
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExperimentComparisonChart
            title="Performance Comparison"
            :data="experimentData?.codes"
            :loading="loading"
            :error="error"
            @retry="retry"
          />
          
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Metrics Overview</h3>
            <div class="space-y-4">
              <div v-for="experiment in experimentData?.codes" :key="experiment.code" class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" @click="openExperimentDetail(experiment)">
                <div class="flex items-center justify-between mb-2">
                  <FloatingTooltip :content="experiment.mode_desc_short" placement="top">
                    <h4 class="font-medium text-gray-900 cursor-help">{{ experiment.code }}</h4>
                  </FloatingTooltip>
                  <span class="text-sm text-gray-500">{{ experiment.algorithm }}</span>
                </div>
                <div class="grid grid-cols-4 gap-2 text-sm">
                  <div class="text-center">
                    <div class="font-medium text-blue-600">{{ experiment.metrics.auc != null ? Number(experiment.metrics.auc).toFixed(3) : "-" }}</div>
                    <div class="text-gray-500">AUC</div>
                  </div>
                  <div class="text-center">
                    <div class="font-medium text-green-600">{{ experiment.metrics.precision_1 != null ? Number(experiment.metrics.precision_1).toFixed(3) : "-" }}</div>
                    <div class="text-gray-500">Precision(y=1)</div>
                  </div>
                  <div class="text-center">
                    <div class="font-medium text-orange-600">{{ experiment.metrics.recall_1 != null ? Number(experiment.metrics.recall_1).toFixed(3) : "-" }}</div>
                    <div class="text-gray-500">Recall(y=1)</div>
                  </div>
                  <div class="text-center">
                    <div class="font-medium text-purple-600">{{ experiment.metrics.f1_1 != null ? Number(experiment.metrics.f1_1).toFixed(3) : "-" }}</div>
                    <div class="text-gray-500">F1(y=1)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Experiments Table -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Experiments Details</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4 font-medium text-gray-900">Code</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900">Algorithm</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900">FS Method</th>
                  <th class="text-center py-3 px-4 font-medium text-gray-900">CV Splits</th>
                  <th class="text-center py-3 px-4 font-medium text-gray-900">AUC</th>
                  <th class="text-center py-3 px-4 font-medium text-gray-900">Precision (y=1)</th>
                  <th class="text-center py-3 px-4 font-medium text-gray-900">Recall (y=1)</th>
                  <th class="text-center py-3 px-4 font-medium text-gray-900">F1 (y=1)</th>
                  <th class="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="experiment in experimentData?.codes" :key="experiment.code" class="border-b hover:bg-gray-50">
                  <td class="py-3 px-4 font-medium text-gray-900">
                    <FloatingTooltip :content="experiment.mode_desc_short" placement="top">
                      <span class="cursor-help">{{ experiment.code }}</span>
                    </FloatingTooltip>
                  </td>
                  <td class="py-3 px-4 text-gray-700">{{ experiment.algorithm }}</td>
                  <td class="py-3 px-4 text-gray-700">{{ experiment.fs_method }}</td>
                  <td class="py-3 px-4 text-center text-gray-700">{{ experiment.cv_splits }}</td>
                  <td class="py-3 px-4 text-center">
                    <span class="font-medium text-blue-600">{{ experiment.metrics.auc != null ? Number(experiment.metrics.auc).toFixed(3) : "-" }}</span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    <span class="font-medium text-green-600">{{ experiment.metrics.precision_1 != null ? Number(experiment.metrics.precision_1).toFixed(3) : "-" }}</span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    <span class="font-medium text-orange-600">{{ experiment.metrics.recall_1 != null ? Number(experiment.metrics.recall_1).toFixed(3) : "-" }}</span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    <span class="font-medium text-purple-600">{{ experiment.metrics.f1_1 != null ? Number(experiment.metrics.f1_1).toFixed(3) : "-" }}</span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    <button
                      @click="openExperimentDetail(experiment)"
                      class="btn-primary btn-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No Experiments Found</h3>
        <p class="text-gray-600">This analysis batch doesn't have any experiments yet.</p>
      </div>
    </div>

    <!-- Experiment Detail Modal -->
    <ExperimentDetailModal
      v-model="showDetailModal"
      :run-id="selectedRunId"
      :fa-batch-id="faBatchId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useExperiments } from '~/composables/useExperiments';
import type { ExperimentRun } from '~/types';
import ExperimentDetailModal from '~/components/ExperimentDetailModal.vue';
import ExperimentComparisonChart from '~/components/charts/ExperimentComparisonChart.vue';
import FloatingTooltip from '~/components/ui/FloatingTooltip.vue';

const route = useRoute();
const faBatchId = route.params.fa_batch_id as string;

const {
  experimentData,
  loading,
  error,
  hasData,
  bestAUC,
  bestPrecision,
  bestF1,
  fetchExperimentData
} = useExperiments();

const showDetailModal = ref(false);
const selectedRunId = ref<string>('');

const retry = () => {
  fetchExperimentData(faBatchId);
};

const openExperimentDetail = (experiment: ExperimentRun) => {
  selectedRunId.value = experiment.run_id;
  showDetailModal.value = true;
};

onMounted(() => {
  if (faBatchId) {
    fetchExperimentData(faBatchId);
  }
});
</script>
