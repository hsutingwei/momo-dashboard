<template>
  <Card 
    class="cursor-pointer hover:shadow-md transition-shadow" 
    :class="className"
    @click="$emit('click')"
  >
    <div class="p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-muted-foreground">{{ title }}</p>
          <p class="text-2xl font-bold">{{ formatValue(value) }}</p>
          <p v-if="subtitle" class="text-xs text-muted-foreground mt-1">
            {{ subtitle }}
          </p>
        </div>
        <div class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <component :is="icon" class="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Component } from 'vue';

interface Props {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: Component;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  className: ''
});

const formatValue = (value: number | string) => {
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return value;
};

defineEmits<{
  click: [];
}>();
</script> 