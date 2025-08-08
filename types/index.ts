// 全域產品介面
export interface Product {
  id: number;
  name: string;
  price: number;
  product_link: string;
  keyword: string;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

// 產品列表回應介面
export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 產品篩選條件介面
export interface ProductsFilters {
  productId?: string;
  name?: string;
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// 評論介面
export interface Comment {
  id: string;
  product_id: number;
  content: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

// 銷售快照介面
export interface SalesSnapshot {
  id: number;
  product_id: number;
  sales_count: number;
  created_at: string;
}

// 儀表板統計介面
export interface DashboardStats {
  totalProducts: number;
  totalComments: number;
  uniqueKeywords: number;
  productsWithSalesChanges: number;
} 