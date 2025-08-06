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
              <TableCell>${{ product.price }}</TableCell>
              <TableCell>
                <Badge :variant="product.is_complete ? 'default' : 'secondary'">
                  {{ product.is_complete ? "Complete" : "Incomplete" }}
                </Badge>
              </TableCell>
              <TableCell>{{ formatDate(product.created_at) }}</TableCell>
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
  id: string;
  name: string;
  keyword: string;
  price: number;
  is_complete: boolean;
  created_at: string;
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
      product.keyword.toLowerCase().includes(props.searchQuery.toLowerCase());
    
    const matchesLocalSearch = !localSearch.value ||
      product.name.toLowerCase().includes(localSearch.value.toLowerCase()) ||
      product.keyword.toLowerCase().includes(localSearch.value.toLowerCase());
    
    const matchesProductFilter = props.selectedProduct === 'all' || product.id === props.selectedProduct;
    
    return matchesGlobalSearch && matchesLocalSearch && matchesProductFilter;
  });
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const handleExportCSV = () => {
  const headers = ['ID', 'Name', 'Keywords', 'Price', 'Complete', 'Created At'];
  const csvContent = [
    headers.join(','),
    ...filteredProducts.value.map(product => [
      product.id,
      `"${product.name}"`,
      `"${product.keyword}"`,
      product.price,
      product.is_complete,
      new Date(product.created_at).toLocaleDateString()
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
    const { data } = await $fetch('/api/products/index');
    products.value = data.products || [];
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