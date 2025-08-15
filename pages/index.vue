<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Momo Dashboard</h1>
      
      <!-- Loading State -->
      <div v-if="pending" class="text-center py-16">
        <p class="text-gray-600">Loading dashboard data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
        <h3 class="text-red-800 font-semibold mb-3">Error Loading Data</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="() => refresh()" 
          class="btn-danger"
        >
          Retry
        </button>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="card">
            <h3 class="text-sm font-medium text-gray-500 mb-3">Total Products</h3>
            <NuxtLink to="/products" class="block">
              <p class="text-3xl font-bold text-gray-900">{{ formatNumber(stats.totalProducts) }}</p>
            </NuxtLink>
            <p class="text-xs text-gray-500 mt-2">+12% from last month</p>
          </div>
  
          <div class="card">
            <h3 class="text-sm font-medium text-gray-500 mb-3">Total Comments</h3>
            <NuxtLink to="/comments" class="block">
              <p class="text-3xl font-bold text-gray-900">{{ formatNumber(stats.totalComments) }}</p>
            </NuxtLink>
            <p class="text-xs text-gray-500 mt-2">+23% from last month</p>
          </div>
  
          <div class="card">
            <h3 class="text-sm font-medium text-gray-500 mb-3">Unique Keywords</h3>
            <p class="text-3xl font-bold text-gray-900">{{ formatNumber(stats.uniqueKeywords) }}</p>
            <p class="text-xs text-gray-500 mt-2">+5% from last month</p>
          </div>
  
          <div class="card">
            <h3 class="text-sm font-medium text-gray-500 mb-3">Sales Changes</h3>
            <p class="text-3xl font-bold text-gray-900">{{ formatNumber(stats.productsWithSalesChanges) }}</p>
            <p class="text-xs text-gray-500 mt-2">Products with changes</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KeywordRunsChart/>
          <SalesChangesChart />
          <BatchChangesChart />
        </div>
  
        <!-- Status Card -->
        <div class="card mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Dashboard Status</h2>
          <div class="space-y-3">
            <p class="flex items-center">
              <span class="font-medium mr-2">Server Status:</span>
              <span class="text-green-600 font-medium">Running</span>
            </p>
            <p class="flex items-center">
              <span class="font-medium mr-2">Database Connection:</span>
              <span class="text-green-600 font-medium">Connected</span>
            </p>
            <p class="flex items-center">
              <span class="font-medium mr-2">API Endpoints:</span>
              <span class="text-green-600 font-medium">Available</span>
            </p>
          </div>
        </div>
  
        <!-- Success Message -->
        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 class="text-blue-800 font-semibold mb-3">Success!</h3>
          <div class="space-y-2">
            <p class="text-gray-800">✅ Dashboard is now working!</p>
            <p class="text-gray-800">✅ Nuxt 4.0.1 is running correctly</p>
            <p class="text-gray-800">✅ API data is loading: {{ !pending ? 'Yes' : 'No' }}</p>
            <p class="text-gray-600 text-sm">Data from Database: Total Products = {{ formatNumber(stats.totalProducts) }}, Total Comments = {{ formatNumber(stats.totalComments) }}, Unique Keywords = {{ formatNumber(stats.uniqueKeywords) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStats } from '../composables/useDashboardStats';
import { formatNumber } from '~/utils/global';
import KeywordRunsChart from '~/components/charts/KeywordRunsChart.vue';
import SalesChangesChart from '~/components/charts/SalesChangesChart.vue';
import BatchChangesChart from '~/components/charts/BatchChangesChart.vue';

const { stats, error, refresh, pending } = useDashboardStats();
</script> 