<template>
  <Modal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" :title="title" class="max-w-6xl">
    <div class="p-6">
      <slot />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/ui/Modal.vue';

interface Props {
  modelValue: boolean;
  title: string;
}

defineProps<Props>();
defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>
