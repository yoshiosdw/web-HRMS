<script setup>
import { computed } from 'vue'

const props = defineProps({
  dataset: {
    type: Object,
    required: true,
  },
})

const summaryData = computed(() => [
  {
    label: 'Rata-rata Durasi Izin',
    value: props.dataset.duration?.average_duration_formatted,
    icon: 'mdi-timer',
    color: 'primary',
  },
  {
    label: 'Total Izin Hari Ini',
    value: props.dataset.total_permit_today,
    icon: 'mdi-calendar-check',
    color: 'info',
  },
  {
    label: 'Total Permit',
    value: props.dataset.often_permit?.[0]?.total_permits ?? 0,
    icon: 'mdi-file-document',
    color: 'warning',
  },
]);
</script>

<template>
  <VRow>
    <VCol
      v-for="(item, i) in summaryData"
      :key="i"
      cols="12"
      sm="6"
      md="4"
    >
      <VCard class="py-4">
        <VCardText class="text-center">
          <VIcon :color="item.color" size="40">{{ item.icon }}</VIcon>
          <div class="text-h5 mt-2">{{ item.value }}</div>
          <div class="text-subtitle-1 font-weight-medium">{{ item.label }}</div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
