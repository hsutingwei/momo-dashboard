import { ref, onMounted } from 'vue';
import type { DashboardStats } from '~/types';

export function useDashboardStats() {
  const stats = ref<DashboardStats>({
    totalProducts: 0,
    totalComments: 0,
    uniqueKeywords: 0,
    productsWithSalesChanges: 0
  });
  
  const error = ref<string | null>(null);
  const pending = ref(false);

  const fetchStats = async () => {
    pending.value = true;
    error.value = null;
    
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      stats.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      pending.value = false;
    }
  };

  const refresh = () => {
    fetchStats();
  };

  onMounted(() => {
    fetchStats();
  });

  return {
    stats,
    error,
    refresh,
    pending
  };
} 