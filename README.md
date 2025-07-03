# App Usage Visualizer

## 项目简介

本项目是一个基于 Vue 3 + Vite + ECharts 的应用使用时长可视化工具，支持深色主题，现代美观。
主要功能包括应用时长卡片展示、可切换的多种图表（柱状图、折线图、饼图）、自适应布局和滚动体验。

---

## 已实现的功能

- **应用时长总览卡片**：以卡片形式展示每个应用的使用时长、图标、进度条。
- **图表可视化**：支持柱状图、折线图、饼图三种类型，基于 ECharts 实现，数据与卡片区同步。
- **图表类型切换**：按钮位于图表下方，支持一键切换不同图表类型。
- **深色主题**：全局深蓝色背景，卡片和图表风格统一，字体高对比度。
- **自适应布局**：卡片区和图表区上下分布，比例约2:3，卡片区可滚动，适合大量应用。
- **响应式设计**：支持桌面和移动端浏览体验。
- **滚动条美化**：自定义滚动条样式，提升视觉体验。

---

## 目录结构与文件说明

```
src/
  ├── APP.vue              # 主界面入口，页面结构与核心逻辑
  ├── main.js              # 应用入口，挂载 Vue 实例
  ├── AppUsageList.vue     # 应用时长卡片列表组件
  ├── AppUsageItem.vue     # 单个应用时长卡片组件
  ├── components/
  │     └── UsageChart.vue # 图表组件，封装 ECharts
  ├── assets/
  │     ├── main.css       # 全局样式（引入 Tailwind）
  │     └── vue.svg        # 示例图片
  └── style.css            # 额外样式（如有）
```

### 主要文件功能

- **APP.vue**  
  页面主入口，负责整体布局、数据管理、图表类型切换、主题与滚动区分布。

- **main.js**  
  Vue 应用入口，加载全局样式并挂载主组件。

- **AppUsageList.vue**  
  接收应用数据，遍历渲染每个应用卡片，支持自定义字体颜色。

- **AppUsageItem.vue**  
  单个应用卡片，包含图标、应用名、进度条、时长，支持高对比度字体。

- **components/UsageChart.vue**  
  图表组件，基于 ECharts，支持柱状图、折线图、饼图，自动适配数据和类型切换。

- **assets/main.css**  
  引入 TailwindCSS 基础样式。

---

## 主要实现细节与注释

### APP.vue

```vue
<script setup>
// 页面主入口，负责整体布局和数据管理
import { ref } from 'vue'
import AppUsageList from './AppUsageList.vue'
import UsageChart from './components/UsageChart.vue'

// 假数据：应用名、图标、时长（字符串）、分钟数
const apps = [
  { name: 'Chrome', icon: '🌐', time: '3h 20min', minutes: 200 },
  // ... 其它应用
]
const maxMinutes = Math.max(...apps.map(a => a.minutes))

// 图表类型切换
const chartType = ref('bar')
const chartTypes = [
  { label: '柱状图', value: 'bar' },
  { label: '折线图', value: 'line' },
  { label: '饼图', value: 'pie' }
]
</script>
```

### AppUsageList.vue

```vue
<script setup>
// 应用时长卡片列表，遍历渲染 AppUsageItem
import AppUsageItem from './AppUsageItem.vue'
const props = defineProps({
  apps: Array,           // 应用数据数组
  maxMinutes: Number,    // 最大分钟数（用于进度条比例）
  cardTextClass: String  // 字体颜色类名
})
</script>
```

### AppUsageItem.vue

```vue
<script setup>
// 单个应用卡片，显示图标、名称、进度条、时长
const props = defineProps({
  name: String,          // 应用名
  icon: String,          // 图标 emoji
  time: String,          // 时长字符串
  minutes: Number,       // 时长（分钟）
  maxMinutes: Number,    // 最大分钟数
  textClass: String      // 字体颜色类名
})
</script>
```

### components/UsageChart.vue

```vue
<script setup>
// 图表组件，支持柱状图、折线图、饼图
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chart = null

const props = defineProps({
  data: Array,           // 图表数据
  chartType: String      // 图表类型
})

// 初始化和切换图表
function initChart() {
  // ... 省略 ECharts 配置，已根据类型自动切换 option
}
onMounted(() => { nextTick(() => { initChart() }) })
watch(() => [props.data, props.chartType], () => { if (chart) initChart() })
onBeforeUnmount(() => { if (chart) { chart.dispose(); chart = null } })
</script>
```

### main.js

```js
// Vue 应用入口，加载全局样式并挂载主组件
import { createApp } from 'vue'
import APP from './APP.vue'
import './assets/main.css'

createApp(APP).mount('#app')
```

---

## 如何运行

1. 安装依赖  
   ```bash
   npm install
   ```

2. 启动开发服务器  
   ```bash
   npm run dev
   ```

3. 访问本地地址（通常为 http://localhost:5173）

---

## 其它说明

- 本项目采用 TailwindCSS 进行快速样式开发。
- 图表基于 ECharts，支持多种类型切换。
- 所有数据为假数据，实际接入可根据需要调整。
- 代码已添加详细注释，便于二次开发和维护。

---

如需进一步扩展功能或有其它问题，欢迎随时联系！
