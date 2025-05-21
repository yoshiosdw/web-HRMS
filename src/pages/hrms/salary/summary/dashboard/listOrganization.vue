<script setup>
import { computed } from 'vue'

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
        <VCard class="pa-6" elevation="4" style="background-color: #f9f9f9">
          <VCardTitle class="text-h6 text-center mb-4">
            {{ org.organization_name }}
          </VCardTitle>
          <VCardText>
            <VRow class="align-center mb-3">
              <VCol cols="2" class="text-center">
                <VIcon color="success" size="28">mdi-cash</VIcon>
              </VCol>
              <VCol cols="6" class="text-subtitle-1 font-weight-medium">
                Total Netpay
              </VCol>
              <VCol cols="4" class="text-right text-h6 text-success">
                {{ formatRupiah(org.total_netpay) }}
              </VCol>
            </VRow>

            <VRow class="align-center mb-3">
              <VCol cols="2" class="text-center">
                <VIcon color="info" size="28">mdi-shield-account</VIcon>
              </VCol>
              <VCol cols="6" class="text-subtitle-1 font-weight-medium">
                BPJS TK
              </VCol>
              <VCol cols="4" class="text-right text-h6 text-info">
                {{ formatRupiah(org.total_bpjs_tk) }}
              </VCol>
            </VRow>

            <VRow class="align-center mb-3">
              <VCol cols="2" class="text-center">
                <VIcon color="error" size="28">mdi-hospital</VIcon>
              </VCol>
              <VCol cols="6" class="text-subtitle-1 font-weight-medium">
                BPJS Kesehatan
              </VCol>
              <VCol cols="4" class="text-right text-h6 text-error">
                {{ formatRupiah(org.total_bpjs_kesehatan) }}
              </VCol>
            </VRow>

            <VRow class="align-center mb-2">
              <VCol cols="2" class="text-center">
                <VIcon color="primary" size="28">mdi-file-chart</VIcon>
              </VCol>
              <VCol cols="6" class="text-subtitle-1 font-weight-medium">
                Total BPJS
              </VCol>
              <VCol cols="4" class="text-right text-h6 text-primary">
                {{ formatRupiah(org.total_bpjs) }}
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
