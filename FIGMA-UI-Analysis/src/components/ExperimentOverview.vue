<template>
  <div class="space-y-8">
    <!-- Results Summary -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold">Performance Analysis</h2>
        <p class="text-muted-foreground">
          Showing {{ filteredExperiments.length }} experiments from batch {{ filteredExperiments[0]?.date }}
        </p>
      </div>
      <span class="inline-flex items-center rounded-md border border-border px-3 py-1 text-sm">
        {{ filteredExperiments.filter(exp => exp.status === 'completed').length }} completed • {{ filteredExperiments.filter(exp => exp.status === 'running').length }} running
      </span>
    </div>

    <div v-if="filteredExperiments.length === 0" class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex items-center justify-center h-64 px-6">
        <div class="text-center">
          <FlaskConical class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-lg font-medium">No Experiments Found</h3>
          <p class="text-muted-foreground">
            No experiments found in the selected batch
          </p>
        </div>
      </div>
    </div>

    <template v-else>
      <!-- Performance Comparison Chart -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex flex-col space-y-1.5 p-6">
          <h3 class="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
            <BarChart3 class="h-5 w-5" />
            Performance Comparison
          </h3>
        </div>
        <div class="p-6 pt-0">
          <div class="h-80 relative">
            <BarChart :data="chartData" />
          </div>
        </div>
      </div>

      <!-- Experiments Table -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex flex-col space-y-1.5 p-6">
          <h3 class="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
            <FlaskConical class="h-5 w-5" />
            Experiment Results
          </h3>
        </div>
        <div class="p-6 pt-0">
          <div class="rounded-md border overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b bg-muted/50">
                  <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">Experiment</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">Algorithm</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">AUC</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">Precision (y=1)</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">Recall (y=1)</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">F1-Score (y=1)</th>
                  <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="experiment in filteredExperiments" 
                  :key="experiment.id" 
                  class="border-b hover:bg-muted/50 transition-colors"
                >
                  <td class="p-4 align-middle">
                    <div>
                      <div class="font-mono text-sm text-muted-foreground">{{ experiment.id }}</div>
                      <div class="font-medium">{{ experiment.name }}</div>
                    </div>
                  </td>
                  <td class="p-4 align-middle">
                    <span :class="getAlgorithmBadgeClass(experiment.algorithm)">
                      {{ experiment.algorithm }}
                    </span>
                  </td>
                  <td class="p-4 align-middle">
                    <div class="flex items-center gap-2">
                      <span class="font-medium">{{ experiment.auc.toFixed(3) }}</span>
                      <div class="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          class="h-full bg-primary transition-all duration-500"
                          :style="{ width: `${experiment.auc * 100}%` }"
                        />
                      </div>
                    </div>
                  </td>
                  <td class="p-4 align-middle">
                    <div class="flex items-center gap-2">
                      <span class="font-medium">{{ experiment.precision.toFixed(3) }}</span>
                      <div class="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          class="h-full bg-primary transition-all duration-500"
                          :style="{ width: `${experiment.precision * 100}%` }"
                        />
                      </div>
                    </div>
                  </td>
                  <td class="p-4 align-middle">
                    <div class="flex items-center gap-2">
                      <span class="font-medium">{{ experiment.recall.toFixed(3) }}</span>
                      <div class="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          class="h-full bg-primary transition-all duration-500"
                          :style="{ width: `${experiment.recall * 100}%` }"
                        />
                      </div>
                    </div>
                  </td>
                  <td class="p-4 align-middle">
                    <div class="flex items-center gap-2">
                      <span class="font-medium">{{ experiment.f1.toFixed(3) }}</span>
                      <div class="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          class="h-full bg-primary transition-all duration-500"
                          :style="{ width: `${experiment.f1 * 100}%` }"
                        />
                      </div>
                    </div>
                  </td>
                  <td class="p-4 align-middle">
                    <button
                      @click="$emit('experiment-click', experiment.id)"
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 px-3 py-1"
                    >
                      <Eye class="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Performance Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
              <div class="p-2 bg-green-100 rounded-lg">
                <TrendingUp class="h-4 w-4 text-green-600" />
              </div>
              Best Performing
            </h3>
          </div>
          <div class="p-6 pt-0">
            <div v-if="filteredExperiments.length === 0" class="text-center text-muted-foreground">
              No data available
            </div>
            <div v-else class="space-y-3">
              <div class="font-mono text-sm text-muted-foreground">{{ bestPerforming.id }}</div>
              <div class="font-medium">{{ bestPerforming.name }}</div>
              <div class="text-2xl font-bold">AUC: {{ bestPerforming.auc.toFixed(3) }}</div>
              <span class="inline-flex items-center rounded-md border border-border px-2 py-1 text-xs font-medium">{{ bestPerforming.algorithm }}</span>
            </div>
          </div>
        </div>

        <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
              <div class="p-2 bg-orange-100 rounded-lg">
                <Target class="h-4 w-4 text-orange-600" />
              </div>
              Highest Precision
            </h3>
          </div>
          <div class="p-6 pt-0">
            <div v-if="filteredExperiments.length === 0" class="text-center text-muted-foreground">
              No data available
            </div>
            <div v-else class="space-y-3">
              <div class="font-mono text-sm text-muted-foreground">{{ highestPrecision.id }}</div>
              <div class="font-medium">{{ highestPrecision.name }}</div>
              <div class="text-2xl font-bold">Precision: {{ highestPrecision.precision.toFixed(3) }}</div>
              <span class="inline-flex items-center rounded-md border border-border px-2 py-1 text-xs font-medium">{{ highestPrecision.algorithm }}</span>
            </div>
          </div>
        </div>

        <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
              <div class="p-2 bg-blue-100 rounded-lg">
                <BarChart3 class="h-4 w-4 text-blue-600" />
              </div>
              Best F1-Score
            </h3>
          </div>
          <div class="p-6 pt-0">
            <div v-if="filteredExperiments.length === 0" class="text-center text-muted-foreground">
              No data available
            </div>
            <div v-else class="space-y-3">
              <div class="font-mono text-sm text-muted-foreground">{{ bestF1Score.id }}</div>
              <div class="font-medium">{{ bestF1Score.name }}</div>
              <div class="text-2xl font-bold">F1: {{ bestF1Score.f1.toFixed(3) }}</div>
              <span class="inline-flex items-center rounded-md border border-border px-2 py-1 text-xs font-medium">{{ bestF1Score.algorithm }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  FlaskConical, 
  TrendingUp, 
  Target, 
  BarChart3,
  Eye
} from 'lucide-vue-next'
import BarChart from './BarChart.vue'

