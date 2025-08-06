<template>
  <Card>
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Product List ({{ filteredProducts.length }} items)</h3>
        <div class="flex items-center gap-2">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="localSearch"
              placeholder="Search products..."
              class="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="sm" @click="handleExportCSV">
            <Download class="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Keywords</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Product Link</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="product in filteredProducts"
              :key="product.id"
              class="cursor-pointer hover:bg-muted/50"
            >
              <TableCell class="font-mono">{{ product.id }}</TableCell>
              <TableCell>{{ product.name }}</TableCell>
              <TableCell>
                <div class="flex flex-wrap gap-1">
                  <Badge
                    v-for="keyword in product.keywords"
                    :key="keyword"
                    variant="secondary"
                    class="text-xs"
                  >
                    {{ keyword }}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>${{ product.price || 'N/A' }}</TableCell>
              <TableCell>
                <a
                  v-if="product.productLink"
                  :href="product.productLink"
                  target="_blank"
                  class="text-blue-600 hover:underline text-sm"
                >
                  View Product
                </a>
                <span v-else class="text-muted-foreground text-sm">N/A</span>
              </TableCell>
              <TableCell>
                <Badge :variant="product.isComplete ? 'default' : 'secondary'">
                  {{ product.isComplete ? "Complete" : "Incomplete" }}
                </Badge>
              </TableCell>
              <TableCell>{{ formatDate(product.createdAt) }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search, Download } from 'lucide-vue-next';

interface Product {
  id: number;
  name: string;
  keyword: string;
  price: number | null;
  productLink: string | null;
  isComplete: boolean;
  createdAt: string;
}

interface Props {
  searchQuery: string;
  selectedProduct: string;
}

const props = defineProps<Props>();

const products = ref<Product[]>([]);
const localSearch = ref('');
const loading = ref(false);

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesGlobalSearch = !props.searchQuery ||
      product.name.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
      (product.keyword && product.keyword.toLowerCase().includes(props.searchQuery.toLowerCase()));

    const matchesLocalSearch = !localSearch.value ||
      product.name.toLowerCase().includes(localSearch.value.toLowerCase()) ||
      (product.keyword && product.keyword.toLowerCase().includes(localSearch.value.toLowerCase()));

    const matchesProductFilter = props.selectedProduct === 'all' || product.id.toString() === props.selectedProduct;

    return matchesGlobalSearch && matchesLocalSearch && matchesProductFilter;
  }).map(product => ({
    ...product,
    keywords: product.keyword ? product.keyword.split(', ').filter(k => k.trim() !== '') : []
  }));
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const handleExportCSV = () => {
  const headers = ['ID', 'Name', 'Keywords', 'Price', 'Product Link', 'Complete', 'Created At'];
  const csvContent = [
    headers.join(','),
    ...filteredProducts.value.map(product => [
      product.id,
      `"${product.name}"`,
      `"${product.keyword || ''}"`,
      product.price || '',
      `"${product.productLink || ''}"`,
      product.isComplete,
      new Date(product.createdAt).toLocaleDateString()
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.csv';
  a.click();
};

const loadProducts = async () => {
  loading.value = true;
  try {
    const { products: fetchedProducts } = await $fetch('/api/products/index');
    products.value = fetchedProducts || [];
  } catch (error) {
    console.error('Failed to load products:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProducts();
});
</script> 