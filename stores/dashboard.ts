import { defineStore } from 'pinia';

interface DashboardStats {
  totalProducts: number;
  totalComments: number;
  uniqueKeywords: number;
  productsWithSalesChanges: number;
  topKeywords: Array<{ keyword: string; count: number }>;
}

interface FilterState {
  searchQuery: string;
  selectedProduct: string;
  sentimentFilter: string;
  dateRange: string;
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {
      totalProducts: 0,
      totalComments: 0,
      uniqueKeywords: 0,
      productsWithSalesChanges: 0,
      topKeywords: []
    } as DashboardStats,
    
    filters: {
      searchQuery: '',
      selectedProduct: 'all',
      sentimentFilter: 'all',
      dateRange: '30days'
    } as FilterState,
    
    loading: false,
    error: null as string | null
  }),

  getters: {
    hasActiveFilters: (state) => {
      return state.filters.searchQuery || 
             state.filters.selectedProduct !== 'all' || 
             state.filters.sentimentFilter !== 'all';
    }
  },

  actions: {
    async fetchStats() {
      this.loading = true;
      this.error = null;
      
      try {
        const { data } = await $fetch('/api/dashboard/stats');
        this.stats = data;
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        this.error = 'Failed to load dashboard statistics';
      } finally {
        this.loading = false;
      }
    },

    updateFilters(newFilters: Partial<FilterState>) {
      this.filters = { ...this.filters, ...newFilters };
    },

    resetFilters() {
      this.filters = {
        searchQuery: '',
        selectedProduct: 'all',
        sentimentFilter: 'all',
        dateRange: '30days'
      };
    },

    setError(error: string | null) {
      this.error = error;
    }
  }
}); 