import { ref, onMounted } from 'vue';
import type { KeywordRun, ProductRun, SalesChange } from '~/types';

interface CommentStats {
  totalComments: number;
  keywordRuns?: KeywordRun[];
  productRuns?: ProductRun[];
  salesChanges?: SalesChange[];
}

export function useCommentStats() {
  const stats = ref<CommentStats>({
    totalComments: 0
  });
  
  const error = ref<string | null>(null);
  const pending = ref(false);

  const fetchStats = async (filters?: { productId?: string; commentText?: string; captureTime?: string }) => {
    pending.value = true;
    error.value = null;
    
    try {
      const params = new URLSearchParams();
      if (filters?.productId) params.append('product_id', filters.productId);
      if (filters?.commentText) params.append('comment_text', filters.commentText);
      if (filters?.captureTime) params.append('capture_time', filters.captureTime);
      
      const response = await fetch(`/api/comments/stats?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      stats.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to fetch comment stats:', err);
    } finally {
      pending.value = false;
    }
  };

  const refresh = (filters?: { productId?: string; commentText?: string; captureTime?: string }) => {
    fetchStats(filters);
  };

  onMounted(() => {
    fetchStats();
  });

  return {
    stats,
    error,
    refresh,
    pending,
    fetchStats
  };
} 