<script setup>
import axiosIns from '@/plugins/axios'
import { reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useDialogStore } from '../../hrd/useDialogStore'
import { onMounted } from 'vue'
import chartSjb from './chartSjb.vue'
import donatChart from './donatChart.vue'
import listOrganization from './listOrganization.vue'
import summarySalary from './summarySalary.vue'

const masterKey = useDialogStore()
const month = ref(new Date().getMonth() + 1)
const year = ref(new Date().getFullYear())
const yearOptions = Array.from({ length: 101 }, (_, i) => 2000 + i)
const waiting = ref(false)
const dataset = ref([])
const toast = useToast()

const months = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
]

const args = reactive({
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
})

const fetchData = async () => {
  waiting.value = true;
  try {
    const response = await axiosIns.post('/salaries/summary', {
      master_key: masterKey.masterKey,
      month: args.month,
      year: args.year,
    })
    dataset.value = response.data.data
  } catch (error) {
    console.error('Gagal fetch data:', error)
    toast.error('Gagal memuat data dari master key.')
  } finally {
    waiting.value = false
  }
}

watch(() => [args.month, args.year], () => {
  fetchData()
})

onMounted(() => {
  fetchData()
});
</script>

<template>
    <VCard>
      <VCardText>
        <VRow justify="end">
        <VCol cols="12" sm="2">
            <VSelect
            v-model="args.month"
            variant="outlined"
            :items="months"
            label="Select Month"
            item-title="label"
            item-value="value"
            density="compact"
            />
        </VCol>
        <VCol cols="12" sm="2">
            <VSelect
            v-model="args.year"
            :items="yearOptions"
            label="Select Year"
            density="compact"
            :rules="[requiredValidator]"
            />
        </VCol>
        </VRow>
      </VCardText>
      <VCardTitle class="text-center justify-center">SUMMARY SALARY & BPJS</VCardTitle>
      <VCardText>
        <VRow class="d-flex">
            <VCol cols="12" md="12">
                <summarySalary :dataset="dataset" />
            </VCol>
        </VRow>
      </VCardText>
      <VCardText>
        <VRow class="d-flex">
            <VCol cols="12" md="12">
                <!-- <donatChart :dataset="dataset" /> -->
            </VCol>
        </VRow>
      </VCardText>
    </VCard>

<div class="mt-8">
    <VCard>
      <VCardTitle class="text-center justify-center">SUMMARY BY ORGANIZATION</VCardTitle>
      <VCardText>
        <VRow class="d-flex mt-4">
            <VCol cols="12" md="12">
              <listOrganization :dataset="dataset" />
            </VCol>
        </VRow>
      </VCardText>
    </VCard>
</div>
<div class="mt-8">
    <!-- <VCard>
      <VCardTitle class="text-center justify-center">ORGANIZATION</VCardTitle>
      <VCardText>
        <VRow class="d-flex mt-4">
            <VCol cols="12" md="12">
              <chartSjb :dataset="dataset" />
            </VCol>
        </VRow>
      </VCardText>
    </VCard> -->
</div>
</template>

<route lang="yaml">
    meta:
      action: Manage
      subject: Salary
      redirectIfLoggedIn: false
</route>