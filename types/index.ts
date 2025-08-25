// 全域產品介面
export interface Product {
  id: number;
  name: string;
  price: number;
  product_link: string;
  keyword: string;
  is_complete: boolean;
  comment_count: number;
  sales_changed: string;
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

// 銷售下降商品項目介面
export interface SalesDropItem {
  product_id: number;
  product_name: string;
  keyword: string;
  product_link: string | null;
  batch_capture_time: string; // ISO
  original_capture_time: string; // ISO
  prev_sales: number | null;
  sales_count: number;
  delta: number;
}

// 銷售下降商品回應介面
export interface SalesDropResp {
  count: number;
  items: SalesDropItem[];
}

// 商品銷售變化點
export interface ProductSalesPoint {
  batch_capture_time: string; // ISO
  sales_count: number | null; // 若該批無快照，可為 null 或 0
}

// 商品銷售變化序列回應
export interface ProductSalesSeriesResp {
  product_id: number;
  product_name: string;
  keyword: string;
  points: ProductSalesPoint[];
}

// TF-IDF 詞彙
export interface TfidfTerm {
  term: string;
  score: number;
  docs?: number;
}

// 商品 TF-IDF 回應
export interface ProductTfidfResp {
  product_id: number;
  keyword: string;
  pipeline_version: string;
  terms: TfidfTerm[]; // Top 100
}

// TF-IDF Top 回應
export interface TfidfTopResp {
  scope: 'product' | 'global';
  product_id?: number;
  keyword?: string;
  pipeline_version: string | null;
  limit: number;
  terms: Array<{
    term: string;          // token
    total_tfidf: number;   // SUM(tfidf)
    doc_count: number;     // 出現於幾則留言
    total_tf: number;      // SUM(tf)
    idf_any: number;       // 任一/最大 idf（參考值）
  }>;
}

// Keywords 回應
export interface KeywordsResp {
  success: boolean;
  keywords: string[];
} 

// ML Experiment Dashboard Types
export interface ExperimentRun {
  code: string;
  run_id: string;
  algorithm: string;
  fs_method: string;
  cv_splits: number;
  metrics: {
    auc: number;
    accuracy: number;
    precision_1: number;
    recall_1: number;
    f1_1: number;
    precision_0: number;
    recall_0: number;
    f1_0: number;
  };
  mode_desc_short: string;
  mode_desc_long: string;
}

export interface ExperimentBatch {
  fa_batch_id: string;
  codes: ExperimentRun[];
}

export interface RunSummary {
  run_id: string;
  mode_desc_short: string;
  mode_desc_long: string;
  algorithm: string;
  fs_method: string;
  cv_splits: number;
  cutoff_date: string;
  hyperparams: Record<string, any>;
  metrics: {
    auc: number;
    accuracy: number;
    f1_macro: number;
    f1_weighted: number;
    precision_1: number;
    recall_1: number;
    f1_1: number;
    precision_0: number;
    recall_0: number;
    f1_0: number;
  };
}

export interface FoldMetrics {
  fold: number;
  auc: number;
  accuracy: number;
  precision_1: number;
  recall_1: number;
  f1_1: number;
}

export interface RunFolds {
  run_id: string;
  folds: FoldMetrics[];
  stats: {
    auc_mean: number;
    auc_std: number;
    f1_1_mean: number;
    f1_1_std: number;
  };
}

export interface FeatureAnalysisSummary {
  batch_id: string;
  data_overview: {
    total_samples: number;
    y1: number;
    y0: number;
    imbalance_ratio: string;
    dense_features: number;
    tfidf_features: number;
  };
  dense_feature_stats: Array<{
    feature_name: string;
    cohens_d: number;
    mutual_info: number;
    p_value: number;
    overlap_coefficient: number;
    is_significant: boolean;
    has_high_separation: boolean;
  }>;
}

export interface Visualization {
  viz_type: 'pca' | 'tsne' | 'umap';
  url: string;
  separation_score?: number;
  explained_var_1?: number;
  explained_var_2?: number;
  cumulative_var_2?: number;
}

export interface FeatureAnalysisVisualizations {
  batch_id: string;
  visualizations: Visualization[];
}

export interface AnalysisBatch {
  id: string;
  name: string;
  date: string;
  experiment_count: number;
  best_auc: number;
  best_precision: number;
} 