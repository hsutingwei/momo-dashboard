<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ title }}</h3>
    
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
    
    <!-- 圖表 -->
    <div v-else class="h-96">
      <ClientOnly>
        <v-chart 
          :option="chartOption" 
          :loading="pending"
          autoresize
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
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
import type { BatchChangeData } from '~/types';

// 註冊 ECharts 組件
use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
]);

interface Props {
  title?: string;
  keywords?: string;
  from?: string;
  to?: string;
  // 可選：直接傳入數據而不從 API 獲取
  data?: BatchChangeData[];
}

const props = withDefaults(defineProps<Props>(), {
  title: '批次變化分析',
  keywords: '',
  data: undefined
});

const data = ref<BatchChangeData[]>([]);
const pending = ref(false);
const error = ref<string | null>(null);

// 格式化數字
const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// 格式化時間
const formatTime = (timeStr: string): string => {
  const date = new Date(timeStr);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 獲取數據
const fetchData = async () => {
  // 如果直接傳入了數據，直接使用
  if (props.data) {
    data.value = props.data;
    return;
  }

  pending.value = true;
  error.value = null;
  
  try {
    const params = new URLSearchParams({
      keywords: props.keywords
    });
    
    if (props.from) params.append('from', props.from);
    if (props.to) params.append('to', props.to);
    
    const response = await $fetch(`/api/analysis/batch-changes?${params}`) as any;
    data.value = response.data || [];
  } catch (err: any) {
    error.value = err.message || '載入數據失敗';
    console.error('Error fetching batch changes data:', err);
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
        textStyle: { color: '#999' }
      }
    };
  }

  // 按關鍵字分組數據
  const keywordGroups = new Map<string, BatchChangeData[]>();
  const allBatchTimes = new Set<string>();

  data.value.forEach(item => {
    if (!keywordGroups.has(item.keyword)) {
      keywordGroups.set(item.keyword, []);
    }
    keywordGroups.get(item.keyword)!.push(item);
    allBatchTimes.add(item.batch_capture_time);
  });

  // 排序批次時間
  const sortedBatchTimes = Array.from(allBatchTimes).sort();

  // 準備系列數據
  const series: any[] = [];
  const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'];

  // 為每個關鍵字創建系列
  let colorIndex = 0;
  keywordGroups.forEach((items, keyword) => {
    const seriesData = sortedBatchTimes.map(batchTime => {
      const item = items.find(i => i.batch_capture_time === batchTime);
      return item ? item.changed_products_count : 0;
    });

    series.push({
      name: keyword,
      type: 'bar',
      data: seriesData,
      itemStyle: {
        color: colors[colorIndex % colors.length]
      },
      emphasis: { focus: 'series' }
    });

    colorIndex++;
  });

  // 生成 X 軸標籤（批次時間）
  const xAxisData = sortedBatchTimes.map(time => formatTime(time));

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach((param: any) => {
          if (param.value > 0) {
            const item = data.value.find(d =>
              d.keyword === param.seriesName &&
              formatTime(d.batch_capture_time) === param.axisValue
            );
            const batchIndex = item ? item.batch_index : '';
            result += `${param.marker}${param.seriesName} 第${batchIndex}次: ${formatNumber(param.value)}個商品<br/>`;
          }
        });
        return result;
      }
    },
    legend: {
      data: Array.from(keywordGroups.keys()),
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
      data: xAxisData,
      axisLabel: { 
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      name: '變化商品數量',
      minInterval: 1
    },
    series
  };
});

// 監聽 props 變化
watch(() => [props.keywords, props.from, props.to, props.data], () => {
  fetchData();
}, { deep: true });

// 組件掛載時獲取數據
onMounted(() => {
  fetchData();
});
</script>
