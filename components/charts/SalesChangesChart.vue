<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {{ hasProductFilter ? '產品銷售變化次數' : '關鍵字銷售變化統計' }}
    </h3>
    
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
import { BarChart, PieChart } from 'echarts/charts';
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
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
]);

interface SalesChangeData {
  keyword?: string;
  product_id?: number;
  total_change_events?: number;
  changed_products_count?: number;
  change_times?: number;
}

interface Props {
  productId?: string | number;
}

const props = defineProps<Props>();

const data = ref<SalesChangeData[]>([]);
const pending = ref(false);
const error = ref<string | null>(null);
const hasProductFilter = ref(false);

// 獲取數據
const fetchData = async () => {
  pending.value = true;
  error.value = null;
  
  try {
    const params = new URLSearchParams();
    if (props.productId) {
      params.append('product_id', props.productId.toString());
    }
    
    const response = await $fetch(`/api/analysis/sales-changes?${params}`) as any;
    data.value = response.data || [];
    hasProductFilter.value = response.has_product_filter || false;
  } catch (err: any) {
    error.value = err.message || '載入數據失敗';
    console.error('Error fetching sales changes data:', err);
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

  if (hasProductFilter.value) {
    // 單一產品的銷售變化次數
    const item = data.value[0];
    if (!item) {
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
    
    return {
      title: {
        text: `產品 ${item.product_id} 銷售變化次數`,
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          data: [
            {
              value: item.change_times || 0,
              name: '變化次數',
              itemStyle: { color: '#ef4444' }
            },
            {
              value: Math.max(0, 10 - (item.change_times || 0)), // 假設最多10次作為對比
              name: '穩定期間',
              itemStyle: { color: '#10b981' }
            }
          ],
          label: {
            formatter: '{b}: {c} 次'
          }
        }
      ]
    };
  } else {
    // 關鍵字銷售變化統計
    const xAxisData = data.value.map(item => item.keyword || '');
    const changeEventsData = data.value.map(item => item.total_change_events || 0);
    const changedProductsData = data.value.map(item => item.changed_products_count || 0);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['總變化事件', '變化商品數'],
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
        name: '數量'
      },
      series: [
        {
          name: '總變化事件',
          type: 'bar',
          data: changeEventsData,
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: '變化商品數',
          type: 'bar',
          data: changedProductsData,
          itemStyle: { color: '#10b981' }
        }
      ]
    };
  }
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