import { ref } from 'vue';

interface SentimentResult {
  id: number;
  productId: number;
  commentId: string;
  sentimentScore: number;
  sentimentLabel: 'positive' | 'negative' | 'neutral';
  confidence: number;
  method: 'ckip' | 'bert';
  createdAt: string;
}

export function useSentimentAnalysis(productId: number | string) {
  const results = ref<SentimentResult[]>([]);
  const error = ref<string | null>(null);
  const pending = ref(false);

  const fetchSentimentAnalysis = async () => {
    if (!productId) return;
    
    pending.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`/api/analysis/sentiment?productId=${productId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      results.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to fetch sentiment analysis:', err);
    } finally {
      pending.value = false;
    }
  };

  const refresh = () => {
    fetchSentimentAnalysis();
  };

  return {
    results,
    error,
    refresh,
    pending,
    fetchSentimentAnalysis
  };
} 