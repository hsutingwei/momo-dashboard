<template>
  <div class="border-b bg-card">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">Sales & Comment Analytics Dashboard</h1>
          <p class="text-muted-foreground">
            Analyze product performance and customer feedback trends
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" @click="$emit('toggleFilters')">
            <Filter class="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm" @click="$emit('export')">
            <Download class="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Filter, Download } from 'lucide-vue-next';

defineEmits<{
  toggleFilters: [];
  export: [];
}>();
</script> 