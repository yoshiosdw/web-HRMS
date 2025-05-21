<script setup>
import axiosIns from '@/plugins/axios'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { onBeforeRouteLeave } from 'vue-router'
import { useDialogStore } from '../hrd/useDialogStore'
import checkSalary from './checkSalary.vue'

const dialogDone = useDialogStore()
const dataset = ref([])

const handleDialogClosed = (data) => {
  if (data.success) {
    dialogDone.setDialogDone(true)
    dataset.value = data.dataset
    console.log(dataset.value)
  }
}

onBeforeRouteLeave(() => {
  dialogDone.resetDialog()
})

const selectedFields = computed(() => {
  return {
    gross: dataset.value.gross ?? 0,
    netpay: dataset.value.netpay ?? 0,
    daily_wage: dataset.value.daily_wage ?? 0,
    base_salary: dataset.value.base_salary ?? 0,
    overtime_hours: dataset.value.overtime_hours ?? 0,
    shift_3: dataset.value.shift_3 ?? 0,
    extra: dataset.value.extra ?? 0,
  }
})

const formatTitle = (key) => {
  return key.replace(/_/g, ' ').toUpperCase()
};

</script>

<template>
  <div>
  <checkSalary
    @close="handleDialogClosed"
  />

  <div v-if="dialogDone.dialogDone" class="mt-8">
    <VCard>
      <VCardTitle>My Salary</VCardTitle>
      <VCardText>
        <VRow class="d-flex">
            <VCol cols="12" md="6">
              <div
                v-for="(value, key) in selectedFields"
                :key="key"
                class="d-flex justify-space-between mb-2"
              >
                <strong>{{ formatTitle(key) }}:</strong>
                <span>Rp {{ value?.toLocaleString('id-ID') || '0' }}</span>
              </div>
            </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
  </div>
</template>

<route lang="yaml">
  meta:
    action: Read
    subject: Salary
    redirectIfLoggedIn: false
</route>
