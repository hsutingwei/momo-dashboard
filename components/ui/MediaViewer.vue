<template>
  <div>
    <!-- Thumbnails Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <!-- Images -->
      <div v-if="images && images.length > 0">
        <div 
          v-for="(image, index) in images" 
          :key="`image-${index}`"
          @click="openImageViewer(image, index)"
          class="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img 
            :src="image" 
            :alt="`Image ${index + 1}`"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>
      </div>
      
      <!-- Videos -->
      <div v-if="videos && videos.length > 0">
        <div 
          v-for="(video, index) in videos" 
          :key="`video-${index}`"
          @click="openVideoViewer(video, index)"
          class="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative"
        >
          <img 
            v-if="video.thumbnail" 
            :src="video.thumbnail" 
            :alt="`Video ${index + 1}`"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <!-- Play Button Overlay -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- No Media Message -->
      <div v-if="(!images || images.length === 0) && (!videos || videos.length === 0)" class="col-span-full text-center py-8 text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p>{{ noMediaMessage }}</p>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <Modal v-model="showImageModal" title="Image Viewer">
      <div class="p-6">
        <div class="relative">
          <img 
            :src="currentImage" 
            :alt="`Image ${currentImageIndex + 1}`"
            class="w-full h-auto max-h-[70vh] object-contain mx-auto rounded-lg"
            @error="handleImageError"
          />
          
          <!-- Navigation -->
          <div v-if="images && images.length > 1" class="absolute inset-0 flex items-center justify-between p-4">
            <button 
              @click="previousImage"
              class="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
              :disabled="currentImageIndex === 0"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button 
              @click="nextImage"
              class="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
              :disabled="currentImageIndex === images.length - 1"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Image Counter -->
        <div v-if="images && images.length > 1" class="text-center mt-4 text-gray-600">
          {{ currentImageIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </Modal>

    <!-- Video Viewer Modal -->
    <Modal v-model="showVideoModal" title="Video Player">
      <div class="p-6">
        <video 
          :src="currentVideo" 
          controls 
          class="w-full max-h-[70vh] rounded-lg"
          autoplay
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Modal from './Modal.vue';

interface VideoItem {
  url: string;
  thumbnail?: string;
}

interface Props {
  images?: string[];
  videos?: VideoItem[];
  noMediaMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  noMediaMessage: '無圖片或影片'
});

// Modal states
const showImageModal = ref(false);
const showVideoModal = ref(false);
const currentImage = ref('');
const currentVideo = ref('');
const currentImageIndex = ref(0);

// Open image viewer
const openImageViewer = (image: string, index: number) => {
  currentImage.value = image;
  currentImageIndex.value = index;
  showImageModal.value = true;
};

// Open video viewer
const openVideoViewer = (video: VideoItem, index: number) => {
  currentVideo.value = video.url;
  showVideoModal.value = true;
};

// Navigation functions
const previousImage = () => {
  if (props.images && currentImageIndex.value > 0) {
    currentImageIndex.value--;
    currentImage.value = props.images[currentImageIndex.value] || '';
  }
};

const nextImage = () => {
  if (props.images && currentImageIndex.value < props.images.length - 1) {
    currentImageIndex.value++;
    currentImage.value = props.images[currentImageIndex.value] || '';
  }
};

// Handle image error
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
};
</script> 