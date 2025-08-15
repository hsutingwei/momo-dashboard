<template>
  <div class="card">
    <h3 v-if="title" class="text-lg font-semibold text-gray-900 mb-4">{{ title }}</h3>
    
    <!-- 載入狀態 -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <p class="text-gray-600">載入圖表中...</p>
    </div>
    
    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="flex items-center justify-center h-64">
      <div class="text-center">
        <p class="text-red-600 mb-2">{{ error }}</p>
        <button v-if="onRetry" @click="onRetry" class="btn-primary">重試</button>
      </div>
    </div>
    
    <!-- 圖表 -->
    <div v-else class="h-96">
      <ClientOnly>
        <v-chart 
          :option="chartOption" 
          :loading="loading"
          autoresize
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';

// 註冊 ECharts 組件
use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
]);

// 通用數據系列介面
export interface BarChartSeries {
  name: string;
  data: number[];
  color?: string;
}

// 圖表配置介面
export interface BarChartConfig {
  xAxisData: string[];
  series: BarChartSeries[];
  xAxisName?: string;
  yAxisName?: string;
  tooltipFormatter?: (params: any) => string;
  colors?: string[];
}

interface Props {
  title?: string;
  config: BarChartConfig;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  loading: false,
  error: null,
  onRetry: undefined
});

// 計算圖表配置
const chartOption = computed(() => {
  if (!props.config || !props.config.series.length) {
    return {
      title: {
        text: '無數據',
        left: 'center',
        top: 'middle',
        textStyle: { color: '#999' }
      }
    };
  }

  const { config } = props;
  const defaultColors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'];
  const colors = config.colors || defaultColors;

  // 準備系列數據
  const series = config.series.map((seriesData, index) => ({
    name: seriesData.name,
    type: 'bar',
    data: seriesData.data,
    itemStyle: {
      color: seriesData.color || colors[index % colors.length]
    },
    emphasis: { focus: 'series' }
  }));

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: config.tooltipFormatter || ((params: any) => {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach((param: any) => {
          if (param.value > 0) {
            result += `${param.marker}${param.seriesName}: ${param.value}<br/>`;
          }
        });
        return result;
      })
    },
    legend: {
      data: config.series.map(s => s.name),
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: config.xAxisData,
      name: config.xAxisName,
      axisLabel: { 
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      name: config.yAxisName,
      minInterval: 1
    },
    series
  };
});
</script>
