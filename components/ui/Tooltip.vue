<template>
  <div class="relative inline-block" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
    <slot />
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
        class="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap"
        :class="positionClasses"
        :style="tooltipStyle"
      >
        {{ content }}
        <div
          class="absolute w-2 h-2 bg-gray-900 transform rotate-45"
          :class="arrowClasses"
        ></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  delay: 0
})

const showTooltip = ref(false)
const tooltipRef = ref<HTMLElement>()

const positionClasses = computed(() => {
  switch (props.position) {
    case 'top':
      return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
    case 'bottom':
      return 'top-full left-1/2 transform -translate-x-1/2 mt-2'
    case 'left':
      return 'right-full top-1/2 transform -translate-y-1/2 mr-2'
    case 'right':
      return 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    default:
      return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
  }
})

const arrowClasses = computed(() => {
  switch (props.position) {
    case 'top':
      return 'top-full left-1/2 transform -translate-x-1/2 -mt-1'
    case 'bottom':
      return 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1'
    case 'left':
      return 'left-full top-1/2 transform -translate-y-1/2 -ml-1'
    case 'right':
      return 'right-full top-1/2 transform -translate-y-1/2 -mr-1'
    default:
      return 'top-full left-1/2 transform -translate-x-1/2 -mt-1'
  }
})

const tooltipStyle = computed(() => {
  if (props.delay > 0) {
    return {
      transitionDelay: `${props.delay}ms`
    }
  }
  return {}
})

// 防止 tooltip 超出視窗邊界
const adjustPosition = () => {
  if (!tooltipRef.value) return

  const tooltip = tooltipRef.value
  const rect = tooltip.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // 檢查右邊界
  if (rect.right > viewportWidth) {
    tooltip.style.left = 'auto'
    tooltip.style.right = '0'
  }

  // 檢查左邊界
  if (rect.left < 0) {
    tooltip.style.left = '0'
    tooltip.style.right = 'auto'
  }

  // 檢查下邊界
  if (rect.bottom > viewportHeight) {
    tooltip.style.top = 'auto'
    tooltip.style.bottom = '100%'
    tooltip.style.marginTop = '0'
    tooltip.style.marginBottom = '0.5rem'
  }

  // 檢查上邊界
  if (rect.top < 0) {
    tooltip.style.top = '100%'
    tooltip.style.bottom = 'auto'
    tooltip.style.marginTop = '0.5rem'
    tooltip.style.marginBottom = '0'
  }
}

onMounted(() => {
  if (showTooltip.value) {
    adjustPosition()
  }
})

onUnmounted(() => {
  showTooltip.value = false
})
</script>
