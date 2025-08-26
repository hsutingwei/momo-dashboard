<template>
  <Modal v-model="isOpen" :title="modalTitle" size="xl">
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="retry" class="btn-primary">Retry</button>
    </div>

    <div v-else-if="!runSummary" class="text-center py-8">
      <p class="text-gray-500">No data available</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px mx-4 flex space-x-8">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]">
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="min-h-96">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <Collapsible title="詳細說明" :default-open="false" class="card mb-6">
            <template #icon>
              <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">
                </path>
              </svg>
            </template>
            <span class="text-gray-600">{{ runSummary.mode_desc_long }}</span>
          </Collapsible>
          <!-- Run Summary -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="card">
              <h4 class="text-lg font-semibold mb-4">Run Configuration</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Algorithm:</span>
                  <span class="font-medium">{{ runSummary.algorithm }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">FS Method:</span>
                  <span class="font-medium">{{ runSummary.fs_method }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">CV Splits:</span>
                  <span class="font-medium">{{ runSummary.cv_splits }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Cutoff Date:</span>
                  <span class="font-medium">{{ runSummary.cutoff_date }}</span>
                </div>
              </div>
            </div>

            <div class="card">
              <h4 class="text-lg font-semibold mb-4">Overall Metrics</h4>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ Number(runSummary.metrics.auc).toFixed(3) }}</div>
                  <div class="text-sm text-gray-600">AUC</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">{{ Number(runSummary.metrics.accuracy).toFixed(3) }}
                  </div>
                  <div class="text-sm text-gray-600">Accuracy</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">{{ Number(runSummary.metrics.f1_macro).toFixed(3) }}
                  </div>
                  <div class="text-sm text-gray-600">F1 Macro</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-indigo-600">{{ Number(runSummary.metrics.f1_weighted).toFixed(3)
                  }}</div>
                  <div class="text-sm text-gray-600">F1 Weighted</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Class-specific Metrics -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="card">
              <h4 class="text-lg font-semibold mb-4 text-orange-600">Class 1 (Positive) Metrics</h4>
              <div class="grid grid-cols-3 gap-4">
                <div class="text-center">
                  <div class="text-xl font-bold text-orange-600">{{ Number(runSummary.metrics.precision_1).toFixed(3) }}
                  </div>
                  <div class="text-sm text-gray-600">Precision</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-orange-600">{{ Number(runSummary.metrics.recall_1).toFixed(3) }}
                  </div>
                  <div class="text-sm text-gray-600">Recall</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-orange-600">{{ Number(runSummary.metrics.f1_1).toFixed(3) }}</div>
                  <div class="text-sm text-gray-600">F1</div>
                </div>
              </div>
            </div>

            <div class="card">
              <h4 class="text-lg font-semibold mb-4 text-gray-600">Class 0 (Negative) Metrics</h4>
              <div class="grid grid-cols-3 gap-4">
                <div class="text-center">
                  <div class="text-xl font-bold text-gray-600">{{ Number(runSummary.metrics.precision_0).toFixed(3) }}
                  </div>
                  <div class="text-sm text-gray-600">Precision</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-gray-600">{{ Number(runSummary.metrics.recall_0).toFixed(3) }}
                  </div>
                  <div class="text-sm text-gray-600">Recall</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-gray-600">{{ Number(runSummary.metrics.f1_0).toFixed(3) }}</div>
                  <div class="text-sm text-gray-600">F1</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Hyperparameters -->
          <div class="card">
            <h4 class="text-lg font-semibold mb-4">Hyperparameters</h4>
            <pre class="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">{{ JSON.stringify(runSummary.hyperparams, null, 2) }}</pre>
          </div>
        </div>

        <!-- Cross-Validation Tab -->
        <div v-if="activeTab === 'cv'" class="space-y-6">
          <div v-if="runFoldsLoading" class="flex items-center justify-center h-64">
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div v-else-if="runFoldsError" class="text-center py-8">
            <p class="text-red-600 mb-4">{{ runFoldsError }}</p>
            <button @click="fetchRunFolds" class="btn-primary">Retry</button>
          </div>

          <div v-else-if="!runFolds" class="text-center py-8">
            <p class="text-gray-500">No fold data available</p>
          </div>

          <div v-else>
            <!-- Fold Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div class="card text-center">
                <div class="text-2xl font-bold text-blue-600">{{ runFolds.stats.auc_mean != null ? Number(runFolds.stats.auc_mean).toFixed(3) : "-" }}</div>
                <div class="text-sm text-gray-600">AUC Mean</div>
                <div class="text-xs text-gray-500">±{{ runFolds.stats.auc_std != null ? Number(runFolds.stats.auc_std).toFixed(3) : "-" }}</div>
              </div>
              <div class="card text-center">
                <div class="text-2xl font-bold text-purple-600">{{ runFolds.stats.f1_1_mean != null ? Number(runFolds.stats.f1_1_mean).toFixed(3) : "-" }}</div>
                <div class="text-sm text-gray-600">F1 (y=1) Mean</div>
                <div class="text-xs text-gray-500">±{{ runFolds.stats.f1_1_std != null ? Number(runFolds.stats.f1_1_std).toFixed(3) : "-" }}</div>
              </div>
              <div class="card text-center">
                <div class="text-2xl font-bold text-orange-600">{{ runFolds.stats.recall_1_mean != null ? Number(runFolds.stats.recall_1_mean).toFixed(3) : "-" }}</div>
                <div class="text-sm text-gray-600">Recall (y=1) Mean</div>
                <div class="text-xs text-gray-500">±{{ runFolds.stats.recall_1_std != null ? Number(runFolds.stats.recall_1_std).toFixed(3) : "-" }}</div>
              </div>
              <div class="card text-center">
                <div class="text-2xl font-bold text-green-600">{{ runFolds.stats.prec_1_mean != null ? Number(runFolds.stats.prec_1_mean).toFixed(3) : "-" }}</div>
                <div class="text-sm text-gray-600">Precision (y=1) Mean</div>
                <div class="text-xs text-gray-500">±{{ runFolds.stats.prec_1_std != null ? Number(runFolds.stats.prec_1_std).toFixed(3) : "-" }}</div>
              </div>
            </div>

            <!-- Fold Metrics Table -->
            <div class="card">
              <h4 class="text-lg font-semibold mb-4">Fold Metrics</h4>
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left py-2">Fold</th>
                      <th class="text-center py-2">AUC</th>
                      <th class="text-center py-2">Accuracy</th>
                      <th class="text-center py-2">Precision (y=1)</th>
                      <th class="text-center py-2">Recall (y=1)</th>
                      <th class="text-center py-2">F1 (y=1)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="fold in runFolds.folds" :key="fold.fold" class="border-b">
                      <td class="py-2 font-medium">{{ fold.fold }}</td>
                      <td class="py-2 text-center">{{ fold.auc != null ? Number(fold.auc).toFixed(3) : "-" }}</td>
                      <td class="py-2 text-center">{{ fold.accuracy != null ? Number(fold.accuracy).toFixed(3) : "-" }}
                      </td>
                      <td class="py-2 text-center">{{ fold.precision_1 != null ? Number(fold.precision_1).toFixed(3) :
                        "-" }}
                      </td>
                      <td class="py-2 text-center">{{ fold.recall_1 != null ? Number(fold.recall_1).toFixed(3) : "-" }}
                      </td>
                      <td class="py-2 text-center">{{ fold.f1_1 != null ? Number(fold.f1_1).toFixed(3) : "-" }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Feature Analysis Tab -->
        <div v-if="activeTab === 'features'" class="space-y-6">
          <div v-if="featureLoading" class="flex items-center justify-center h-64">
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div v-else-if="featureError" class="text-center py-8">
            <p class="text-red-600 mb-4">{{ featureError }}</p>
            <button @click="fetchFeatureData" class="btn-primary">Retry</button>
          </div>

          <div v-else-if="!featureSummary" class="text-center py-8">
            <p class="text-gray-500">No feature analysis data available</p>
          </div>

          <div v-else>
            <!-- Data Overview -->
            <div class="card">
              <h4 class="text-lg font-semibold mb-4">Data Overview</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ formatNumber(featureSummary.data_overview.total_samples) }}</div>
                  <div class="text-sm text-gray-600">Total Samples</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">{{ formatNumber(featureSummary.data_overview.y1) }}</div>
                  <div class="text-sm text-gray-600">Positive (y=1)</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-red-600">{{ formatNumber(featureSummary.data_overview.y0) }}</div>
                  <div class="text-sm text-gray-600">Negative (y=0)</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">{{ formatNumber(featureSummary.data_overview.imbalance_ratio, 3) }}
                  </div>
                  <div class="text-sm text-gray-600">Imbalance Ratio</div>
                </div>
              </div>
            </div>

            <!-- Feature Statistics -->
            <div class="card">
              <h4 class="text-lg font-semibold mb-4">Feature Statistics</h4>
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left py-2">Feature</th>
                      <th class="text-center py-2">Cohen's d</th>
                      <th class="text-center py-2">Mutual Info</th>
                      <th class="text-center py-2">P-value</th>
                      <th class="text-center py-2">Overlap</th>
                      <th class="text-center py-2">Significant</th>
                      <th class="text-center py-2">High Separation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="feature in featureSummary.dense_feature_stats" :key="feature.feature_name"
                      class="border-b">
                      <td class="py-2 font-medium">{{ feature.feature_name }}</td>
                      <td class="py-2 text-center">{{ feature.cohens_d != null ? Number(feature.cohens_d).toFixed(3) : "-" }}</td>
                      <td class="py-2 text-center">{{ feature.mutual_info != null ? Number(feature.mutual_info).toFixed(3) : "-" }}</td>
                      <td class="py-2 text-center">{{ feature.p_value != null ? Number(feature.p_value).toExponential(2) : "-" }}</td>
                      <td class="py-2 text-center">{{ feature.overlap_coefficient != null ? Number(feature.overlap_coefficient).toFixed(3) : "-" }}</td>
                      <td class="py-2 text-center">
                        <span :class="feature.is_significant ? 'text-green-600' : 'text-red-600'">
                          {{ feature.is_significant ? 'Yes' : 'No' }}
                        </span>
                      </td>
                      <td class="py-2 text-center">
                        <span :class="feature.has_high_separation ? 'text-green-600' : 'text-red-600'">
                          {{ feature.has_high_separation ? 'Yes' : 'No' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Visualizations -->
            <div v-if="visualizations && visualizations.visualizations.length > 0" class="card">
              <h4 class="text-lg font-semibold mb-4">Visualizations</h4>
              <div class="space-y-4">
                <div v-for="viz in visualizations.visualizations" :key="viz.viz_type" class="border rounded-lg p-4">
                  <h5 class="font-medium mb-2 capitalize">{{ viz.viz_type.toUpperCase() }} Visualization</h5>
                  <div class="flex items-center space-x-4 mb-4">
                    <span v-if="viz.separation_score" class="text-sm text-gray-600">
                      Separation Score: {{ viz.separation_score != null ? Number(viz.separation_score).toFixed(3) : "-" }}
                    </span>
                    <span v-if="viz.explained_var_1" class="text-sm text-gray-600">
                      Explained Var 1: {{ viz.explained_var_1 != null ? Number(viz.explained_var_1 * 100).toFixed(1) : "-" }}%
                    </span>
                    <span v-if="viz.explained_var_2" class="text-sm text-gray-600">
                      Explained Var 2: {{ viz.explained_var_2 != null ? Number(viz.explained_var_2 * 100).toFixed(1) : "-" }}%
                    </span>
                  </div>
                  <div class="flex justify-center">
                    <object :data="viz.url" type="image/svg+xml" class="max-w-full h-auto max-h-96">
                      <img :src="viz.url" :alt="`${viz.viz_type} visualization`" class="max-w-full h-auto max-h-96" />
                    </object>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRunDetails, useFeatureAnalysis } from '~/composables/useExperiments';
import type { ExperimentRun } from '~/types';
import Modal from '~/components/ui/Modal.vue';
import Collapsible from '~/components/ui/Collapsible.vue';

interface Props {
  modelValue: boolean;
  runId?: string;
  faBatchId?: string;
  selectedAlgorithm?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const activeTab = ref('overview');

const tabs = [
  { id: 'overview', name: 'Overview' },
  { id: 'cv', name: 'Cross-Validation' },
  { id: 'features', name: 'Feature Analysis' },
];

const modalTitle = computed(() => {
  if (!runSummary.value) return 'Experiment Details';
  return `${props.selectedAlgorithm} - ${runSummary.value.run_id}`;
});

// Run Details
const {
  runSummary,
  runFolds,
  loading,
  error,
  fetchRunSummary,
  fetchRunFolds: fetchRunFoldsFromComposable
} = useRunDetails();

// Feature Analysis
const {
  featureSummary,
  visualizations,
  loading: featureLoading,
  error: featureError,
  fetchFeatureSummary,
  fetchVisualizations
} = useFeatureAnalysis();

const runFoldsLoading = ref(false);
const runFoldsError = ref<string | null>(null);

const retry = () => {
  if (props.runId && props.selectedAlgorithm) {
    fetchRunSummary(props.runId, props.selectedAlgorithm);
  }
};

const fetchRunFolds = async () => {
  if (!props.runId || !props.selectedAlgorithm) return;

  try {
    runFoldsLoading.value = true;
    runFoldsError.value = null;
    await fetchRunFoldsFromComposable(props.runId, props.selectedAlgorithm);
  } catch (err: any) {
    runFoldsError.value = err.message || 'Failed to fetch fold data';
  } finally {
    runFoldsLoading.value = false;
  }
};

const fetchFeatureData = async () => {
  if (!props.faBatchId) return;

  try {
    await Promise.all([
      fetchFeatureSummary(props.faBatchId),
      fetchVisualizations(props.faBatchId)
    ]);
  } catch (err: any) {
    console.error('Error fetching feature data:', err);
  }
};

// Watch for runId changes
watch(() => [props.runId, props.selectedAlgorithm], ([newRunId, newAlgorName]) => {
  if (newRunId && newAlgorName && isOpen.value) {
    fetchRunSummary(newRunId, newAlgorName);
    fetchRunFolds();
  }
});

// Watch for tab changes
watch(activeTab, (newTab) => {
  if (newTab === 'cv' && props.runId && !runFolds.value) {
    fetchRunFolds();
  } else if (newTab === 'features' && props.faBatchId && !featureSummary.value) {
    fetchFeatureData();
  }
});

// Watch for modal open
watch(isOpen, (open) => {
  if (open && props.runId && props.selectedAlgorithm) {
    fetchRunSummary(props.runId, props.selectedAlgorithm);
    fetchRunFolds();
  }
});
</script>
