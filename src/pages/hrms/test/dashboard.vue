<script setup>
import { ref, onMounted, watch } from 'vue'
import axiosIns from '@/plugins/axios'
import ApexCharts from 'vue3-apexcharts'

const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const selectedMonth = ref(new Date().getMonth() + 1)

const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i)

const monthItems = [
  { title: 'Januari', value: 1 },
  { title: 'Februari', value: 2 },
  { title: 'Maret', value: 3 },
  { title: 'April', value: 4 },
  { title: 'Mei', value: 5 },
  { title: 'Juni', value: 6 },
  { title: 'Juli', value: 7 },
  { title: 'Agustus', value: 8 },
  { title: 'September', value: 9 },
  { title: 'Oktober', value: 10 },
  { title: 'November', value: 11 },
  { title: 'Desember', value: 12 },
]

const totalValues = ref({})
const donutSeries = ref([0, 0])
const barChartSeries = ref([
  { name: 'Netpay', data: [] },
  { name: 'BPJS TK', data: [] },
  { name: 'BPJS Kesehatan', data: [] },
])

const donutOptions = ref({
  chart: { type: 'donut' },
  labels: ['BPJS TK', 'BPJS Kesehatan'],
  colors: ['#FF7F50', '#FF6F61'],
  legend: { position: 'bottom' },
  tooltip: {
    y: {
      formatter: (val) => `Rp ${val.toLocaleString()}`,
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '60%',
        labels: {
          show: true,
          name: { show: true },
          value: {
            show: true,
            formatter: (val) => `Rp ${parseInt(val).toLocaleString()}`,
          },
          total: {
            show: true,
            label: 'Total',
            formatter: (w) => {
              const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
              return `Rp ${total.toLocaleString()}`
            },
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val, opts) => {
      const seriesIndex = opts.seriesIndex
      const value = opts.w.config.series[seriesIndex]
      return `Rp ${value.toLocaleString()}`
    },
  },
})

const barChartOptions = ref({
  chart: { type: 'bar', height: 400 },
  plotOptions: {
    bar: {
      horizontal: true,
      distributed: false,
      barHeight: '60%',
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => `Rp ${val.toLocaleString()}`,
    style: {
      fontWeight: 'bold',
      fontSize: '12px',
    },
  },
  xaxis: {
    categories: [],
    labels: {
      formatter: (val) => `Rp ${val.toLocaleString()}`,
    },
  },
  tooltip: {
    y: {
      formatter: (val) => `Rp ${val.toLocaleString()}`,
    },
  },
  colors: ['#008FFB', '#00E396', '#FF4560'],
})

const fetchData = async () => {
  try {
    const masterKey = localStorage.getItem('master_key')
    if (!masterKey) {
      console.error('Master key tidak ditemukan di localStorage.')
      return
    }

    const res = await axiosIns.post('/salaries/summary', {
      master_key: masterKey,
      year: selectedYear.value,
      month: selectedMonth.value,
    })

    const data = res.data.data

    // Update Total Cards
    totalValues.value = {
      'Total Netpay': {
        amount: data.total_netpay || 0,
        color: '#4CAF50',
      },
      'Total BPJS': {
        amount: (data.total_bpjs_tk || 0) + (data.total_bpjs_kesehatan || 0),
        color: '#FF5733',
      },
    }

    // Donut Chart
    donutSeries.value = [data.total_bpjs_tk || 0, data.total_bpjs_kesehatan || 0]

    // Bar Chart
    const orgNames = []
    const netpayData = []
    const bpjsTkData = []
    const bpjsKesData = []

    if (Array.isArray(data.per_organization)) {
      data.per_organization.forEach((org) => {
        orgNames.push(org.organization_name)
        netpayData.push(org.total_netpay || 0)
        bpjsTkData.push(org.total_bpjs_tk || 0)
        bpjsKesData.push(org.total_bpjs_kesehatan || 0)
      })
    }

    barChartOptions.value = Object.assign({}, barChartOptions.value, {
      xaxis: {
        categories: orgNames,
        labels: {
          formatter: (val) => `Rp ${val.toLocaleString()}`,
        },
      },
    })

    barChartSeries.value = [
      { name: 'Netpay', data: [...netpayData] },
      { name: 'BPJS TK', data: [...bpjsTkData] },
      { name: 'BPJS Kesehatan', data: [...bpjsKesData] },
    ]
  } catch (err) {
    console.error('Gagal mengambil data:', err)
  }
}

onMounted(() => {
  fetchData()
})

watch(
  () => [selectedYear.value, selectedMonth.value],
  () => {
    fetchData()
  }
)
</script>

<template>
  <VContainer fluid>
    <!-- Filter -->
    <VRow class="mb-4" justify="end">
      <VCol cols="12" md="2">
        <VSelect
          v-model="selectedYear"
          :items="years"
          label="Tahun"
          dense
          outlined
          :menu-props="{ maxHeight: '300px' }"
        />
      </VCol>
      <VCol cols="12" md="3">
        <VSelect
          v-model="selectedMonth"
          :items="monthItems"
          item-title="title"
          item-value="value"
          label="Bulan"
          dense
          outlined
          :menu-props="{ maxHeight: '300px' }"
        />
      </VCol>
    </VRow>

    <!-- Total Cards -->
    <VRow>
      <VCol
        v-for="(value, name) in totalValues"
        :key="name"
        cols="12"
        sm="6"
        md="4"
      >
        <VCard class="pa-4" elevation="2">
          <div class="text-h6 font-weight-bold">{{ name }}</div>
          <div
            class="text-h5 mt-2 font-weight-bold"
            :style="{ color: value.color }"
          >
            Rp {{ value.amount.toLocaleString() }}
          </div>
        </VCard>
      </VCol>
    </VRow>

    <!-- Charts -->
    <VRow class="mt-6">
      <VCol cols="4">
        <VCard class="pa-4" elevation="2">
          <div class="text-center font-weight-medium mb-2">Breakdown BPJS</div>
          <apexchart
            type="donut"
            height="280"
            :options="donutOptions"
            :series="donutSeries"
          />
        </VCard>
      </VCol>

      <VCol cols="8">
        <VCard class="pa-4" elevation="2">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Netpay & BPJS per Organisasi
          </div>
          <apexchart
            type="bar"
            height="400"
            :options="barChartOptions"
            :series="barChartSeries"
          />
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<route lang="yaml">
meta:
  action: Read
  subject: Dashboard
  redirectIfLoggedIn: false
</route>
