<template>
  <Card>
    <div class="p-6">
      <h3 class="text-lg font-semibold mb-4">Filters & Controls</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Search</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="localSearchQuery"
              placeholder="Search products, comments..."
              class="pl-10"
            />
          </div>
        </div>

        <!-- Product Selector -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Product</label>
          <select 
            v-model="localSelectedProduct"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">All products</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }}
            </option>
          </select>
        </div>

        <!-- Date Range -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Date Range</label>
          <select 
            v-model="localDateRange"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
        </div>

        <!-- Reset Button -->
        <div class="space-y-2">
          <label class="text-sm font-medium invisible">Reset</label>
          <Button variant="outline" @click="handleReset" class="w-full">
            <RotateCcw class="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Search, RotateCcw } from 'lucide-vue-next';
import { ref, watch } from 'vue';

interface Product {
  id: string;
  name: string;
}

interface Props {
  searchQuery: string;
  selectedProduct: string;
  dateRange: string;
  products: Product[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:searchQuery': [value: string];
  'update:selectedProduct': [value: string];
  'update:dateRange': [value: string];
  reset: [];
}>();

const localSearchQuery = ref(props.searchQuery);
const localSelectedProduct = ref(props.selectedProduct);
const localDateRange = ref(props.dateRange);

watch(localSearchQuery, (newValue) => {
  emit('update:searchQuery', newValue);
});

watch(localSelectedProduct, (newValue) => {
  emit('update:selectedProduct', newValue);
});

watch(localDateRange, (newValue) => {
  emit('update:dateRange', newValue);
});

const handleReset = () => {
  localSearchQuery.value = '';
  localSelectedProduct.value = 'all';
  localDateRange.value = '30days';
  emit('reset');
};
</script> 