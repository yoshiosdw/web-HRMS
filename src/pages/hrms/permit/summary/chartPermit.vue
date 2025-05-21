<script setup>
import { computed } from 'vue'

const props = defineProps({
  dataset: {
    type: Object,
    default: () => ({ often_permit: [] }),
  },
})

const chartSeries = computed(() => {
  const permits = props.dataset?.often_permit ?? []
  return [
    {
      name: 'Jumlah Izin',
      data: permits.map(item => item.total_permits),
    },
  ]
})

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      columnWidth: '40%',
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: props.dataset?.often_permit.map(item => item.name) ?? [],
    title: {
      text: 'Nama Pegawai',
    },
  },
  yaxis: {
    title: {
      text: 'Total Izin',
    },
  },
  title: {
    text: 'Pegawai dengan Izin Terbanyak',
    align: 'center',
  },
  legend: {
    show: false,
  },
}));
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12" offset-md="6">
        <VCard>
          <VCardText>
            <apexchart
              type="bar"
              height="400"
              :options="chartOptions"
              :series="chartSeries"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
