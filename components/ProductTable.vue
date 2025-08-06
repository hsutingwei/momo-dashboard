<template>
  <div>
    <!-- Products Table -->
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
              @click="$emit('sort', 'name')" 
              style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; cursor: pointer; font-weight: 600; color: #495057;"
            >
              Name
              <span v-if="currentSortBy === 'name'" style="margin-left: 5px;">
                {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              @click="$emit('sort', 'price')" 
              style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; cursor: pointer; font-weight: 600; color: #495057;"
            >
              Price
              <span v-if="currentSortBy === 'price'" style="margin-left: 5px;">
                {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              @click="$emit('sort', 'keyword')" 
              style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; cursor: pointer; font-weight: 600; color: #495057;"
            >
              Keyword
              <span v-if="currentSortBy === 'keyword'" style="margin-left: 5px;">
                {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057;">
              Status
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
            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #495057;">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" style="border-bottom: 1px solid #f1f3f4;">
            <td style="padding: 12px; color: #333;">{{ item.id }}</td>
            <td style="padding: 12px; color: #333;">
              <div style="font-weight: 500;">{{ item.name }}</div>
              <div v-if="item.productLink" style="font-size: 0.8rem; color: #666;">
                <a :href="item.productLink" target="_blank" style="color: #2196f3; text-decoration: none;">
                  View Product
                </a>
              </div>
            </td>
            <td style="padding: 12px; color: #333;">
              <span v-if="item.price" style="font-weight: 500; color: #2e7d32;">
                ${{ item.price.toFixed(2) }}
              </span>
              <span v-else style="color: #666;">-</span>
            </td>
            <td style="padding: 12px; color: #333;">
              <span v-if="item.keyword" style="background: #e3f2fd; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem;">
                {{ item.keyword }}
              </span>
              <span v-else style="color: #666;">-</span>
            </td>
            <td style="padding: 12px;">
              <span 
                :style="{
                  background: item.isComplete ? '#e8f5e8' : '#fff3e0',
                  color: item.isComplete ? '#2e7d32' : '#f57c00',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }"
              >
                {{ item.isComplete ? 'Complete' : 'Incomplete' }}
              </span>
            </td>
            <td style="padding: 12px; color: #666; font-size: 0.9rem;">
              {{ formatDate(item.createdAt) }}
            </td>
            <td style="padding: 12px;">
              <button 
                @click="viewDetails(item.id)"
                style="padding: 4px 8px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem; margin-right: 5px;"
              >
                View
              </button>
              <button 
                @click="editProduct(item.id)"
                style="padding: 4px 8px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;"
              >
                Edit
              </button>
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
      <p>No products found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Product {
  id: number;
  name: string;
  price: number;
  productLink: string;
  keyword: string;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  items: Product[];
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
  viewDetails: [id: number];
  editProduct: [id: number];
}>();

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

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 查看詳情
const viewDetails = (id: number) => {
  emit('viewDetails', id);
};

// 編輯產品
const editProduct = (id: number) => {
  emit('editProduct', id);
};
</script> 