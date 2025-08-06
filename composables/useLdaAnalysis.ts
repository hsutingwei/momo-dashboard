import { ref } from 'vue';

interface LdaResult {
  id: number;
  productId: number;
  topicId: number;
  topicWords: string[];
  score: number;
  createdAt: string;
}

export function useLdaAnalysis(productId: number | string) {
  const results = ref<LdaResult[]>([]);
  const error = ref<string | null>(null);
  const pending = ref(false);

  const fetchLdaAnalysis = async () => {
    if (!productId) return;
    
    pending.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`/api/analysis/lda?productId=${productId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      results.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to fetch LDA analysis:', err);
    } finally {
      pending.value = false;
    }
  };

  const refresh = () => {
    fetchLdaAnalysis();
  };

  return {
    results,
    error,
    refresh,
    pending,
    fetchLdaAnalysis
  };
} 