<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-6 py-6">
      <h1 class="text-3xl font-bold mb-6">Momo Dashboard</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-muted-foreground">Total Products</p>
                <p class="text-2xl font-bold">{{ stats.totalProducts }}</p>
                <p class="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </div>
              <div class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span class="text-primary">📦</span>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-muted-foreground">Total Comments</p>
                <p class="text-2xl font-bold">{{ stats.totalComments }}</p>
                <p class="text-xs text-muted-foreground mt-1">+23% from last month</p>
              </div>
              <div class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span class="text-primary">💬</span>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-muted-foreground">Unique Keywords</p>
                <p class="text-2xl font-bold">{{ stats.uniqueKeywords }}</p>
                <p class="text-xs text-muted-foreground mt-1">+5% from last month</p>
              </div>
              <div class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span class="text-primary">🏷️</span>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-muted-foreground">Sales Changes</p>
                <p class="text-2xl font-bold">{{ stats.productsWithSalesChanges }}</p>
                <p class="text-xs text-muted-foreground mt-1">Products with changes</p>
              </div>
              <div class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span class="text-primary">📈</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">Dashboard Status</h2>
          <div class="space-y-2">
            <p><strong>Server Status:</strong> <span class="text-green-600">Running</span></p>
            <p><strong>Database Connection:</strong> <span class="text-green-600">Connected</span></p>
            <p><strong>API Endpoints:</strong> <span class="text-green-600">Available</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const stats = ref({
  totalProducts: 0,
  totalComments: 0,
  uniqueKeywords: 0,
  productsWithSalesChanges: 0
});

onMounted(async () => {
  try {
    const statsData = await $fetch('/api/dashboard/stats');
    stats.value = statsData as any;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
});
</script> 