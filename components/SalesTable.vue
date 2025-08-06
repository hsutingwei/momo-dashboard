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
              placeholder="Search by product ID..."
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
              <TableHead>Product ID</TableHead>
              <TableHead>Current Sales</TableHead>
              <TableHead>Previous Sales</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Trend</TableHead>
              <TableHead>Capture Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow 
              v-for="sale in filteredSales" 
              :key="sale.product_id" 
              class="cursor-pointer hover:bg-muted/50"
            >
              <TableCell class="font-mono">{{ sale.product_id }}</TableCell>
              <TableCell>
                <span>{{ sale.sales_count.toLocaleString() }}</span>
              </TableCell>
              <TableCell class="text-muted-foreground">
                {{ sale.previous_count.toLocaleString() }}
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <TrendingUp v-if="sale.change_percent > 0" class="h-4 w-4 text-green-600" />
                  <TrendingDown v-else-if="sale.change_percent < 0" class="h-4 w-4 text-red-600" />
                  <Minus v-else class="h-4 w-4 text-gray-600" />
                  <span :class="
                    sale.change_percent > 0 ? 'text-green-600' :
                    sale.change_percent < 0 ? 'text-red-600' : 'text-gray-600'
                  ">
                    {{ sale.change_percent > 0 ? '+' : '' }}{{ sale.change_percent.toFixed(1) }}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge :class="getTrendBadgeClass(sale.change_percent)">
                  {{ getTrendLabel(sale.change_percent) }}
                </Badge>
              </TableCell>
              <TableCell>
                {{ formatDate(sale.capture_time) }}
                <div class="text-xs text-muted-foreground">
                  {{ formatTime(sale.capture_time) }}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search, Download, TrendingUp, TrendingDown, Minus } from 'lucide-vue-next';

interface Sale {
  product_id: string;
  sales_count: number;
  capture_time: string;
  previous_count: number;
  change_percent: number;
}

interface Props {
  searchQuery: string;
  selectedProduct: string;
}

const props = defineProps<Props>();

const sales = ref<Sale[]>([]);
const localSearch = ref('');
const loading = ref(false);

const filteredSales = computed(() => {
  return sales.value.filter(sale => {
    const matchesGlobalSearch = !props.searchQuery || 
      sale.product_id.toLowerCase().includes(props.searchQuery.toLowerCase());
    
    const matchesLocalSearch = !localSearch.value ||
      sale.product_id.toLowerCase().includes(localSearch.value.toLowerCase());
    
    const matchesProductFilter = props.selectedProduct === 'all' || sale.product_id === props.selectedProduct;
    
    return matchesGlobalSearch && matchesLocalSearch && matchesProductFilter;
  });
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString();
};

const getTrendLabel = (changePercent: number) => {
  if (changePercent > 5) return 'Strong Growth';
  if (changePercent > 0) return 'Growth';
  if (changePercent === 0) return 'Stable';
  if (changePercent > -5) return 'Decline';
  return 'Strong Decline';
};

const getTrendBadgeClass = (changePercent: number) => {
  if (changePercent > 5) return 'bg-green-100 text-green-800';
  if (changePercent > 0) return 'bg-blue-100 text-blue-800';
  if (changePercent === 0) return 'bg-gray-100 text-gray-800';
  if (changePercent > -5) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

const handleExportCSV = () => {
  const headers = ['Product ID', 'Sales Count', 'Capture Time', 'Previous Count', 'Change %'];
  const csvContent = [
    headers.join(','),
    ...filteredSales.value.map(sale => [
      sale.product_id,
      sale.sales_count,
      new Date(sale.capture_time).toISOString(),
      sale.previous_count,
      sale.change_percent
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
    const { data } = await $fetch('/api/sales/index');
    sales.value = data.sales || [];
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