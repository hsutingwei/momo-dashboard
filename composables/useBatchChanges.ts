import type { BatchChangeData } from '~/types';
import type { BarChartConfig, BarChartSeries } from '~/components/charts/BarChart.vue';

export const useBatchChanges = () => {
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
  const fetchData = async (params: {
    keywords?: string;
    from?: string;
    to?: string;
  }) => {
    pending.value = true;
    error.value = null;
    
    try {
      const queryParams = new URLSearchParams();
      
      if (params.keywords) queryParams.append('keywords', params.keywords);
      if (params.from) queryParams.append('from', params.from);
      if (params.to) queryParams.append('to', params.to);
      
      const response = await $fetch(`/api/analysis/batch-changes?${queryParams}`) as any;
      data.value = response.data || [];
    } catch (err: any) {
      error.value = err.message || '載入數據失敗';
      console.error('Error fetching batch changes data:', err);
    } finally {
      pending.value = false;
    }
  };

  // 將數據轉換為圖表配置
  const toChartConfig = (): BarChartConfig => {
    if (!data.value.length) {
      return {
        xAxisData: [],
        series: []
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
    const series: BarChartSeries[] = [];
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
        data: seriesData,
        color: colors[colorIndex % colors.length]
      });

      colorIndex++;
    });

    // 生成 X 軸標籤（批次時間）
    const xAxisData = sortedBatchTimes.map(time => formatTime(time));

    // 自定義 tooltip 格式化器
    const tooltipFormatter = (params: any) => {
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
    };

    return {
      xAxisData,
      series,
      xAxisName: '批次時間',
      yAxisName: '變化商品數量',
      tooltipFormatter,
      colors
    };
  };

  return {
    data: readonly(data),
    pending: readonly(pending),
    error: readonly(error),
    fetchData,
    toChartConfig,
    formatNumber,
    formatTime
  };
};
