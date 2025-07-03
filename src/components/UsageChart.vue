<template>
  <div ref="chartRef" class="w-full min-h-[400px] h-96 bg-black rounded-xl shadow p-4 border border-blue-800"></div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chart = null

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    default: 'bar'
  },
  chartType: {
    type: String,
    default: undefined
  }
})

const realType = computed(() => props.type || props.chartType || 'bar')

function initChart() {
  const el = chartRef.value
  if (!el || el.clientWidth === 0 || el.clientHeight === 0) {
    setTimeout(initChart, 300)
    return
  }
  if (!chart) {
    chart = echarts.init(el)
    window.addEventListener('resize', () => chart.resize())
  }
  let option
  if (realType.value === 'pie') {
    option = {
      backgroundColor: '#202334',
      title: {
        text: '今日应用使用时长分布',
        left: 'center',
        textStyle: { color: '#e0e7ef', fontWeight: 'bold', fontSize: 20, fontFamily: 'inherit' }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: '#232b3a',
        borderColor: '#3b82f6',
        textStyle: { color: '#e0e7ef' }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: { color: '#cbd5e1', fontSize: 14 }
      },
      series: [
        {
          name: '使用时长',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          data: props.data.map(item => ({ value: item.minutes, name: item.name })),
          itemStyle: {
            borderRadius: 10,
            borderColor: '#202334',
            borderWidth: 3
          },
          label: {
            color: '#e0e7ef',
            fontWeight: 'bold',
            fontSize: 14
          },
          labelLine: {
            lineStyle: { color: '#3b82f6' }
          }
        }
      ]
    }
  } else {
    option = {
      backgroundColor: '#202334',
      title: {
        text: realType.value === 'line' ? '今日应用使用时长趋势' : '今日应用使用时长（分钟）',
        left: 'center',
        textStyle: { color: '#e0e7ef', fontWeight: 'bold', fontSize: 20, fontFamily: 'inherit' }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#232b3a',
        borderColor: '#3b82f6',
        textStyle: { color: '#e0e7ef' }
      },
      legend: {
        show: false
      },
      xAxis: {
        type: 'category',
        data: props.data.map(item => item.name),
        axisLabel: { color: '#cbd5e1', fontWeight: 'bold', fontSize: 14 },
        axisLine: { lineStyle: { color: '#3b82f6' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#cbd5e1', fontWeight: 'bold', fontSize: 14 },
        splitLine: { lineStyle: { color: '#334155' } }
      },
      series: [
        {
          name: '使用时长',
          type: realType.value,
          data: props.data.map(item => item.minutes),
          itemStyle: {
            color: realType.value === 'bar' ? '#3b82f6' : '#60a5fa',
            borderRadius: 10
          },
          smooth: realType.value === 'line',
          lineStyle: {
            color: '#3b82f6',
            width: 4
          },
          areaStyle: realType.value === 'line' ? { color: 'rgba(59,130,246,0.15)' } : undefined,
          symbol: 'circle',
          symbolSize: 12
        }
      ]
    }
  }
  chart.setOption(option)
}

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

watch(() => [props.data, props.type, props.chartType], () => {
  if (chart) {
    initChart()
  }
})

onBeforeUnmount(() => {
  if (chart) {
    chart.dispose()
    chart = null
  }
})
</script>
