<template>
  <div>
    <!-- Comments Table -->
    <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead style="background-color: #f8f9fa;">
          <tr>
            <th 
              @click="$emit('sort', 'id')" 
              style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; cursor: pointer; font-weight: 600; color: #495057;"
            >
              ID
              <span v-if="currentSortBy === 'id'" style="margin-left: 5px;">
                {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              @click="$emit('sort', 'comment_id')" 
              style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; cursor: pointer; font-weight: 600; color: #495057;"
            >
              Comment ID
              <span v-if="currentSortBy === 'comment_id'" style="margin-left: 5px;">
                {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              @click="$emit('sort', 'product_id')" 
              style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; cursor: pointer; font-weight: 600; color: #495057;"
            >
              Product ID
              <span v-if="currentSortBy === 'product_id'" style="margin-left: 5px;">
                {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              @click="$emit('sort', 'comment_text')" 
              style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; cursor: pointer; font-weight: 600; color: #495057;"
            >
              Comment Text
              <span v-if="currentSortBy === 'comment_text'" style="margin-left: 5px;">
                {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              @click="$emit('sort', 'customer_name')" 
              style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; cursor: pointer; font-weight: 600; color: #495057;"
            >
              Customer
              <span v-if="currentSortBy === 'customer_name'" style="margin-left: 5px;">
                {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              @click="$emit('sort', 'comment_date')" 
              style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; cursor: pointer; font-weight: 600; color: #495057;"
            >
              Comment Date
              <span v-if="currentSortBy === 'comment_date'" style="margin-left: 5px;">
                {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              @click="$emit('sort', 'goods_type')" 
              style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; cursor: pointer; font-weight: 600; color: #495057;"
            >
              Goods Type
              <span v-if="currentSortBy === 'goods_type'" style="margin-left: 5px;">
                {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057;">
              Images
            </th>
            <th 
              @click="$emit('sort', 'like_count')" 
              style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; cursor: pointer; font-weight: 600; color: #495057;"
            >
              Likes
              <span v-if="currentSortBy === 'like_count'" style="margin-left: 5px;">
                {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057;">
              Reply Content
            </th>
            <th 
              @click="$emit('sort', 'reply_date')" 
              style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; cursor: pointer; font-weight: 600; color: #495057;"
            >
              Reply Date
              <span v-if="currentSortBy === 'reply_date'" style="margin-left: 5px;">
                {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              @click="$emit('sort', 'score')" 
              style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; cursor: pointer; font-weight: 600; color: #495057;"
            >
              Score
              <span v-if="currentSortBy === 'score'" style="margin-left: 5px;">
                {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057;">
              Video
            </th>
            <th 
              @click="$emit('sort', 'capture_time')" 
              style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; cursor: pointer; font-weight: 600; color: #495057;"
            >
              Capture Time
              <span v-if="currentSortBy === 'capture_time'" style="margin-left: 5px;">
                {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              @click="$emit('sort', 'created_at')" 
              style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; cursor: pointer; font-weight: 600; color: #495057;"
            >
              Created At
              <span v-if="currentSortBy === 'created_at'" style="margin-left: 5px;">
                {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" style="border-bottom: 1px solid #f1f3f4;">
            <td style="padding: 12px; color: #333;">{{ item.id }}</td>
            <td style="padding: 12px; color: #333;">{{ item.comment_id }}</td>
            <td style="padding: 12px; color: #333;">{{ item.product_id }}</td>
            <td style="padding: 12px; color: #333;">
              <div @click="showFullText(item.comment_text)" style="cursor: pointer; max-width: 200px;">
                {{ truncateText(item.comment_text, 20) }}
              </div>
            </td>
            <td style="padding: 12px; color: #333;">{{ item.customer_name }}</td>
            <td style="padding: 12px; color: #666; font-size: 0.9rem;">
              {{ formatDate(item.comment_date, false) }}
            </td>
            <td style="padding: 12px; color: #333;">{{ item.goods_type }}</td>
            <td style="padding: 12px; color: #333;">
              <span 
                v-if="item.image_urls && item.image_urls.length > 0" 
                @click="showImages(item.image_urls)"
                style="cursor: pointer; color: #2196f3; text-decoration: underline;"
              >
                {{ item.image_urls.length }} images
              </span>
              <span v-else style="color: #666;">0</span>
            </td>
            <td style="padding: 12px; color: #333;">{{ formatNumber(item.like_count) }}</td>
            <td style="padding: 12px; color: #333;">
              <div v-if="item.reply_content" @click="showFullText(item.reply_content)" style="cursor: pointer; max-width: 200px;">
                {{ truncateText(item.reply_content, 20) }}
              </div>
              <span v-else style="color: #666;">-</span>
            </td>
            <td style="padding: 12px; color: #666; font-size: 0.9rem;">
              {{ item.reply_date ? formatDate(item.reply_date, false) : '-' }}
            </td>
            <td style="padding: 12px; color: #333;">
              <span v-if="item.score" style="background: #e3f2fd; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem;">
                {{ item.score }}
              </span>
              <span v-else style="color: #666;">-</span>
            </td>
            <td style="padding: 12px; color: #333;">
              <span 
                v-if="item.video_url" 
                @click="showVideo(item.video_url)"
                style="cursor: pointer; color: #2196f3; text-decoration: underline;"
              >
                有
              </span>
              <span v-else style="color: #666;">無</span>
            </td>
            <td style="padding: 12px; color: #666; font-size: 0.9rem;">
              {{ formatDate(item.capture_time) }}
            </td>
            <td style="padding: 12px; color: #666; font-size: 0.9rem;">
              {{ formatDate(item.created_at) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" style="margin-top: 20px; display: flex; justify-content: center; align-items: center; gap: 10px;">
      <button 
        @click="$emit('page-change', currentPage - 1)"
        :disabled="currentPage <= 1"
        style="padding: 8px 12px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;"
        :style="{ opacity: currentPage <= 1 ? 0.5 : 1, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }"
      >
        Previous
      </button>
      
      <div style="display: flex; gap: 5px;">
        <button 
          v-for="page in visiblePages" 
          :key="page"
          @click="$emit('page-change', page)"
          :style="{
            padding: '8px 12px',
            background: page === currentPage ? '#2196f3' : '#f5f5f5',
            color: page === currentPage ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        @click="$emit('page-change', currentPage + 1)"
        :disabled="currentPage >= totalPages"
        style="padding: 8px 12px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;"
        :style="{ opacity: currentPage >= totalPages ? 0.5 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }"
      >
        Next
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0 && !pending" style="text-align: center; padding: 40px; color: #666;">
      <p>No comments found.</p>
    </div>

    <!-- Image Modal -->
    <div v-if="showImageModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; justify-content: center; align-items: center;">
      <div style="background: white; padding: 20px; border-radius: 8px; max-width: 80%; max-height: 80%; overflow: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0;">Images ({{ currentImages.length }})</h3>
          <button @click="closeImageModal" style="background: #f44336; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
            Close
          </button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <img 
            v-for="(url, index) in currentImages" 
            :key="index" 
            :src="url" 
            :alt="`Image ${index + 1}`"
            style="width: 100%; height: auto; border-radius: 4px;"
            @error="handleImageError"
          />
        </div>
      </div>
    </div>

    <!-- Video Modal -->
    <div v-if="showVideoModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; justify-content: center; align-items: center;">
      <div style="background: white; padding: 20px; border-radius: 8px; max-width: 80%; max-height: 80%;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0;">Video</h3>
          <button @click="closeVideoModal" style="background: #f44336; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
            Close
          </button>
        </div>
        <video 
          :src="currentVideoUrl" 
          controls 
          style="width: 100%; max-height: 60vh;"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Comment } from '~/types';
import { formatDate, formatNumber, truncateText } from '~/utils/global';

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
</script> 