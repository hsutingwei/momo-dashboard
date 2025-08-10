<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">產品評論趨勢</h3>
    
    <!-- 載入狀態 -->
    <div v-if="pending" class="flex items-center justify-center h-64">
      <p class="text-gray-600">載入圖表中...</p>
    </div>
    
    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="flex items-center justify-center h-64">
      <div class="text-center">
        <p class="text-red-600 mb-2">{{ error }}</p>
        <button @click="fetchData" class="btn-primary">重試</button>
      </div>
    </div>
    
    <!-- 無產品 ID 提示 -->
    <div v-else-if="!productId" class="flex items-center justify-center h-64">
      <div class="text-center">
        <p class="text-gray-600 mb-2">請選擇產品 ID 以查看評論趨勢</p>
      </div>
    </div>
    
    <!-- 圖表 -->
    <div v-else class="h-96">
      <v-chart 
        :option="chartOption" 
        :loading="pending"
        autoresize
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';

// 註冊 ECharts 組件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
]);

interface ProductRunData {
  product_id: number;
  run_ts: string;
  run_ts_label: string;
  comment_count: number;
  run_index_from_start: number;
  total_runs: number;
}

interface Props {
  productId?: string | number;
}

const props = defineProps<Props>();

const data = ref<ProductRunData[]>([]);
const pending = ref(false);
const error = ref<string | null>(null);

// 獲取數據
const fetchData = async () => {
  if (!props.productId) return;
  
  pending.value = true;
  error.value = null;
  
  try {
    const response = await $fetch(`/api/analysis/product-runs?product_id=${props.productId}`) as any;
    data.value = response.data || [];
  } catch (err: any) {
    error.value = err.message || '載入數據失敗';
    console.error('Error fetching product runs data:', err);
  } finally {
    pending.value = false;
  }
};

// 計算圖表配置
const chartOption = computed(() => {
  if (!data.value.length) {
    return {
      title: {
        text: '無數據',
        left: 'center',
        top: 'middle',
        textStyle: {
          color: '#999'
        }
      }
    };
  }

  // 準備數據
  const xAxisData = data.value.map(item => `第${item.run_index_from_start}次`);
  const seriesData = data.value.map(item => item.comment_count);

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const param = params[0];
        const item = data.value[param.dataIndex];
        if (!item) return '';
        return `${item.run_ts_label}: ${param.value} 則評論`;
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
      data: xAxisData,
      name: '爬蟲次數',
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '評論數'
    },
    series: [
      {
        name: '評論數',
        type: 'line',
        data: seriesData,
        smooth: true,
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#3b82f6'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
            ]
          }
        }
      }
    ]
  };
});

// 監聽 props 變化
watch(() => props.productId, () => {
  fetchData();
});

// 組件掛載時獲取數據
onMounted(() => {
  fetchData();
});
</script> 