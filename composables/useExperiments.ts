import { ref, computed } from 'vue';
import type { 
  ExperimentBatch, 
  RunSummary, 
  RunFolds, 
  FeatureAnalysisSummary, 
  FeatureAnalysisVisualizations,
  AnalysisBatch 
} from '~/types';

export function useExperiments() {
  const batches = ref<AnalysisBatch[]>([]);
  const selectedBatch = ref<string>('');
  const experimentData = ref<ExperimentBatch | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 獲取所有批次
  const fetchBatches = async () => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch<AnalysisBatch[]>('/api/experiments/batches');
      batches.value = data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch batches';
      console.error('Error fetching batches:', err);
    } finally {
      loading.value = false;
    }
  };

  // 獲取特定批次的實驗數據
  const fetchExperimentData = async (batchId: string) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch<ExperimentBatch>(`/api/experiments/${batchId}/runs`);
      experimentData.value = data;
      selectedBatch.value = batchId;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch experiment data';
      console.error('Error fetching experiment data:', err);
    } finally {
      loading.value = false;
    }
  };

  // 計算屬性
  const selectedBatchInfo = computed(() => 
    batches.value.find(batch => batch.id === selectedBatch.value)
  );

  const hasData = computed(() => 
    experimentData.value && experimentData.value.codes.length > 0
  );

  const bestAUC = computed(() => {
    if (!experimentData.value?.codes.length) return 0;
    return Math.max(...experimentData.value.codes.map(code => code.metrics.auc));
  });

  const bestPrecision = computed(() => {
    if (!experimentData.value?.codes.length) return 0;
    return Math.max(...experimentData.value.codes.map(code => code.metrics.precision_1));
  });

  const bestRecall = computed(() => {
    if (!experimentData.value?.codes.length) return 0;
    return Math.max(...experimentData.value.codes.map(code => code.metrics.recall_1));
  });

  const bestF1 = computed(() => {
    if (!experimentData.value?.codes.length) return 0;
    return Math.max(...experimentData.value.codes.map(code => code.metrics.f1_1));
  });

  return {
    // 狀態
    batches,
    selectedBatch,
    experimentData,
    loading,
    error,
    
    // 計算屬性
    selectedBatchInfo,
    hasData,
    bestAUC,
    bestPrecision,
    bestRecall,
    bestF1,
    
    // 方法
    fetchBatches,
    fetchExperimentData
  };
}

export function useRunDetails() {
  const runSummary = ref<RunSummary | null>(null);
  const runFolds = ref<RunFolds | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchRunSummary = async (runId: string) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch<RunSummary>(`/api/runs/${runId}/summary`);
      runSummary.value = data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch run summary';
      console.error('Error fetching run summary:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchRunFolds = async (runId: string) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch<RunFolds>(`/api/runs/${runId}/folds`);
      runFolds.value = data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch run folds';
      console.error('Error fetching run folds:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    runSummary,
    runFolds,
    loading,
    error,
    fetchRunSummary,
    fetchRunFolds
  };
}

export function useFeatureAnalysis() {
  const featureSummary = ref<FeatureAnalysisSummary | null>(null);
  const visualizations = ref<FeatureAnalysisVisualizations | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchFeatureSummary = async (batchId: string) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch<FeatureAnalysisSummary>(`/api/feature-analysis/${batchId}/summary`);
      featureSummary.value = data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch feature summary';
      console.error('Error fetching feature summary:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchVisualizations = async (batchId: string) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch<FeatureAnalysisVisualizations>(`/api/feature-analysis/${batchId}/visualizations`);
      visualizations.value = data;
      console.log(visualizations.value);
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch visualizations';
      console.error('Error fetching visualizations:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    featureSummary,
    visualizations,
    loading,
    error,
    fetchFeatureSummary,
    fetchVisualizations
  };
}
