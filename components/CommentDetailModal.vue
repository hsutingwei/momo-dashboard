<template>
  <Modal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" title="評論詳細資訊" class="max-w-4xl">
    <div class="space-y-4">
      <!-- 評論基本資訊 -->
      <Collapsible title="評論基本資訊" :default-open="true">
        <template #icon>
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </template>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">ID</label>
            <p class="text-gray-900">{{ comment.id }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">Comment ID</label>
            <p class="text-gray-900">{{ comment.comment_id }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">Product ID</label>
            <p class="text-gray-900">{{ comment.product_id }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">Customer</label>
            <p class="text-gray-900">{{ comment.customer_name }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">Comment Date</label>
            <p class="text-gray-900">{{ formatDate(comment.comment_date, false) }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">Goods Type</label>
            <p class="text-gray-900">{{ comment.goods_type }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">Like Count</label>
            <p class="text-gray-900">{{ formatNumber(comment.like_count) }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">Score</label>
            <p class="text-gray-900">
              <span v-if="comment.score" class="badge badge-primary">
                {{ comment.score }}
              </span>
              <span v-else class="text-gray-500">-</span>
            </p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">Capture Time</label>
            <p class="text-gray-900">{{ formatDate(comment.capture_time) }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">Created At</label>
            <p class="text-gray-900">{{ formatDate(comment.created_at) }}</p>
          </div>
        </div>
      </Collapsible>

      <!-- 商品基本資訊 -->
      <Collapsible title="商品基本資訊">
        <template #icon>
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
        </template>
        <template #badge>
          <div v-if="productLoading" class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </template>
        
        <div v-if="productLoading" class="text-center py-8">
          <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-gray-500">載入商品資訊中...</p>
        </div>
        
        <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">商品名稱</label>
            <p class="text-gray-900 font-medium">{{ product.name }}</p>
            <a 
              v-if="product.product_link" 
              :href="product.product_link" 
              target="_blank" 
              class="text-primary-600 hover:text-primary-800 underline text-sm"
            >
              查看商品
            </a>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">價格</label>
            <p class="text-gray-900">
              <span v-if="product.price" class="font-medium text-green-700">
                {{ formatPrice(product.price) }}
              </span>
              <span v-else class="text-gray-500">-</span>
            </p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">關鍵字</label>
            <p class="text-gray-900">
              <span v-if="product.keyword" class="badge badge-primary">
                {{ product.keyword }}
              </span>
              <span v-else class="text-gray-500">-</span>
            </p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">建立日期</label>
            <p class="text-gray-900">{{ formatDate(product.created_at) }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">更新日期</label>
            <p class="text-gray-900">{{ formatDate(product.updated_at) }}</p>
          </div>
        </div>
        
        <div v-else class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
          <p>無法載入商品資訊</p>
        </div>
      </Collapsible>

      <!-- 圖片 / 影片資訊 -->
      <Collapsible title="圖片 / 影片資訊">
        <template #icon>
          <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </template>
        
        <MediaViewer 
          :images="comment.image_urls"
          :videos="videoItems"
          no-media-message="無圖片或影片"
        />
      </Collapsible>

      <!-- 回覆資訊 -->
      <Collapsible title="回覆資訊">
        <template #icon>
          <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
          </svg>
        </template>
        
        <div v-if="comment.reply_content" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">回覆內容</label>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-900 whitespace-pre-wrap">{{ comment.reply_content }}</p>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">回覆時間</label>
            <p class="text-gray-900">{{ formatDate(comment.reply_date, false) }}</p>
          </div>
        </div>
        
        <div v-else class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
          </svg>
          <p>無回覆</p>
        </div>
      </Collapsible>

      <!-- 評論 Full Text -->
      <Collapsible title="評論 Full Text">
        <template #icon>
          <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </template>
        
        <div v-if="comment.comment_text" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">完整評論文字</label>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-900 whitespace-pre-wrap">{{ comment.comment_text }}</p>
            </div>
          </div>
          
          <!-- 預留斷詞結果的空間 -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-500">斷詞結果</label>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-400 italic">此功能尚未實作</p>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p>無評論內容</p>
        </div>
      </Collapsible>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Comment, Product } from '~/types';
import { formatDate, formatNumber, formatPrice } from '~/utils/global';
import Modal from '~/components/ui/Modal.vue';
import Collapsible from '~/components/ui/Collapsible.vue';
import MediaViewer from '~/components/ui/MediaViewer.vue';

interface Props {
  modelValue: boolean;
  comment: Comment;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

// Product data
const product = ref<Product | null>(null);
const productLoading = ref(false);

// Computed properties
const videoItems = computed(() => {
  if (!props.comment.video_url) return [];
  return [{
    url: props.comment.video_url,
    thumbnail: undefined // 如果有 video_thumbnail_img 欄位可以使用
  }];
});

// Load product data when modal opens
watch(() => props.modelValue, async (newValue) => {
  if (newValue && props.comment.product_id && !product.value) {
    await loadProduct();
  }
});

// Load product data
const loadProduct = async () => {
  try {
    productLoading.value = true;
    const productData = await $fetch<Product>(`/api/products/${props.comment.product_id}`);
    product.value = productData;
  } catch (error) {
    console.error('Failed to load product:', error);
    product.value = null;
  } finally {
    productLoading.value = false;
  }
};
</script> 