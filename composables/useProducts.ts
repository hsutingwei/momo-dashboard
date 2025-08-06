import { ref, computed } from 'vue';

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

interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ProductsFilters {
  productId?: string;
  name?: string;
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export function useProducts() {
  const products = ref<Product[]>([]);
  const total = ref(0);
  const currentPage = ref(1);
  const totalPages = ref(0);
  const limit = ref(20);
  const error = ref<string | null>(null);
  const pending = ref(false);

  // 篩選條件
  const filters = ref<ProductsFilters>({
    sortBy: 'id',
    sortOrder: 'asc',
    page: 1,
    limit: 20
  });

  // 構建查詢字串
  const buildQueryString = (filters: ProductsFilters) => {
    const params = new URLSearchParams();
    
    if (filters.productId) params.append('product_id', filters.productId);
    if (filters.name) params.append('name', filters.name);
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    return params.toString();
  };

  // 獲取產品列表
  const fetchProducts = async (newFilters?: Partial<ProductsFilters>) => {
    if (newFilters) {
      filters.value = { ...filters.value, ...newFilters };
    }

    pending.value = true;
    error.value = null;

    try {
      const queryString = buildQueryString(filters.value);
      const response = await fetch(`/api/products?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ProductsResponse = await response.json();
      
      products.value = data.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        productLink: item.productLink,
        keyword: item.keyword,
        isComplete: item.isComplete,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
      
      total.value = data.total;
      currentPage.value = data.page;
      totalPages.value = data.totalPages;
      limit.value = data.limit;
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to fetch products:', err);
    } finally {
      pending.value = false;
    }
  };

  // 更新篩選條件
  const updateFilters = (newFilters: Partial<ProductsFilters>) => {
    filters.value = { ...filters.value, ...newFilters };
    fetchProducts();
  };

  // 排序
  const sortBy = (field: string) => {
    const currentSortBy = filters.value.sortBy;
    const currentSortOrder = filters.value.sortOrder;
    
    if (currentSortBy === field) {
      // 切換排序方向
      filters.value.sortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // 新的排序欄位，預設升序
      filters.value.sortBy = field;
      filters.value.sortOrder = 'asc';
    }
    
    fetchProducts();
  };

  // 分頁
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      filters.value.page = page;
      fetchProducts();
    }
  };

  // 搜尋
  const search = (searchFilters: { name?: string; keyword?: string; productId?: string }) => {
    filters.value = { 
      ...filters.value, 
      ...searchFilters, 
      page: 1 // 重置到第一頁
    };
    fetchProducts();
  };

  // 清除篩選
  const clearFilters = () => {
    filters.value = {
      sortBy: 'id',
      sortOrder: 'asc',
      page: 1,
      limit: 20
    };
    fetchProducts();
  };

  return {
    // 數據
    products,
    total,
    currentPage,
    totalPages,
    limit,
    error,
    pending,
    filters,
    
    // 方法
    fetchProducts,
    updateFilters,
    sortBy,
    goToPage,
    search,
    clearFilters
  };
} 