<script setup>
import { computed } from 'vue'

const props = defineProps({
  dataset: {
    type: Object,
    required: true,
  },
})

const formatRupiah = value => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const chartSeries = computed(() => {
  const d = props.dataset
  return [
    d.total_netpay,
    d.total_bpjs_tk,
    d.total_bpjs_kesehatan,
    d.total_bpjs,
  ]
})

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
  },
  labels: [
    'Total Netpay',
    'BPJS Ketenagakerjaan',
    'BPJS Kesehatan',
    'Total BPJS',
  ],
  dataLabels: {
    formatter: val => `${val.toFixed(1)}%`,
  },
  tooltip: {
    y: {
      formatter: val => formatRupiah(val),
    },
  },
  legend: {
    position: 'bottom',
  },
  title: {
    text: 'Komposisi Gaji & BPJS',
    align: 'center',
  },
}))
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12" md="6" offset-md="3">
        <VCard class="pa-4">
          <VCardText>
            <apexchart
              type="donut"
              :series="chartSeries"
              :options="chartOptions"
              height="350"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
