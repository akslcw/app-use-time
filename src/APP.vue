<template>
  <div class="min-h-screen bg-gradient-to-br from-[#232946] to-[#1a1a2e] flex flex-col items-center justify-start py-0 h-screen">
    <!-- 主题标题 -->
    <h1 class="text-4xl font-extrabold text-[#e0e7ef] text-center mb-4 tracking-wide drop-shadow">应用使用时长</h1>
    <div class="flex flex-col w-full h-full max-w-2xl flex-1">
      <!-- 上半部分：应用卡片区 -->
      <div class="flex-1 flex flex-col divide-y divide-blue-100 bg-[#232b3a] rounded-t-2xl shadow overflow-y-auto border border-blue-900/40">
        <div
          v-for="app in apps"
          :key="app.name"
          class="flex items-center px-4 py-3"
        >
          <!-- 应用图标 -->
          <div class="w-10 h-10 flex items-center justify-center rounded-xl bg-[#232b3a] mr-4 shadow-sm border border-blue-900/30 overflow-hidden">
            <span class="text-2xl text-[#e0e7ef]">{{ app.icon || '📱' }}</span>
          </div>
          <!-- 应用名 -->
          <div class="flex-1 text-lg font-serif text-[#e0e7ef] tracking-wide">{{ app.name }}</div>
          <!-- 进度条和时间 -->
          <div class="flex items-center w-2/5 min-w-[120px]">
            <div class="flex-1 bg-blue-900/60 rounded-full h-2 mr-3 overflow-hidden">
              <div
                class="bg-blue-400/80 h-2 rounded-full transition-all"
                :style="{ width: (app.minutes / maxMinutes * 100) + '%' }"
              ></div>
            </div>
            <div class="text-[#e0e7ef] text-base font-mono min-w-[60px] text-right">{{ app.time }}</div>
          </div>
        </div>
      </div>
      <!-- 下半部分：图表区域 -->
      <section class="flex-1 bg-[#202334] border border-blue-900/40 rounded-b-2xl p-4 flex items-center justify-center overflow-hidden relative">
        <!-- 左侧中部圆形切换按钮组 -->
          <div class="absolute bottom-6 left-6 flex flex-col items-start space-y-4 z-10">
       <button
    v-for="item in chartTypes"
    :key="item.type"
    @click="chartType = item.type"
    :title="item.label"
    :class="[
      'w-12 h-12 flex items-center justify-center rounded-full',
      'transition-all duration-300 ease-out hover:ease-in',
      chartType === item.type 
        ? 'bg-gray-700 scale-110 ring-2 ring-gray-300 shadow-lg' 
        : 'bg-gray-900 hover:bg-gray-600 shadow-md hover:shadow-lg',
      'text-2xl text-white border border-gray-700 hover:border-gray-500'
    ]"
  >
    <span>{{ item.icon }}</span>
  </button>
      </div>
        <div class="flex-1 flex items-center justify-center">
          <UsageChart :data="apps" :type="chartType" class="w-full h-full" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UsageChart from './components/UsageChart.vue'

const apps = [
  { name: 'Chrome', icon: '🌐', time: '3h 20min', minutes: 200 },
  { name: 'VS Code', icon: '📝', time: '2h 15min', minutes: 135 },
  { name: '微信', icon: '💬', time: '1h 05min', minutes: 65 },
  { name: '网易云音乐', icon: '🎵', time: '45min', minutes: 45 },
  { name: 'QQ', icon: '💻', time: '30min', minutes: 30 }
]

const maxMinutes = Math.max(...apps.map(a => a.minutes))

const chartType = ref('line')
const chartTypes = [
  { type: 'line', label: '折线图', icon: '📈' },
  { type: 'pie', label: '饼图', icon: '🥧' },
  { type: 'bar', label: '柱状图', icon: '📊' }
]
</script>
