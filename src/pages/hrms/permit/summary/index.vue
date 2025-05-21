<script setup>
import summaryPermit from './summaryPermit.vue'
import oftenPermitChart from './chartPermit.vue'
import { ref, onMounted } from 'vue'
import axiosIns from '@/plugins/axios'

const permitData = ref({ duration: {}, often_permit: [], total_permit_today: 0 })

onMounted(async () => {
  const { data } = await axiosIns.get('/permits/dashboard/summary')
  permitData.value = data.data
});
</script>

<template>
  <VCard>
    <VCardTitle class="text-center">DASHBOARD PERMIT</VCardTitle>
    <VCardText>
      <summaryPermit :dataset="permitData" />
      <VRow class="mt-6">
        <VCol cols="12" md="6">
          <oftenPermitChart :dataset="permitData" />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>


<route lang="yaml">
  meta:
    action: Read
    subject: Permit
    redirectIfLoggedIn: false
</route>
