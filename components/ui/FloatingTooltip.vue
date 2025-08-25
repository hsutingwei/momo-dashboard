<template>
  <div>
    <div
      ref="triggerRef"
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
    >
      <slot />
    </div>
    
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="showTooltip"
          ref="tooltipRef"
          class="z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg max-w-xs"
          :style="floatingStyles"
        >
          <div class="break-words leading-relaxed whitespace-normal">{{ content }}</div>
          <div
            ref="arrowRef"
            class="absolute w-2 h-2 bg-gray-900 transform rotate-45"
            :style="arrowStyles"
          ></div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  useFloating,
  offset,
  flip,
  shift,
  arrow,
  autoUpdate,
  type Placement
} from '@floating-ui/vue'

interface Props {
  content: string
  placement?: Placement
  delay?: number
  maxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'top',
  delay: 0,
  maxWidth: '20rem'
})

const showTooltip = ref(false)
const triggerRef = ref<HTMLElement>()
const tooltipRef = ref<HTMLElement>()
const arrowRef = ref<HTMLElement>()

// Floating UI 配置
const { floatingStyles } = useFloating(triggerRef, tooltipRef, {
  placement: props.placement,
  middleware: [
    offset(8), // 與觸發元素的距離
    flip(), // 自動翻轉位置
    shift({ padding: 8 }), // 自動調整位置避免超出視窗
    arrow({ element: arrowRef }) // 箭頭
  ],
  whileElementsMounted: autoUpdate // 自動更新位置
})

// 箭頭樣式
const arrowStyles = computed(() => ({
  position: 'absolute' as const,
  width: '8px',
  height: '8px',
  background: '#111827',
  transform: 'rotate(45deg)'
}))

// 清理函數
onUnmounted(() => {
  showTooltip.value = false
})
</script>
