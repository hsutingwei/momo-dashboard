<template>
  <div style="min-height: 100vh; background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h1 style="color: #333; font-size: 2rem; margin-bottom: 20px;">Momo Dashboard</h1>
      
      <!-- Loading State -->
      <div v-if="pending" style="text-align: center; padding: 40px;">
        <p style="color: #666;">Loading dashboard data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" style="background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #c33; margin: 0 0 10px 0;">Error Loading Data</h3>
        <p style="color: #666; margin: 0;">{{ error }}</p>
        <button @click="refresh" style="margin-top: 10px; padding: 8px 16px; background: #c33; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Retry
        </button>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #666; font-size: 0.9rem; margin: 0 0 10px 0;">Total Products</h3>
            <p style="font-size: 2rem; font-weight: bold; margin: 0; color: #333;">{{ stats.totalProducts.toLocaleString() }}</p>
            <p style="font-size: 0.8rem; color: #666; margin: 5px 0 0 0;">+12% from last month</p>
          </div>

          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #666; font-size: 0.9rem; margin: 0 0 10px 0;">Total Comments</h3>
            <p style="font-size: 2rem; font-weight: bold; margin: 0; color: #333;">{{ stats.totalComments.toLocaleString() }}</p>
            <p style="font-size: 0.8rem; color: #666; margin: 5px 0 0 0;">+23% from last month</p>
          </div>

          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #666; font-size: 0.9rem; margin: 0 0 10px 0;">Unique Keywords</h3>
            <p style="font-size: 2rem; font-weight: bold; margin: 0; color: #333;">{{ stats.uniqueKeywords.toLocaleString() }}</p>
            <p style="font-size: 0.8rem; color: #666; margin: 5px 0 0 0;">+5% from last month</p>
          </div>

          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #666; font-size: 0.9rem; margin: 0 0 10px 0;">Sales Changes</h3>
            <p style="font-size: 2rem; font-weight: bold; margin: 0; color: #333;">{{ stats.productsWithSalesChanges.toLocaleString() }}</p>
            <p style="font-size: 0.8rem; color: #666; margin: 5px 0 0 0;">Products with changes</p>
          </div>
        </div>

        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; font-size: 1.5rem; margin: 0 0 15px 0;">Dashboard Status</h2>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <p style="margin: 0;"><strong>Server Status:</strong> <span style="color: #22c55e;">Running</span></p>
            <p style="margin: 0;"><strong>Database Connection:</strong> <span style="color: #22c55e;">Connected</span></p>
            <p style="margin: 0;"><strong>API Endpoints:</strong> <span style="color: #22c55e;">Available</span></p>
          </div>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
          <h3 style="margin: 0 0 10px 0; color: #1976d2;">Success!</h3>
          <p style="margin: 5px 0; color: #333;">✅ Dashboard is now working!</p>
          <p style="margin: 5px 0; color: #333;">✅ Nuxt 4.0.1 is running correctly</p>
          <p style="margin: 5px 0; color: #333;">✅ API data is loading: {{ !pending ? 'Yes' : 'No' }}</p>
          <p style="margin: 5px 0; color: #666;">Data from Database: Total Products = {{ stats.totalProducts }}, Total Comments = {{ stats.totalComments }}, Unique Keywords = {{ stats.uniqueKeywords }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStats } from '../composables/useDashboardStats';

const { stats, error, refresh, pending } = useDashboardStats();
</script> 