interface Experiment {
  id: string
  name: string
  algorithm: string
  auc: number
  precision: number
  recall: number
  f1: number
  status: string
  batchId: string
  date: string
  description?: string
}

interface Props {
  selectedBatch: string
}

const props = defineProps<Props>()

// Define emits
const emit = defineEmits<{
  'experiment-click': [experimentId: string]
}>()

// Mock experiment data
const mockExperiments: Experiment[] = [
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
    date: '2024-01-15',
    description: 'Baseline product-level classification without additional preprocessing'
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
    date: '2024-01-15',
    description: 'XGBoost with class weight balancing for imbalanced dataset'
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
    date: '2024-01-15',
    description: 'Random oversampling to balance minority class distribution'
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
    date: '2024-01-15',
    description: 'Synthetic Minority Oversampling Technique using k-nearest neighbors'
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
    date: '2024-01-10',
    description: 'Deep neural network with dropout and batch normalization'
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
    date: '2024-01-10',
    description: 'Random Forest with feature importance analysis'
  }
]

// Computed properties
const filteredExperiments = computed(() => 
  mockExperiments.filter(exp => exp.batchId === props.selectedBatch)
)

const chartData = computed(() => 
  filteredExperiments.value.map(exp => ({
    name: exp.name.length > 15 ? exp.name.substring(0, 15) + '...' : exp.name,
    fullName: exp.name,
    AUC: exp.auc,
    'Precision (y=1)': exp.precision,
    'Recall (y=1)': exp.recall,
    'F1-Score (y=1)': exp.f1,
    id: exp.id
  }))
)

const bestPerforming = computed(() => 
  filteredExperiments.value.reduce((max, exp) => 
    exp.auc > max.auc ? exp : max
  )
)

const highestPrecision = computed(() => 
  filteredExperiments.value.reduce((max, exp) => 
    exp.precision > max.precision ? exp : max
  )
)

const bestF1Score = computed(() => 
  filteredExperiments.value.reduce((max, exp) => 
    exp.f1 > max.f1 ? exp : max
  )
)

const getAlgorithmBadgeClass = (algorithm: string) => {
  const colors = {
    'Baseline': 'bg-gray-100 text-gray-800 border-gray-200',
    'XGBoost': 'bg-purple-100 text-purple-800 border-purple-200',
    'Sampling': 'bg-orange-100 text-orange-800 border-orange-200',
    'Neural Network': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Ensemble': 'bg-teal-100 text-teal-800 border-teal-200'
  }
  const colorClass = colors[algorithm as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  return `inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${colorClass}`
}
</script>