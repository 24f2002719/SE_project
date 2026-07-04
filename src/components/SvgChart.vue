<template>
  <div class="w-full bg-white border border-outline-variant rounded-xl p-md shadow-sm">
    <div class="flex justify-between items-center mb-md">
      <h3 class="font-headline-sm text-sm font-bold text-primary">{{ title }}</h3>
      <div class="flex gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-secondary-container self-center"></span>
        <span class="font-label-bold text-[10px] text-on-surface-variant">Footfall Rate</span>
      </div>
    </div>
    <div class="relative w-full h-48">
      <svg viewBox="0 0 500 200" class="w-full h-full">
        <!-- Grid lines -->
        <line x1="40" y1="20" x2="480" y2="20" stroke="#eff4ff" stroke-width="1" />
        <line x1="40" y1="70" x2="480" y2="70" stroke="#eff4ff" stroke-width="1" />
        <line x1="40" y1="120" x2="480" y2="120" stroke="#eff4ff" stroke-width="1" />
        <line x1="40" y1="170" x2="480" y2="170" stroke="#c6c6cd" stroke-width="1" />

        <!-- Grid values -->
        <text x="15" y="24" fill="#76777d" font-size="10" font-family="Lexend" text-anchor="middle">100</text>
        <text x="15" y="74" fill="#76777d" font-size="10" font-family="Lexend" text-anchor="middle">50</text>
        <text x="15" y="124" fill="#76777d" font-size="10" font-family="Lexend" text-anchor="middle">20</text>
        <text x="15" y="174" fill="#76777d" font-size="10" font-family="Lexend" text-anchor="middle">0</text>

        <!-- Bars -->
        <g v-for="(val, idx) in normalizedValues" :key="idx" class="group cursor-pointer">
          <!-- Hover indicator background -->
          <rect 
            :x="val.x - 15" 
            y="10" 
            width="30" 
            height="160" 
            fill="rgba(253, 118, 26, 0.03)" 
            class="opacity-0 group-hover:opacity-100 transition-opacity"
            rx="4"
          />
          <!-- The Bar -->
          <rect 
            :x="val.x - 8" 
            :y="val.y" 
            width="16" 
            :height="val.height" 
            fill="#fd761a" 
            rx="4"
            class="transition-all duration-300 hover:fill-primary"
          />
          <!-- Value Label on Hover -->
          <text 
            :x="val.x" 
            :y="val.y - 6" 
            fill="#0b1c30" 
            font-size="10" 
            font-weight="bold"
            font-family="Lexend" 
            text-anchor="middle"
            class="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {{ data[idx] }}
          </text>
          <!-- X Axis Label -->
          <text 
            :x="val.x" 
            y="188" 
            fill="#45464d" 
            font-size="10" 
            font-family="Lexend" 
            text-anchor="middle"
          >
            {{ labels[idx] }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Analytics Trend' },
  data: { type: Array, default: () => [30, 45, 60, 25, 70, 95] },
  labels: { type: Array, default: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }
})

const normalizedValues = computed(() => {
  const max = Math.max(...props.data, 100)
  const chartHeight = 150 // max height of bar
  const startX = 60
  const endX = 460
  const stepX = props.data.length > 1 ? (endX - startX) / (props.data.length - 1) : 0

  return props.data.map((val, idx) => {
    const height = (val / max) * chartHeight
    const y = 170 - height
    const x = startX + idx * stepX
    return { x, y, height }
  })
})
</script>
