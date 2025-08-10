<template>
  <div>
    <!-- Products Table -->
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
                @click="$emit('sort', 'name')" 
                class="table-header"
              >
                Name
                <span v-if="currentSortBy === 'name'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="$emit('sort', 'price')" 
                class="table-header"
              >
                Price
                <span v-if="currentSortBy === 'price'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="$emit('sort', 'keyword')" 
                class="table-header"
              >
                Keyword
                <span v-if="currentSortBy === 'keyword'" class="ml-1">
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
              <th 
                @click="$emit('sort', 'updated_at')" 
                class="table-header"
              >
                Updated At
                <span v-if="currentSortBy === 'updated_at'" class="ml-1">
                  {{ currentSortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th class="table-header cursor-default">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="table-cell">{{ item.id }}</td>
              <td class="table-cell">
                <div class="font-medium">{{ item.name }}</div>
                <div v-if="item.product_link" class="text-sm text-gray-500">
                  <a :href="item.product_link" target="_blank" class="text-primary-600 hover:text-primary-800 underline">
                    View Product
                  </a>
                </div>
              </td>
              <td class="table-cell">
                <span v-if="item.price" class="font-medium text-green-700">
                  {{ formatPrice(item.price) }}
                </span>
                <span v-else class="text-gray-500">-</span>
              </td>
              <td class="table-cell">
                <span v-if="item.keyword" class="badge badge-primary">
                  {{ item.keyword }}
                </span>
                <span v-else class="text-gray-500">-</span>
              </td>
              <td class="table-cell text-gray-600 text-sm">
                {{ formatDate(item.created_at) }}
              </td>
              <td class="table-cell text-gray-600 text-sm">
                {{ formatDate(item.updated_at) }}
              </td>
              <td class="table-cell">
                <button 
                  @click="viewDetails(item.id)"
                  class="px-2 py-1 bg-primary-600 text-white border-none rounded text-xs hover:bg-primary-700 transition-colors mr-2"
                >
                  View
                </button>
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
      <p>No products found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '~/types';
import { formatDate, formatPrice } from '~/utils/global';

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

// 查看詳情
const viewDetails = (id: number) => {
  emit('viewDetails', id);
};

// 編輯產品
const editProduct = (id: number) => {
  emit('editProduct', id);
};
</script> 