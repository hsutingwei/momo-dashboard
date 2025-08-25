<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <div class="flex items-center space-x-2">
        <button
          v-for="metric in availableMetrics"
          :key="metric.value"
          @click="selectedMetric = metric.value"
          :class="[
            'px-3 py-1 text-sm rounded-md transition-colors',
            selectedMetric === metric.value
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ metric.label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error" class="flex items-center justify-center h-full">
      <div class="text-center">
        <p class="text-red-600 mb-2">{{ error }}</p>
        <button @click="$emit('retry')" class="btn-primary">
          Retry
        </button>
      </div>
    </div>

    <div v-else-if="!hasData" class="flex items-center justify-center h-full">
      <p class="text-gray-500">No data available</p>
    </div>

    <div v-else ref="chartRef" class="h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import * as echarts from 'echarts';
import type { ExperimentRun } from '~/types';

interface Props {
  title?: string;
  data?: ExperimentRun[];
  loading?: boolean;
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Experiment Comparison',
  loading: false,
  error: null
});

const emit = defineEmits<{
  retry: [];
}>();

const chartRef = ref<HTMLElement>();
let chart: echarts.ECharts | null = null;

const selectedMetric = ref<'auc' | 'precision_1' | 'recall_1' | 'f1_1'>('auc');

const availableMetrics = [
  { label: 'AUC', value: 'auc' as const },
  { label: 'Precision (y=1)', value: 'precision_1' as const },
  { label: 'Recall (y=1)', value: 'recall_1' as const },
  { label: 'F1 (y=1)', value: 'f1_1' as const }
];

const hasData = computed(() => props.data && props.data.length > 0);

const chartData = computed(() => {
  if (!props.data) return [];
  
  return props.data.map(experiment => ({
    name: experiment.code,
    value: experiment.metrics[selectedMetric.value],
    itemStyle: {
      color: getColorByMetric(selectedMetric.value)
    }
  }));
});

const getColorByMetric = (metric: string) => {
  const colors = {
    auc: '#3B82F6',
    precision_1: '#10B981',
    recall_1: '#F59E0B',
    f1_1: '#8B5CF6'
  };
  return colors[metric as keyof typeof colors] || '#3B82F6';
};

const initChart = () => {
  if (!chartRef.value) return;

  chart = echarts.init(chartRef.value);
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const data = params[0];
        return `
          <div class="p-2">
            <div class="font-semibold">${data.name}</div>
            <div>${availableMetrics.find(m => m.value === selectedMetric.value)?.label}: ${data.value != null ? Number(data.value).toFixed(3) : "-"}</div>
          </div>
        `;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.value.map(item => item.name),
      axisLabel: {
        fontSize: 10,
        formatter: (value: string) => value.length > 10 ? value.slice(0, 10) + '...' : value
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: selectedMetric.value === 'auc' ? 1 : 1,
      axisLabel: {
        formatter: (value: number) => value != null ? value.toFixed(2) : "-"
      }
    },
    series: [
      {
        type: 'bar',
        data: chartData.value,
        itemStyle: {
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  chart.setOption(option);
};

const updateChart = () => {
  if (!chart) return;

  const option = {
    xAxis: {
      data: chartData.value.map(item => item.name)
    },
    series: [
      {
        data: chartData.value
      }
    ]
  };

  chart.setOption(option);
};

watch([chartData, selectedMetric], () => {
  if (chart) {
    updateChart();
  }
});

watch(() => props.data, () => {
  if (chart && hasData.value) {
    updateChart();
  }
}, { deep: true });

onMounted(() => {
  if (hasData.value) {
    initChart();
  }
});

// 清理
onUnmounted(() => {
  if (chart) {
    chart.dispose();
  }
});
</script>
