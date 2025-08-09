import { ref, computed } from 'vue';
import type { Comment, CommentsResponse, CommentsFilters } from '~/types';

export function useComments() {
  const comments = ref<Comment[]>([]);
  const total = ref(0);
  const currentPage = ref(1);
  const totalPages = ref(0);
  const limit = ref(10);
  const error = ref<string | null>(null);
  const pending = ref(false);

  // 篩選條件
  const filters = ref<CommentsFilters>({
    sortBy: 'id',
    sortOrder: 'asc',
    page: 1,
    limit: 10
  });

  // 構建查詢字串
  const buildQueryString = (filters: CommentsFilters) => {
    const params = new URLSearchParams();
    
    if (filters.productId) params.append('product_id', filters.productId);
    if (filters.commentText) params.append('comment_text', filters.commentText);
    if (filters.captureTime) params.append('capture_time', filters.captureTime);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    return params.toString();
  };

  // 獲取評論列表
  const fetchComments = async (newFilters?: Partial<CommentsFilters>) => {
    if (newFilters) {
      filters.value = { ...filters.value, ...newFilters };
    }

    pending.value = true;
    error.value = null;

    try {
      const queryString = buildQueryString(filters.value);
      const response = await fetch(`/api/comments?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CommentsResponse = await response.json();
      
      comments.value = data.items.map(item => ({
        id: item.id,
        comment_id: item.comment_id,
        product_id: item.product_id,
        comment_text: item.comment_text,
        customer_name: item.customer_name,
        comment_date: item.comment_date,
        goods_type: item.goods_type,
        image_urls: item.image_urls,
        like_count: item.like_count,
        reply_content: item.reply_content,
        reply_date: item.reply_date,
        score: item.score,
        video_url: item.video_url,
        capture_time: item.capture_time,
        created_at: item.created_at
      }));
      
      total.value = data.total;
      currentPage.value = data.page;
      totalPages.value = data.totalPages;
      limit.value = data.limit;
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to fetch comments:', err);
    } finally {
      pending.value = false;
    }
  };

  // 更新篩選條件
  const updateFilters = (newFilters: Partial<CommentsFilters>) => {
    filters.value = { ...filters.value, ...newFilters };
    fetchComments();
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
    
    fetchComments();
  };

  // 分頁
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      filters.value.page = page;
      fetchComments();
    }
  };

  // 搜尋
  const search = (searchFilters: { productId?: string; commentText?: string; captureTime?: string }) => {
    filters.value = { 
      ...filters.value, 
      ...searchFilters, 
      page: 1 // 重置到第一頁
    };
    fetchComments();
  };

  // 清除篩選
  const clearFilters = () => {
    filters.value = {
      sortBy: 'id',
      sortOrder: 'asc',
      page: 1,
      limit: 10
    };
    fetchComments();
  };

  return {
    // 數據
    comments,
    total,
    currentPage,
    totalPages,
    limit,
    error,
    pending,
    filters,
    
    // 方法
    fetchComments,
    updateFilters,
    sortBy,
    goToPage,
    search,
    clearFilters
  };
} 