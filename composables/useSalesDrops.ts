import type { SalesDropResp } from '~/types';

export const useSalesDrops = () => {
  const count = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 獲取銷售下降商品數量
  const fetchCount = async (params?: {
    keywords?: string;
    from?: string;
    to?: string;
  }) => {
    loading.value = true;
    error.value = null;
    
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.keywords) queryParams.append('keywords', params.keywords);
      if (params?.from) queryParams.append('from', params.from);
      if (params?.to) queryParams.append('to', params.to);
      
      // 只獲取數量，不獲取詳細列表
      queryParams.append('limit', '0');
      
      const response = await $fetch(`/api/analysis/sales-drops?${queryParams}`) as SalesDropResp;
      count.value = response.count;
    } catch (err: any) {
      error.value = err.message || '載入數據失敗';
      console.error('Error fetching sales drops count:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    count: readonly(count),
    loading: readonly(loading),
    error: readonly(error),
    fetchCount
  };
};
