<script setup>

const props = defineProps({
    dataset: {
        type: Object,
        required: true,
    },
})

const organizationList = computed(() => {
  return props.dataset?.per_organization || []
})

const formatRupiah = value => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const generateChart = org => {
  return {
    series: [
      {
        name: 'Total Netpay',
        data: [org.total_netpay],
      },
      {
        name: 'BPJS Ketenagakerjaan',
        data: [org.total_bpjs_tk],
      },
      {
        name: 'BPJS Kesehatan',
        data: [org.total_bpjs_kesehatan],
      },
      {
        name: 'Total BPJS',
        data: [org.total_bpjs],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        toolbar: { show: false },
      },
      xaxis: {
        categories: [org.organization_name],
      },
      title: {
        text: `${org.organization_name}`,
        align: 'center',
      },
      dataLabels: {
        enabled: true,
        formatter: val => formatRupiah(val),
         style: {
            colors: ['#000000'],
            fontSize: '13px',
            fontWeight: 'bold',
        },
      },
      tooltip: {
        y: {
          formatter: val => formatRupiah(val),
        },
      },
    },
  }
}
</script>

<template>
  <div>
    <VRow>
      <VCol
        v-for="org in organizationList"
        :key="org.organization_id"
        cols="12"
        md="6"
      >
        <VCard class="pa-4" width="100%">
          <VCardText>
            <apexchart
              type="bar"
              width="100%"
              height="300"
              :options="generateChart(org).options"
              :series="generateChart(org).series"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>