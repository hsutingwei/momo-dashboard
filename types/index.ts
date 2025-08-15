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
  comment_id: string;
  product_id: number;
  comment_text: string;
  customer_name: string;
  comment_date: string;
  goods_type: string;
  image_urls: string[];
  like_count: number;
  reply_content: string;
  reply_date: string;
  score: number;
  video_url: string;
  capture_time: string;
  created_at: string;
}

// 評論列表回應介面
export interface CommentsResponse {
  items: Comment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 評論篩選條件介面
export interface CommentsFilters {
  productId?: string;
  commentText?: string;
  captureTime?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
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

// 關鍵字批次分析介面
export interface KeywordRun {
  keyword: string;
  aligned_index: number;
  run_index_from_start: number;
  run_ts: string;
  run_ts_label: string;
  comment_count: number;
  total_runs: number;
  max_runs: number;
}

// 產品批次分析介面
export interface ProductRun {
  product_id: number;
  run_ts: string;
  run_ts_label: string;
  comment_count: number;
  run_index_from_start: number;
  total_runs: number;
}

// 銷售變化分析介面
export interface SalesChange {
  keyword?: string;
  product_id?: number;
  total_change_events?: number;
  changed_products_count?: number;
  change_times?: number;
}

// 批次變化數據介面
export interface BatchChangeData {
  keyword: string;
  batch_capture_time: string; // ISO datetime
  total_products_in_batch: number;
  changed_products_count: number;
  total_change_events: number;
  batch_index: number;        // 第 n 次
} 