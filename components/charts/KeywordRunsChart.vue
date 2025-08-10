<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">關鍵字比較 - 分批次評論數</h3>
    
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

interface KeywordRunData {
  keyword: string;
  aligned_index: number;
  run_index_from_start: number;
  run_ts: string;
  run_ts_label: string;
  comment_count: number;
  total_runs: number;
  max_runs: number;
}

interface Props {
  keywords?: string;
  from?: string;
  to?: string;
}

const props = withDefaults(defineProps<Props>(), {
  keywords: '益生菌,口罩'
});

const data = ref<KeywordRunData[]>([]);
const pending = ref(false);
const error = ref<string | null>(null);

// 獲取數據
const fetchData = async () => {
  if (!props.keywords) return;
  
  pending.value = true;
  error.value = null;
  
  try {
    const params = new URLSearchParams({
      keywords: props.keywords
    });
    
    if (props.from) params.append('from', props.from);
    if (props.to) params.append('to', props.to);
    
    const response = await $fetch(`/api/analysis/keyword-runs?${params}`) as any;
    data.value = response.data || [];
  } catch (err: any) {
    error.value = err.message || '載入數據失敗';
    console.error('Error fetching keyword runs data:', err);
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

  // 按關鍵字分組數據
  const keywordGroups = new Map<string, KeywordRunData[]>();
  const maxRuns = data.value[0]?.max_runs || 0;
  
  data.value.forEach(item => {
    if (!keywordGroups.has(item.keyword)) {
      keywordGroups.set(item.keyword, []);
    }
    keywordGroups.get(item.keyword)!.push(item);
  });

  // 準備系列數據
  const series: any[] = [];
  const xAxisData: string[] = [];
  
  // 生成 X 軸標籤
  for (let i = 1; i <= maxRuns; i++) {
    xAxisData.push(`第${i}次`);
  }

  // 為每個關鍵字創建系列
  keywordGroups.forEach((items, keyword) => {
    const seriesData = new Array(maxRuns).fill(0);
    
    items.forEach(item => {
      const index = item.aligned_index - 1; // 轉換為 0-based 索引
      if (index >= 0 && index < maxRuns) {
        seriesData[index] = item.comment_count;
      }
    });

    series.push({
      name: keyword,
      type: 'bar',
      data: seriesData,
      emphasis: {
        focus: 'series'
      }
    });
  });

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
            // 找到對應的時間標籤
            const item = data.value.find(d => 
              d.keyword === param.seriesName && 
              d.aligned_index === param.dataIndex + 1
            );
            const timeLabel = item ? item.run_ts_label : '';
            result += `${param.marker}${param.seriesName}: ${param.value} (${timeLabel})<br/>`;
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
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '評論數'
    },
    series
  };
});

// 監聽 props 變化
watch(() => [props.keywords, props.from, props.to], () => {
  fetchData();
}, { deep: true });

// 組件掛載時獲取數據
onMounted(() => {
  fetchData();
});
</script> 