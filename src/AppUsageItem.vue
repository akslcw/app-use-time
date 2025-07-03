<template>
  <div class="flex items-center px-4 py-3">
    <!-- 应用图标 -->
    <div class="w-10 h-10 flex items-center justify-center rounded-xl bg-white mr-4 shadow-sm border border-gray-200 overflow-hidden">
      <span class="text-2xl">{{ icon || '📱' }}</span>
    </div>
    <!-- 应用名 -->
    <div :class="['flex-1 text-lg font-bold font-sans tracking-wider', textClass || 'text-white']">{{ name }}</div>
    <!-- 进度条和时间 -->
    <div class="flex items-center w-2/5 min-w-[120px]">
      <div class="flex-1 bg-gray-800 rounded-full h-2 mr-3 overflow-hidden">
        <div
          class="bg-blue-400 h-2 rounded-full transition-all"
          :style="{ width: (minutes / maxMinutes * 100) + '%' }"
        ></div>
      </div>
      <div class="text-gray-400 text-base font-mono min-w-[60px] text-right">{{ time }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: String,
  icon: String,
  time: String,
  minutes: Number,
  maxMinutes: Number,
  textClass: String
})
</script> 