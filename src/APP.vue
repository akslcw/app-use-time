<template>
  <div class="min-h-screen bg-gradient-to-br from-[#232946] to-[#1a1a2e] flex flex-col items-center justify-start py-0 h-screen">
    <!-- 主题标题 -->
    <h1 class="text-4xl font-extrabold text-[#e0e7ef] text-center mb-4 tracking-wide drop-shadow">应用使用时长</h1>
    
    <!-- 监控状态和控制按钮 -->
    <div class="flex items-center gap-4 mb-4">
      <div class="flex items-center gap-2">
        <div :class="[
          'w-3 h-3 rounded-full',
          isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        ]"></div>
        <span class="text-[#e0e7ef] font-medium">
          {{ isMonitoring ? '监控中' : '已停止' }}
        </span>
      </div>
      <button
        @click="toggleMonitoring"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all',
          isMonitoring 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-green-600 hover:bg-green-700 text-white'
        ]"
      >
        {{ isMonitoring ? '停止监控' : '开始监控' }}
      </button>
    </div>
    
    <div class="flex flex-col w-full h-full max-w-2xl flex-1">
      <!-- 上半部分：应用卡片区 -->
      <div class="flex-1 flex flex-col divide-y divide-blue-100 bg-[#232b3a] rounded-t-2xl shadow overflow-y-auto border border-blue-900/40">
        <div
          v-for="app in sortedApps"
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
                :style="{ width: maxMinutes > 0 ? (app.minutes / maxMinutes * 100) + '%' : '0%' }"
              ></div>
            </div>
            <div class="text-[#e0e7ef] text-base font-mono min-w-[60px] text-right">{{ formatTime(app.minutes) }}</div>
          </div>
        </div>
        
        <!-- 无数据提示 -->
        <div v-if="sortedApps.length === 0" class="flex items-center justify-center py-8">
          <div class="text-center">
            <div class="text-6xl mb-4">📊</div>
            <div class="text-[#e0e7ef] text-lg">暂无使用数据</div>
            <div class="text-[#cbd5e1] text-sm mt-2">开始监控后将会显示应用使用时长</div>
          </div>
        </div>
      </div>
      
      <!-- 下半部分：图表区域 -->
      <section class="flex-1 bg-[#202334] border border-blue-900/40 rounded-b-2xl p-4 flex items-center justify-center overflow-hidden relative">
        <!-- 左侧中部圆形切换按钮组 -->
        <div class="absolute left-6 top-6 flex flex-col items-start space-y-4 z-10">
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
          <UsageChart :data="sortedApps" :type="chartType" class="w-full h-full" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import UsageChart from './components/UsageChart.vue'

// 响应式数据
const apps = ref([])
const isMonitoring = ref(false)
const chartType = ref('bar')

// 图表类型配置
const chartTypes = [
  { type: 'bar', label: '柱状图', icon: '📊' },
  { type: 'line', label: '折线图', icon: '📈' },
  { type: 'pie', label: '饼图', icon: '🥧' }
]

// 计算属性
const sortedApps = computed(() => {
  return Object.values(apps.value)
    .sort((a, b) => b.minutes - a.minutes)
    .map(app => ({
      ...app,
      time: formatTime(app.minutes)
    }))
})

const maxMinutes = computed(() => {
  if (sortedApps.value.length === 0) return 0
  return Math.max(...sortedApps.value.map(a => a.minutes))
})

// 格式化时间显示
function formatTime(minutes) {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours}小时`
  }
  return `${hours}小时${remainingMinutes}分钟`
}

// 加载使用数据
async function loadUsageData() {
  try {
    if (window.electronAPI) {
      const data = await window.electronAPI.getUsageData()
      apps.value = data
    }
  } catch (error) {
    console.error('加载使用数据失败:', error)
  }
}

// 切换监控状态
async function toggleMonitoring() {
  try {
    if (window.electronAPI) {
      if (isMonitoring.value) {
        await window.electronAPI.stopMonitoring()
        isMonitoring.value = false
      } else {
        await window.electronAPI.startMonitoring()
        isMonitoring.value = true
      }
    }
  } catch (error) {
    console.error('切换监控状态失败:', error)
  }
}

// 监听数据更新
function setupDataListener() {
  if (window.electronAPI) {
    window.electronAPI.onUsageDataUpdated((data) => {
      apps.value = data
    })
  }
}

// 组件挂载
onMounted(async () => {
  // 检查是否在 Electron 环境中
  if (window.electronAPI) {
    await loadUsageData()
    setupDataListener()
    isMonitoring.value = true // 默认启动监控
  } else {
    // 开发环境使用模拟数据
    apps.value = {
      'Chrome': { name: 'Chrome', icon: '🌐', minutes: 200 },
      'VS Code': { name: 'VS Code', icon: '📝', minutes: 135 },
      '微信': { name: '微信', icon: '💬', minutes: 65 },
      '网易云音乐': { name: '网易云音乐', icon: '🎵', minutes: 45 },
      'QQ': { name: 'QQ', icon: '💻', minutes: 30 }
    }
    isMonitoring.value = false
  }
})

// 组件卸载
onUnmounted(() => {
  if (window.electronAPI) {
    window.electronAPI.removeUsageDataListener()
  }
})
</script>
