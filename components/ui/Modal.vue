<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="handleBackdropClick"
        ></div>
        
        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div 
            :class="[
              'relative bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden',
              props.class || 'max-w-4xl'
            ]"
            @click.stop
          >
            <!-- Header -->
            <div v-if="$slots.header || title" class="flex items-center justify-between p-6 border-b border-gray-200">
              <slot name="header">
                <h3 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h3>
              </slot>
              <button 
                @click="$emit('update:modelValue', false)"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <!-- Content -->
            <div class="overflow-y-auto max-h-[calc(90vh-120px)]">
              <slot></slot>
            </div>
            
            <!-- Footer -->
            <div v-if="$slots.footer" class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

interface Props {
  modelValue: boolean;
  title?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  closeOnBackdrop: true,
  closeOnEscape: true
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

// Handle ESC key
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape) {
    emit('update:modelValue', false);
  }
};

// Handle backdrop click
const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('update:modelValue', false);
  }
};

// Add/remove event listeners
onMounted(() => {
  if (props.closeOnEscape) {
    document.addEventListener('keydown', handleKeydown);
  }
});

onUnmounted(() => {
  if (props.closeOnEscape) {
    document.removeEventListener('keydown', handleKeydown);
  }
});
</script> 