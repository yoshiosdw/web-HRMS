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

const dataCards = computed(() => [
  {
    label: 'Total Netpay',
    // role: 'Gaji Bersih',
    value: props.dataset.total_netpay,
    icon: 'mdi-cash',
    color: 'success',
  },
  {
    label: 'BPJS TK',
    // role: 'Jamsostek',
    value: props.dataset.total_bpjs_tk,
    icon: 'mdi-shield-account',
    color: 'info',
  },
  {
    label: 'BPJS Kesehatan',
    // role: 'Askes',
    value: props.dataset.total_bpjs_kesehatan,
    icon: 'mdi-hospital',
    color: 'error',
  },
  {
    label: 'Total BPJS',
    // role: 'Gabungan BPJS',
    value: props.dataset.total_bpjs,
    icon: 'mdi-file-chart',
    color: 'primary',
  },
])
</script>

<template>
  <div>
    <VRow justify="center">
      <VCol
        v-for="(item, i) in dataCards"
        :key="i"
        cols="12"
        sm="6"
        md="3"
        class="text-center"
      >
        <VCard class="py-6">
          <VCardText>
            <VIcon :color="item.color" size="36" class="mb-2">
              {{ item.icon }}
            </VIcon>
            <div class="text-h5 font-weight-bold">{{ formatRupiah(item.value) }}</div>
            <div class="text-subtitle-1 font-weight-medium mt-1">{{ item.label }}</div>
            <div class="text-caption text-grey">{{ item.role }}</div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
