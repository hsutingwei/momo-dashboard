<template>
  <div>
    <!-- Comments Table -->
    <div class="bg-white rounded-lg shadow-soft overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead class="bg-gray-50">
            <tr>
              <th 
                @click="$emit('sort', 'id')" 
                class="table-header"
              >
                ID
                <span v-if="currentSortBy === 'id'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="$emit('sort', 'comment_id')" 
                class="table-header"
              >
                Comment ID
                <span v-if="currentSortBy === 'comment_id'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="$emit('sort', 'product_id')" 
                class="table-header"
              >
                Product ID
                <span v-if="currentSortBy === 'product_id'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="$emit('sort', 'comment_text')" 
                class="table-header"
              >
                Comment Text
                <span v-if="currentSortBy === 'comment_text'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="$emit('sort', 'customer_name')" 
                class="table-header"
              >
                Customer
                <span v-if="currentSortBy === 'customer_name'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="$emit('sort', 'comment_date')" 
                class="table-header"
              >
                Comment Date
                <span v-if="currentSortBy === 'comment_date'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="$emit('sort', 'goods_type')" 
                class="table-header"
              >
                Goods Type
                <span v-if="currentSortBy === 'goods_type'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th class="table-header cursor-default">
                Images
              </th>
              <th 
                @click="$emit('sort', 'like_count')" 
                class="table-header"
              >
                Likes
                <span v-if="currentSortBy === 'like_count'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="$emit('sort', 'reply_content')" 
                class="table-header cursor-default">
                Reply Content
                <span v-if="currentSortBy === 'reply_content'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="$emit('sort', 'reply_date')" 
                class="table-header"
              >
                Reply Date
                <span v-if="currentSortBy === 'reply_date'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="$emit('sort', 'score')" 
                class="table-header"
              >
                Score
                <span v-if="currentSortBy === 'score'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="$emit('sort', 'video_url')" 
                class="table-header cursor-default">
                Video
                <span v-if="currentSortBy === 'video_url'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="$emit('sort', 'capture_time')" 
                class="table-header"
              >
                Capture Time
                <span v-if="currentSortBy === 'capture_time'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="$emit('sort', 'created_at')" 
                class="table-header"
              >
                Created At
                <span v-if="currentSortBy === 'created_at'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="item in items" 
              :key="item.id" 
              class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              @click="openCommentDetail(item)"
            >
              <td class="table-cell">{{ item.id }}</td>
              <td class="table-cell">{{ item.comment_id }}</td>
              <td class="table-cell">{{ item.product_id }}</td>
              <td class="table-cell">
                <div class="max-w-xs">
                  {{ truncateText(item.comment_text, 20) }}
                </div>
              </td>
              <td class="table-cell">{{ item.customer_name }}</td>
              <td class="table-cell text-gray-600 text-sm">
                {{ formatDate(item.comment_date, false) }}
              </td>
              <td class="table-cell">{{ item.goods_type }}</td>
              <td class="table-cell">
                <span 
                  v-if="item.image_urls && item.image_urls.length > 0" 
                  @click="showImages(item.image_urls)"
                  class="cursor-pointer text-primary-600 hover:text-primary-800 underline"
                >
                  {{ item.image_urls.length }} images
                </span>
                <span v-else class="text-gray-500">0</span>
              </td>
              <td class="table-cell">{{ formatNumber(item.like_count) }}</td>
              <td class="table-cell">
                <div v-if="item.reply_content" @click="showFullText(item.reply_content)" class="cursor-pointer max-w-xs">
                  {{ truncateText(item.reply_content, 20) }}
                </div>
                <span v-else class="text-gray-500">-</span>
              </td>
              <td class="table-cell text-gray-600 text-sm">
                {{ item.reply_date ? formatDate(item.reply_date, false) : '-' }}
              </td>
              <td class="table-cell">
                <span v-if="item.score" class="badge badge-primary">
                  {{ item.score }}
                </span>
                <span v-else class="text-gray-500">-</span>
              </td>
              <td class="table-cell">
                <span 
                  v-if="item.video_url" 
                  @click="showVideo(item.video_url)"
                  class="cursor-pointer text-primary-600 hover:text-primary-800 underline"
                >
                  有
                </span>
                <span v-else class="text-gray-500">無</span>
              </td>
              <td class="table-cell text-gray-600 text-sm">
                {{ formatDate(item.capture_time) }}
              </td>
              <td class="table-cell text-gray-600 text-sm">
                {{ formatDate(item.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-3 mt-6">
      <button 
        @click="$emit('page-change', currentPage - 1)"
        :disabled="currentPage <= 1"
        class="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      
      <div class="flex gap-1">
        <button 
          v-for="page in visiblePages" 
          :key="page"
          @click="$emit('page-change', page)"
          :class="[
            'px-3 py-2 border border-gray-300 rounded-md transition-colors',
            page === currentPage 
              ? 'bg-primary-600 text-white border-primary-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        @click="$emit('page-change', currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0 && !pending" class="text-center py-16 text-gray-500">
      <p>No comments found.</p>
    </div>

    <!-- Image Modal -->
    <Modal v-model="showImageModal" title="Images">
      <div class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <img 
            v-for="(url, index) in currentImages" 
            :key="index" 
            :src="url" 
            :alt="`Image ${index + 1}`"
            class="w-full h-auto rounded-lg shadow-md"
            @error="handleImageError"
          />
        </div>
      </div>
    </Modal>

    <!-- Video Modal -->
    <Modal v-model="showVideoModal" title="Video">
      <div class="p-6">
        <video 
          :src="currentVideoUrl" 
          controls 
          class="w-full max-h-[60vh] rounded-lg"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Comment } from '~/types';
import { formatDate, formatNumber, truncateText } from '~/utils/global';
import Modal from '~/components/ui/Modal.vue';

interface Props {
  items: Comment[];
  total: number;
  currentPage: number;
  totalPages: number;
  pending: boolean;
  currentSortBy?: string;
  currentSortOrder?: 'asc' | 'desc';
}

const props = withDefaults(defineProps<Props>(), {
  currentSortBy: 'id',
  currentSortOrder: 'asc'
});

const emit = defineEmits<{
  sort: [field: string];
  'page-change': [page: number];
  'open-detail': [comment: Comment];
}>();

// Modal states
const showImageModal = ref(false);
const showVideoModal = ref(false);
const currentImages = ref<string[]>([]);
const currentVideoUrl = ref('');

// 計算可見的頁碼
const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  const start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(props.totalPages, start + maxVisible - 1);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// 顯示完整文字
const showFullText = (text: string) => {
  alert(text);
};

// 顯示圖片
const showImages = (images: string[]) => {
  currentImages.value = images;
  showImageModal.value = true;
};

// 關閉圖片 Modal
const closeImageModal = () => {
  showImageModal.value = false;
  currentImages.value = [];
};

// 顯示影片
const showVideo = (videoUrl: string) => {
  currentVideoUrl.value = videoUrl;
  showVideoModal.value = true;
};

// 關閉影片 Modal
const closeVideoModal = () => {
  showVideoModal.value = false;
  currentVideoUrl.value = '';
};

// 處理圖片載入錯誤
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
};

// 開啟評論詳細資訊
const openCommentDetail = (comment: Comment) => {
  emit('open-detail', comment);
};
</script> 