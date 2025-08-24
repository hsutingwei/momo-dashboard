<template>
  <div class="w-full h-full">
    <canvas
      ref="canvasRef"
      :width="canvasWidth"
      :height="canvasHeight"
      class="w-full h-full"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    />
    
    <!-- Tooltip -->
    <div 
      v-if="tooltip.visible"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      class="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm z-50 pointer-events-none"
    >
      <div class="font-semibold mb-1">{{ tooltip.label }}</div>
      <div v-for="item in tooltip.data" :key="item.key" class="flex items-center gap-2">
        <div 
          class="w-3 h-3 rounded-sm" 
          :style="{ backgroundColor: item.color }"
        ></div>
        <span>{{ item.key }}: {{ item.value.toFixed(3) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'

interface DataPoint {
  name: string
  fullName: string
  AUC: number
  'Precision (y=1)': number
  'Recall (y=1)': number
  'F1-Score (y=1)': number
  id: string
}

interface Props {
  data: DataPoint[]
  margin?: { top: number; right: number; left: number; bottom: number }
}

const props = withDefaults(defineProps<Props>(), {
  margin: () => ({ top: 20, right: 30, left: 20, bottom: 60 })
})

const canvasRef = ref<HTMLCanvasElement>()
const canvasWidth = 800
const canvasHeight = 320
const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  label: '',
  data: [] as Array<{ key: string; value: number; color: string }>
})

const colors = {
  'AUC': 'hsl(41, 75%, 65%)',
  'Precision (y=1)': 'hsl(185, 40%, 60%)',
  'Recall (y=1)': 'hsl(227, 15%, 40%)',
  'F1-Score (y=1)': 'hsl(84, 65%, 83%)'
}

const drawChart = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  const { top, right, left, bottom } = props.margin
  const chartWidth = canvasWidth - left - right
  const chartHeight = canvasHeight - top - bottom

  // Calculate bar dimensions
  const barGroupWidth = chartWidth / props.data.length
  const barWidth = barGroupWidth / 4 * 0.8 // 4 metrics, with some spacing
  const barSpacing = barWidth * 0.25

  // Find max value for scaling
  const maxValue = Math.max(
    ...props.data.flatMap(d => [d.AUC, d['Precision (y=1)'], d['Recall (y=1)'], d['F1-Score (y=1)']])
  )

  // Draw grid lines
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = top + (chartHeight / 5) * i
    ctx.beginPath()
    ctx.moveTo(left, y)
    ctx.lineTo(left + chartWidth, y)
    ctx.stroke()
  }

  // Draw bars
  const metrics = ['AUC', 'Precision (y=1)', 'Recall (y=1)', 'F1-Score (y=1)'] as const
  
  props.data.forEach((dataPoint, dataIndex) => {
    const groupX = left + dataIndex * barGroupWidth

    metrics.forEach((metric, metricIndex) => {
      const value = dataPoint[metric]
      const barHeight = (value / maxValue) * chartHeight
      const barX = groupX + metricIndex * (barWidth + barSpacing) + barGroupWidth * 0.1
      const barY = top + chartHeight - barHeight

      ctx.fillStyle = colors[metric]
      ctx.fillRect(barX, barY, barWidth, barHeight)
    })

    // Draw x-axis labels
    ctx.fillStyle = '#374151'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    const labelX = groupX + barGroupWidth / 2
    const labelY = top + chartHeight + 20
    
    // Rotate context for angled text
    ctx.save()
    ctx.translate(labelX, labelY)
    ctx.rotate(-Math.PI / 4)
    ctx.fillText(dataPoint.name, 0, 0)
    ctx.restore()
  })

  // Draw y-axis labels
  ctx.fillStyle = '#374151'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'right'
  for (let i = 0; i <= 5; i++) {
    const value = (maxValue / 5) * (5 - i)
    const y = top + (chartHeight / 5) * i + 4
    ctx.fillText(value.toFixed(2), left - 10, y)
  }

  // Draw legend
  const legendY = top - 10
  let legendX = left
  metrics.forEach((metric, index) => {
    ctx.fillStyle = colors[metric]
    ctx.fillRect(legendX, legendY, 12, 12)
    
    ctx.fillStyle = '#374151'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(metric, legendX + 16, legendY + 9)
    
    legendX += ctx.measureText(metric).width + 30
  })
}

const handleMouseMove = (event: MouseEvent) => {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const x = (event.clientX - rect.left) * (canvasWidth / rect.width)
  const y = (event.clientY - rect.top) * (canvasHeight / rect.height)

  const { left } = props.margin
  const barGroupWidth = (canvasWidth - left - props.margin.right) / props.data.length

  const dataIndex = Math.floor((x - left) / barGroupWidth)
  
  if (dataIndex >= 0 && dataIndex < props.data.length) {
    const dataPoint = props.data[dataIndex]
    tooltip.value = {
      visible: true,
      x: event.clientX + 10,
      y: event.clientY - 10,
      label: dataPoint.fullName,
      data: [
        { key: 'AUC', value: dataPoint.AUC, color: colors.AUC },
        { key: 'Precision (y=1)', value: dataPoint['Precision (y=1)'], color: colors['Precision (y=1)'] },
        { key: 'Recall (y=1)', value: dataPoint['Recall (y=1)'], color: colors['Recall (y=1)'] },
        { key: 'F1-Score (y=1)', value: dataPoint['F1-Score (y=1)'], color: colors['F1-Score (y=1)'] }
      ]
    }
  } else {
    tooltip.value.visible = false
  }
}

const handleMouseLeave = () => {
  tooltip.value.visible = false
}

onMounted(() => {
  nextTick(drawChart)
})

watch(() => props.data, () => {
  nextTick(drawChart)
}, { deep: true })
</script>