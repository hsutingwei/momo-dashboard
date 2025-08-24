<template>
  <div class="min-h-screen bg-gray-50/50">
    <!-- Header -->
    <div class="bg-white border-b shadow-sm">
      <div class="container mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h1 class="text-3xl tracking-tight">ML Experiment Dashboard</h1>
            <p class="text-muted-foreground text-lg">
              Compare machine learning experiments and analyze model performance
            </p>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-muted-foreground">Analysis Batch:</label>
            <div class="relative">
              <button
                @click="selectOpen = !selectOpen"
                class="flex h-9 w-56 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <span>
                  {{ selectedBatchInfo ? `${selectedBatchInfo.name} (${selectedBatchInfo.date})` : 'Select Analysis Batch' }}
                </span>
                <ChevronDown class="h-4 w-4 opacity-50" />
              </button>
              <div v-if="selectOpen" class="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
                <div class="p-1">
                  <button
                    v-for="batch in mockBatches"
                    :key="batch.id"
                    @click="() => { selectedBatch = batch.id; selectOpen = false; }"
                    class="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  >
                    {{ batch.name }} ({{ batch.date }})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-6 py-4">
        <div class="grid w-full grid-cols-2 max-w-lg h-11 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
          <button
            @click="activeTab = 'overview'"
            :class="[
              'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              activeTab === 'overview'
                ? 'bg-background text-foreground shadow'
                : 'hover:bg-muted-foreground/10'
            ]"
          >
            <FlaskConical class="h-4 w-4 mr-2" />
            Experiment Overview
          </button>
          <button
            @click="activeTab = 'batches'"
            :class="[
              'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              activeTab === 'batches'
                ? 'bg-background text-foreground shadow'
                : 'hover:bg-muted-foreground/10'
            ]"
          >
            <Calendar class="h-4 w-4 mr-2" />
            Batch Management
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 py-8">
      <!-- Current Batch Info Banner -->
      <div v-if="selectedBatchInfo" class="mb-8 rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/60 text-card-foreground shadow-sm">
        <div class="py-6 px-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-blue-100 rounded-lg">
                <Calendar class="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-blue-900">
                  {{ selectedBatchInfo.name }}
                </h3>
                <p class="text-blue-700">
                  Analysis batch from {{ selectedBatchInfo.date }} • {{ filteredExperiments.length }} experiments • {{ filteredExperiments.filter(exp => exp.status === 'completed').length }} completed
                </p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-blue-600">Best AUC Score</div>
              <div class="text-3xl font-bold text-blue-900">{{ mockKPIs.bestAUC.toFixed(3) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div 
          class="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 rounded-lg border bg-card text-card-foreground shadow-sm"
          @click="activeTab = 'overview'"
        >
          <div class="flex flex-row items-center justify-between space-y-0 pb-3 p-6">
            <h3 class="text-sm font-medium">Total Experiments</h3>
            <div class="p-2 bg-blue-100 rounded-lg">
              <FlaskConical class="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div class="px-6 pb-6">
            <div class="text-3xl font-bold">{{ mockKPIs.totalExperiments }}</div>
            <p class="text-xs text-muted-foreground mt-1">
              From {{ selectedBatchInfo?.name || 'selected batch' }}
            </p>
          </div>
        </div>

        <div class="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-row items-center justify-between space-y-0 pb-3 p-6">
            <h3 class="text-sm font-medium">Best AUC Score</h3>
            <div class="p-2 bg-green-100 rounded-lg">
              <TrendingUp class="h-4 w-4 text-green-600" />
            </div>
          </div>
          <div class="px-6 pb-6">
            <div class="text-3xl font-bold">{{ mockKPIs.bestAUC.toFixed(3) }}</div>
            <p class="text-xs text-muted-foreground mt-1">
              {{ bestExpName }}
            </p>
          </div>
        </div>

        <div class="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-row items-center justify-between space-y-0 pb-3 p-6">
            <h3 class="text-sm font-medium">Best Precision (y=1)</h3>
            <div class="p-2 bg-orange-100 rounded-lg">
              <Target class="h-4 w-4 text-orange-600" />
            </div>
          </div>
          <div class="px-6 pb-6">
            <div class="text-3xl font-bold">{{ mockKPIs.bestPrecision.toFixed(3) }}</div>
            <p class="text-xs text-muted-foreground mt-1">
              From {{ filteredExperiments.length }} experiments
            </p>
          </div>
        </div>

        <div 
          class="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 rounded-lg border bg-card text-card-foreground shadow-sm"
          @click="activeTab = 'batches'"
        >
          <div class="flex flex-row items-center justify-between space-y-0 pb-3 p-6">
            <h3 class="text-sm font-medium">Active Batches</h3>
            <div class="p-2 bg-purple-100 rounded-lg">
              <BarChart3 class="h-4 w-4 text-purple-600" />
            </div>
          </div>
          <div class="px-6 pb-6">
            <div class="text-3xl font-bold">{{ mockKPIs.activeBatches }}</div>
            <p class="text-xs text-muted-foreground mt-1">
              Analysis runs available
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="space-y-8">
        <div v-if="activeTab === 'overview'" class="space-y-8">
          <ExperimentOverview 
            :selectedBatch="selectedBatch"
            @experiment-click="handleExperimentClick"
          />
        </div>

        <div v-if="activeTab === 'batches'" class="space-y-8">
          <BatchManagement @experiment-click="handleExperimentClick" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ExperimentOverview from './components/ExperimentOverview.vue'
import BatchManagement from './components/BatchManagement.vue'
import { 
  FlaskConical, 
  TrendingUp, 
  Target, 
  BarChart3,
  Calendar,
  ChevronDown
} from 'lucide-vue-next'

// Mock experiment data
const mockExperiments = [
  {
    id: 'product_level',
    name: 'Product Level Baseline',
    algorithm: 'Baseline',
    auc: 0.72,
    precision: 0.18,
    recall: 0.11,
    f1: 0.13,
    status: 'completed',
    batchId: 'batch_2024_01_15',
    date: '2024-01-15'
  },
  {
    id: 'd0dca4c6',
    name: 'XGB Class Weight',
    algorithm: 'XGBoost',
    auc: 0.73,
    precision: 0.21,
    recall: 0.12,
    f1: 0.15,
    status: 'completed',
    batchId: 'batch_2024_01_15',
    date: '2024-01-15'
  },
  {
    id: 'dc7dd570',
    name: 'Random Oversample',
    algorithm: 'Sampling',
    auc: 0.71,
    precision: 0.20,
    recall: 0.13,
    f1: 0.16,
    status: 'completed',
    batchId: 'batch_2024_01_15',
    date: '2024-01-15'
  },
  {
    id: '8b0f585b',
    name: 'SMOTE',
    algorithm: 'Sampling',
    auc: 0.74,
    precision: 0.22,
    recall: 0.14,
    f1: 0.17,
    status: 'completed',
    batchId: 'batch_2024_01_15',
    date: '2024-01-15'
  },
  {
    id: 'exp_2024_01_10_1',
    name: 'Deep Learning',
    algorithm: 'Neural Network',
    auc: 0.69,
    precision: 0.19,
    recall: 0.10,
    f1: 0.13,
    status: 'running',
    batchId: 'batch_2024_01_10',
    date: '2024-01-10'
  },
  {
    id: 'exp_2024_01_10_2',
    name: 'Random Forest',
    algorithm: 'Ensemble',
    auc: 0.70,
    precision: 0.17,
    recall: 0.09,
    f1: 0.12,
    status: 'completed',
    batchId: 'batch_2024_01_10',
    date: '2024-01-10'
  }
]

// Mock data for analysis batches
const mockBatches = [
  { id: 'batch_2024_01_15', date: '2024-01-15', name: 'Baseline Comparison', experimentCount: 4 },
  { id: 'batch_2024_01_10', date: '2024-01-10', name: 'Sampling Methods', experimentCount: 6 },
  { id: 'batch_2024_01_05', date: '2024-01-05', name: 'Feature Engineering', experimentCount: 8 },
]

const activeTab = ref('overview')
const selectedBatch = ref(mockBatches[0].id)
const selectOpen = ref(false)

// Computed properties
const filteredExperiments = computed(() => 
  mockExperiments.filter(exp => exp.batchId === selectedBatch.value)
)

const selectedBatchInfo = computed(() => 
  mockBatches.find(batch => batch.id === selectedBatch.value)
)

const mockKPIs = computed(() => ({
  totalExperiments: filteredExperiments.value.length,
  bestAUC: filteredExperiments.value.length > 0 ? Math.max(...filteredExperiments.value.map(exp => exp.auc)) : 0,
  bestPrecision: filteredExperiments.value.length > 0 ? Math.max(...filteredExperiments.value.map(exp => exp.precision)) : 0,
  activeBatches: mockBatches.length
}))

const bestExpName = computed(() => {
  const bestExp = filteredExperiments.value.find(exp => exp.auc === mockKPIs.value.bestAUC)
  return bestExp ? bestExp.name : 'No experiments'
})

const handleExperimentClick = (experimentId: string) => {
  console.log('Experiment clicked:', experimentId)
}
</script>