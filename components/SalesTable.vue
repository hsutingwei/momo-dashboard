<template>
  <Card>
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Sales Snapshots ({{ filteredSales.length }} items)</h3>
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
              <TableHead>Product</TableHead>
              <TableHead>Sales Count</TableHead>
              <TableHead>Sales Unit</TableHead>
              <TableHead>Capture Time</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="sale in filteredSales"
              :key="sale.id"
              class="cursor-pointer hover:bg-muted/50"
            >
              <TableCell>
                <div>
                  <div class="font-medium">{{ sale.productName || 'Unknown Product' }}</div>
                  <div class="text-xs text-muted-foreground">ID: {{ sale.productId }}</div>
                </div>
              </TableCell>
              <TableCell>
                <span class="font-medium">{{ sale.salesCount || 'N/A' }}</span>
              </TableCell>
              <TableCell>
                <span class="text-sm">{{ sale.salesUnit || 'N/A' }}</span>
              </TableCell>
              <TableCell>{{ formatDateTime(sale.captureTime) }}</TableCell>
              <TableCell>{{ formatDate(sale.createdAt) }}</TableCell>
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

interface SalesSnapshot {
  id: number;
  productId: number;
  salesCount: number | null;
  salesUnit: string | null;
  captureTime: string;
  createdAt: string;
  productName: string | null;
  productKeyword: string | null;
}

interface Props {
  searchQuery: string;
  selectedProduct: string;
}

const props = defineProps<Props>();

const sales = ref<SalesSnapshot[]>([]);
const localSearch = ref('');
const loading = ref(false);

const filteredSales = computed(() => {
  return sales.value.filter(sale => {
    const matchesGlobalSearch = !props.searchQuery ||
      (sale.productName && sale.productName.toLowerCase().includes(props.searchQuery.toLowerCase())) ||
      (sale.productKeyword && sale.productKeyword.toLowerCase().includes(props.searchQuery.toLowerCase()));

    const matchesLocalSearch = !localSearch.value ||
      (sale.productName && sale.productName.toLowerCase().includes(localSearch.value.toLowerCase())) ||
      (sale.productKeyword && sale.productKeyword.toLowerCase().includes(localSearch.value.toLowerCase()));

    const matchesProductFilter = props.selectedProduct === 'all' || sale.productId.toString() === props.selectedProduct;

    return matchesGlobalSearch && matchesLocalSearch && matchesProductFilter;
  });
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const handleExportCSV = () => {
  const headers = ['ID', 'Product ID', 'Product Name', 'Sales Count', 'Sales Unit', 'Capture Time', 'Created At'];
  const csvContent = [
    headers.join(','),
    ...filteredSales.value.map(sale => [
      sale.id,
      sale.productId,
      `"${sale.productName || ''}"`,
      sale.salesCount || '',
      `"${sale.salesUnit || ''}"`,
      new Date(sale.captureTime).toLocaleString(),
      new Date(sale.createdAt).toLocaleDateString()
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sales_snapshots.csv';
  a.click();
};

const loadSales = async () => {
  loading.value = true;
  try {
    const { sales: fetchedSales } = await $fetch('/api/sales/index');
    sales.value = fetchedSales || [];
  } catch (error) {
    console.error('Failed to load sales data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadSales();
});
</script> 