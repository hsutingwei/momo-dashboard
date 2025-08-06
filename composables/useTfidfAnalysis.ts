import { ref } from 'vue';

interface TfidfResult {
  id: number;
  productId: number;
  keyword: string;
  tfidfScore: number;
  frequency: number;
  createdAt: string;
}

export function useTfidfAnalysis(productId: number | string) {
  const results = ref<TfidfResult[]>([]);
  const error = ref<string | null>(null);
  const pending = ref(false);

  const fetchTfidfAnalysis = async () => {
    if (!productId) return;
    
    pending.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`/api/analysis/tfidf?productId=${productId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      results.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to fetch TF-IDF analysis:', err);
    } finally {
      pending.value = false;
    }
  };

  const refresh = () => {
    fetchTfidfAnalysis();
  };

  return {
    results,
    error,
    refresh,
    pending,
    fetchTfidfAnalysis
  };
} 