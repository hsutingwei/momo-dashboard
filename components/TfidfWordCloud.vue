<template>
  <div class="space-y-4">
    <!-- 控制面板 -->
    <div class="flex flex-wrap items-center gap-4">
      <!-- Keyword 篩選 -->
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-medium text-gray-700">Keyword:</span>
        <button
          @click="selectKeyword(null)"
          :class="[
            'badge badge-primary transition-colors',
            selectedKeyword === null ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          All
        </button>
        <button
          v-for="keyword in keywords"
          :key="keyword"
          @click="selectKeyword(keyword)"
          :class="[
            'badge badge-primary transition-colors',
            selectedKeyword === keyword ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ keyword }}
        </button>
      </div>

      <!-- Limit 切換 -->
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-700">Limit:</span>
        <button
          @click="selectLimit(100)"
          :class="[
            'px-3 py-1 rounded text-sm font-medium transition-colors',
            limit === 100 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          TOP 100
        </button>
        <button
          @click="selectLimit(200)"
          :class="[
            'px-3 py-1 rounded text-sm font-medium transition-colors',
            limit === 200 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          TOP 200
        </button>
      </div>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-8">
      <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <p class="text-gray-500">載入 TF-IDF 數據中...</p>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600 mb-2">{{ error }}</p>
      <button @click="fetchTfidfData" class="btn-primary text-sm">重試</button>
    </div>

    <!-- 文字雲 -->
    <div v-else-if="tfidfData && tfidfData.terms.length > 0" class="space-y-4">
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">
          範圍: <span class="font-medium">{{ tfidfData.scope === 'product' ? '商品' : '全站' }}</span>
          <span v-if="tfidfData.keyword" class="ml-2">
            Keyword: <span class="font-medium">{{ tfidfData.keyword }}</span>
          </span>
        </p>
        <p class="text-sm text-gray-600">
          顯示: <span class="font-medium">{{ tfidfData.terms.length }}</span> 個詞彙
        </p>
      </div>
      
      <!-- 文字雲 -->
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="term in tfidfData.terms" 
          :key="term.term"
          :style="{
            fontSize: `${Math.max(12, Math.min(24, 12 + (term.total_tfidf / maxTfidf) * 12))}px`,
            color: getTfidfColor(term.total_tfidf / maxTfidf)
          }"
          class="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
          :title="`${term.term}: ${term.total_tfidf.toFixed(2)} (${term.doc_count} 則評論)`"
        >
          {{ term.term }}
        </span>
      </div>
    </div>

    <!-- 空狀態 -->
    <div v-else class="text-center py-8">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
      </svg>
      <p class="text-gray-500">無 TF-IDF 數據</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { TfidfTopResp, KeywordsResp } from '~/types';

interface Props {
  productId?: number;
}

const props = defineProps<Props>();

// 狀態
const keywords = ref<string[]>([]);
const selectedKeyword = ref<string | null>(null);
const limit = ref(100);
const tfidfData = ref<TfidfTopResp | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// 計算屬性
const maxTfidf = computed(() => {
  if (!tfidfData.value?.terms.length) return 1;
  return Math.max(...tfidfData.value.terms.map(t => t.total_tfidf));
});

// 獲取所有 keywords
const fetchKeywords = async () => {
  try {
    const response = await $fetch('/api/keywords') as KeywordsResp;
    keywords.value = response.keywords;
  } catch (err: any) {
    console.error('Error fetching keywords:', err);
  }
};

// 獲取 TF-IDF 數據
const fetchTfidfData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const params = new URLSearchParams();
    if (props.productId) {
      params.append('product_id', props.productId.toString());
    }
    if (selectedKeyword.value) {
      params.append('keyword', selectedKeyword.value);
    }
    params.append('limit', limit.value.toString());

    const response = await $fetch(`/api/nlp/product-tfidf-top?${params}`) as TfidfTopResp;
    tfidfData.value = response;
  } catch (err: any) {
    error.value = err.message || '載入 TF-IDF 數據失敗';
    console.error('Error fetching TF-IDF data:', err);
  } finally {
    loading.value = false;
  }
};

// 選擇 keyword
const selectKeyword = (keyword: string | null) => {
  selectedKeyword.value = keyword;
};

// 選擇 limit
const selectLimit = (newLimit: number) => {
  limit.value = newLimit;
};

// TF-IDF 顏色計算
const getTfidfColor = (ratio: number) => {
  if (ratio > 0.8) return '#dc2626'; // red-600
  if (ratio > 0.6) return '#ea580c'; // orange-600
  if (ratio > 0.4) return '#d97706'; // amber-600
  if (ratio > 0.2) return '#65a30d'; // lime-600
  return '#059669'; // emerald-600
};

// 監聽變化
watch([selectedKeyword, limit], () => {
  fetchTfidfData();
});

// 監聽 productId 變化
watch(() => props.productId, () => {
  fetchTfidfData();
});

// 組件掛載
onMounted(async () => {
  await fetchKeywords();
  await fetchTfidfData();
});
</script>
