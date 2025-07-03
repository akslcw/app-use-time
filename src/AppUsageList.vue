<template>
  <div class="w-full max-w-2xl flex flex-col divide-y divide-gray-700 bg-transparent rounded-2xl shadow mb-10">
    <AppUsageItem
      v-for="app in apps"
      :key="app.name"
      :name="app.name"
      :icon="app.icon"
      :time="app.time"
      :minutes="app.minutes"
      :maxMinutes="maxMinutes"
      :textClass="cardTextClass || 'text-gray-100'"
    />
  </div>
</template>

<script setup>
import AppUsageItem from './AppUsageItem.vue'
const props = defineProps({
  apps: Array,
  maxMinutes: Number,
  cardTextClass: String
})
</script> 