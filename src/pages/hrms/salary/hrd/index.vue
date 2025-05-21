<script setup>
import axiosIns from '@/plugins/axios'
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useDialogStore } from './useDialogStore'
import MasterKeyDialog from './masterKey.vue'
import { onBeforeRouteLeave } from 'vue-router'
import { formatUang } from '@/@core/utils/formatters'
import { onMounted } from 'vue'

const dialogDone = useDialogStore()
const dataset = ref([])
const yearOptions = Array.from({ length: 101 }, (_, i) => 2000 + i);
const waiting = ref(false)
const toast = useToast()

const handleDialogClosed = (data) => {
  if (data.success) {
    dialogDone.setDialogDone(true)
    dialogDone.setMasterKey(data.masterKey)
    dataset.value = data.dataset
    meta.total = data.meta.total
    meta.from = data.meta.from
    meta.to = data.meta.to
    meta.last = data.meta.last
    meta.per_page = data.meta.per_page
    meta.current_page = data.meta.current_page
  }
}

onBeforeRouteLeave(() => {
  dialogDone.resetDialog()
})

const args = reactive({
    page: 1,
    per_page: 10,
    find: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
})

const meta = reactive({
    total: 0,
    from: 0,
    to: 0,
    last: 0,
    current_page: 1,
    per_page: 10
})

const fetchData = async () => {
  waiting.value = true;
  try {
    const response = await axiosIns.post('/salaries/by/hrd', {
      master_key: dialogDone.masterKey,
      page: meta.current_page,
      month: args.month,
      year: args.year,
      find: args.find,
      organization_id: orgId.value,
    })
    dataset.value = response.data.data
    meta.total = response.data.meta.total
    meta.last = response.data.meta.last
    meta.from = response.data.meta.from
    meta.to = response.data.meta.to
    meta.per_page = response.data.meta.per_page
  } catch (error) {
    console.error('Gagal fetch data:', error)
    toast.error('Gagal memuat data dari master key.')
  } finally {
    waiting.value = false
  }
}

const organizations = ref([])
const orgId = ref()
const fetchOrganization = async () => {
    waiting.value = true;
    try {
        const ret = await axiosIns.get('/organizations', )

        organizations.value = ret.data.data
    } catch (error) {
        console.log(error)
        toast.error('Gagal memuat data. Error: ' + error.message)
    } finally {
        waiting.value = false
    }
}

onMounted(() => {
  if (dialogDone.masterKey) {
    fetchData(meta.current_page)
  }
})

watch(
  () => meta.current_page, (newPage, oldPage) => {
  if (newPage !== oldPage) {
    fetchData(newPage)
  }
})

watch([() => args.month, () => args.year, () => orgId.value, () => args.find], () => {
  if (dialogDone.masterKey) {
    meta.current_page = 1
    fetchData()
  }
})

onMounted(() => {
  fetchOrganization()
})

const headers = ref([
  { title: 'NAME', key: 'employee_name', sortable: true}, 
  { title: 'NIK', key: 'nik', sortable: true}, 
  { title: 'YEAR', key: 'year_period', align: 'end'},
  { title: 'MONTH', key: 'month_period', align: 'end'},
  { title: 'NET PAY', key: 'netpay', align: 'end'},
  { title: 'GROSS', key: 'gross', align: 'end'},
  { title: 'BASE SALARY', key: 'base_salary', sortable: false, align: 'end'},
  { title: 'DAILY WAGE', key: 'daily_wage', align: 'end' },
  { title: 'ABSENCE DEDUCTION', key: 'absence_deduction', align: 'end'},
  { title: 'COMPLAINT DEDUCTION', key: 'complaint_deduction', align: 'end'},
  { title: 'CONTINUATION BONUS', key: 'continuation_bonus', align: 'end'},
  { title: 'EXTRA', key: 'extra', align: 'end'},
  { title: 'H1', key: 'h1', align: 'end'},
  { title: 'HALF DAY ALLOWANCE', key: 'half_day_allowance', align: 'end'},
  { title: 'HOLIDAY PAY', key: 'holiday_pay', align: 'end'},
  { title: 'ID CARD', key: 'id_card', align: 'end'},
  { title: 'KMS', key: 'kms', align: 'end'},
  { title: 'LEAVE ALLOWANCE', key: 'leave_allowance', align: 'end'},
  { title: 'LOCKER FEE', key: 'locker_fee', align: 'end'},
  { title: 'LONG SHIFT', key: 'long_shift', align: 'end'},
  { title: 'LOSS', key: 'loss', align: 'end'},
  { title: 'MACHINE ALLOWANCE', key: 'machine_allowance', align: 'end'},
  { title: 'OTHER DEDUCTION 1', key: 'other_deductions_1', align: 'end'},
  { title: 'OTHER DEDUCTION 2', key: 'other_deductions_2', align: 'end'},
  { title: 'OTHER INCOME 1', key: 'other_income_1', align: 'end'},
  { title: 'OVERTIME HOURS', key: 'overtime_hours', align: 'end'},
  { title: 'OVERTIME PAY', key: 'overtime_pay', align: 'end'},
  { title: 'PENALTY', key: 'penalty', align: 'end'},
  { title: 'PHONE ALLOWANCE', key: 'phone_allowance', align: 'end'},
  { title: 'PHONE DEDUCTION', key: 'phone_deduction', align: 'end'},
  { title: 'POSITION ALLOWANCE', key: 'position_allowance', align: 'end'},
  { title: 'PREMIUM', key: 'premium', align: 'end'},
  { title: 'SALARY INCREASE', key: 'salary_increase', align: 'end'},
  { title: 'SAVINGS', key: 'savings', align: 'end'},
  { title: 'SHIFT 3', key: 'shift_3', align: 'end'},
  { title: 'SIM', key: 'sim', align: 'end'},
  { title: 'SKILL ALLOWANCE', key: 'skill_allowance', align: 'end'},
  { title: 'STAMP DUTY', key: 'stamp_duty', align: 'end'},
  { title: 'TENURE ALLOWANCE', key: 'tenure_allowance', align: 'end'},
  { title: 'TENURE BONUS', key: 'tenure_bonus', align: 'end'},
  { title: 'TOTAL DEDUCTIONS', key: 'total_deductions', align: 'end'},
  { title: 'TOTAL OTHER INCOME', key: 'total_other_income', align: 'end'},
  { title: 'TRAINING SHIRT', key: 'training_shirt', align: 'end'},
  { title: 'TRANSPORTATION ALLOWANCE', key: 'transportation_allowance', align: 'end'},
  { title: 'UNIFORM', key: 'uniform', align: 'end'},
  { title: 'WORK ON DAY OFF', key: 'work_on_day_off', align: 'end'},
  { title: 'WORKDAY BONUS', key: 'workday_bonus', align: 'end'},
  { title: 'BPJS KESEHATAN', key: 'bpjs_kesehatan', align: 'end'},
  { title: 'BPJS TK', key: 'bpjs_tk', align: 'end'},
])

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


const searchQuery = ref('')
const findHandler = () => {
  args.find = searchQuery.value
}
const clearHandler = () => {
  args.find = ''
}

const updateOptions = options => {
  args.sort_by = options.sortBy[0]?.key || 'created_at'
  args.sort_order = options.sortBy[0]?.order || 'desc'
}

const selectedFile = ref(null)
const fileInput = ref(null)
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const uploadExcelHandler = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  selectedFile.value = file

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const response = await axiosIns.post('/salaries/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    fetchData()
    toast.success('Berhasil', 'File berhasil diupload!', 'success')
  } catch (error) {
    toast.error('Gagal', 'Gagal upload file.', 'error')
    console.error(error)
  }
}

const paginationData = computed(() => {
    return `Showing ${meta.from} to ${meta.to} of ${meta.total}`;
});
</script>

<template>
  <div>
    <MasterKeyDialog
    v-if="!dialogDone.masterKey"
    @close="handleDialogClosed"
  />

  <div v-if="dialogDone.masterKey">
    <VCard>
      <VCardText>
        <VRow class="d-flex flex-wrap align-center">
          <VCol cols="12" sm="2" style="max-width: 120px; width: 120px;">
            <VSelect v-model="meta.per_page" variant="outlined" :items="[10, 20, 30, 50]" />
          </VCol>
          
          <VCol class="d-flex flex-wrap gap-4">
            <VTextField placeholder="Find .." v-model="searchQuery" clearable @keyup.enter="findHandler"
              @click:clear="clearHandler" prepend-inner-icon="tabler:search" />
              <div>
              <input 
              ref="fileInput" type="file"
              accept=".xlsx, .xls"
              @change="uploadExcelHandler"
              style="display: none"  />
              </div>
            <VBtn variant="outlined" prepend-icon="mdi-upload" @click="triggerFileUpload">Upload</VBtn>
          </VCol>
        </VRow>
        <VRow class="d-flex flex-wrap align-center mt-3">
          <VCol cols="12" sm="2">
            <VSelect
              v-model="args.month"
              variant="outlined"
              :items="months"
              label="Select Month"
              item-title="label"
              clearable
              item-value="value"
              />
            </VCol>
            <VCol cols="12" sm="2">
              <VSelect
                label="Select Year"
                v-model="args.year"
                :items="yearOptions"
                density="compact"
                clearable
                :rules="[requiredValidator]"
              />
           </VCol>
            <VCol cols="12" sm="2">
              <VSelect
                label="Select Organization"
                v-model="orgId"
                :items="organizations"
                clearable
                item-title="name"
                item-value="id"
                density="compact"
                :rules="[requiredValidator]"
              />
           </VCol>
        </VRow>
      </VCardText>
      <VDivider />
      <VDataTableServer :items="dataset" :headers="headers" item-value="id" :loading="waiting"
        @update:options="updateOptions" class="text-no-wrap">
        <template #item.base_salary="{ item }">
          {{ formatUang(item.base_salary) }}
        </template>

        <template #item.daily_wage="{ item }">
          {{ formatUang(item.daily_wage) }}
        </template>

        <template #item.gross="{ item }">
          {{ formatUang(item.gross) }}
        </template>

        <template #item.h1="{ item }">
          {{ formatUang(item.h1) }}
        </template>

        <template #item.holiday_pay="{ item }">
          {{ formatUang(item.holiday_pay) }}
        </template>

        <template #item.overtime_hours="{ item }">
          {{ formatUang(item.overtime_hours) }}
        </template>

        <template #item.shift_3="{ item }">
          {{ formatUang(item.shift_3) }}
        </template>

        <template #item.netpay="{ item }">
          {{ formatUang(item.netpay) }}
        </template>

        <template #item.absence_deduction="{ item }">
          {{ formatUang(item.absence_deduction) }}
        </template>

        <template #item.complaint_deduction="{ item }">
          {{ formatUang(item.complaint_deduction) }}
        </template>

        <template #item.continuation_bonus="{ item }">
          {{ formatUang(item.continuation_bonus) }}
        </template>

        <template #item.extra="{ item }">
          {{ formatUang(item.extra) }}
        </template>

        <template #item.leave_allowance="{ item }">
          {{ formatUang(item.leave_allowance) }}
        </template>

        <template #item.long_shift="{ item }">
          {{ formatUang(item.long_shift) }}
        </template>

        <template #item.loss="{ item }">
          {{ formatUang(item.loss) }}
        </template>

        <template #item.machine_allowance="{ item }">
          {{ formatUang(item.machine_allowance) }}
        </template>

        <template #item.other_deductions_1="{ item }">
          {{ formatUang(item.other_deductions_1) }}
        </template>

        <template #item.other_deductions_2="{ item }">
          {{ formatUang(item.other_deductions_2) }}
        </template>

        <template #item.other_income_1="{ item }">
          {{ formatUang(item.other_income_1) }}
        </template>

        <template #item.overtime_pay="{ item }">
          {{ formatUang(item.overtime_pay) }}
        </template>

        <template #item.penalty="{ item }">
          {{ formatUang(item.penalty) }}
        </template>

        <template #item.phone_allowance="{ item }">
          {{ formatUang(item.phone_allowance) }}
        </template>

        <template #item.phone_deduction="{ item }">
          {{ formatUang(item.phone_deduction) }}
        </template>

        <template #item.position_allowance="{ item }">
          {{ formatUang(item.position_allowance) }}
        </template>

        <template #item.premium="{ item }">
          {{ formatUang(item.premium) }}
        </template>

        <template #item.salary_increase="{ item }">
          {{ formatUang(item.salary_increase) }}
        </template>

        <template #item.savings="{ item }">
          {{ formatUang(item.savings) }}
        </template>

        <template #item.skill_allowance="{ item }">
          {{ formatUang(item.skill_allowance) }}
        </template>

        <template #item.stamp_duty="{ item }">
          {{ formatUang(item.stamp_duty) }}
        </template>

        <template #item.tenure_allowance="{ item }">
          {{ formatUang(item.tenure_allowance) }}
        </template>

        <template #item.tenure_bonus="{ item }">
          {{ formatUang(item.tenure_bonus) }}
        </template>

        <template #item.total_deductions="{ item }">
          {{ formatUang(item.total_deductions) }}
        </template>

        <template #item.total_other_income="{ item }">
          {{ formatUang(item.total_other_income) }}
        </template>

        <template #item.training_shirt="{ item }">
          {{ formatUang(item.training_shirt) }}
        </template>

        <template #item.transportation_allowance="{ item }">
          {{ formatUang(item.transportation_allowance) }}
        </template>

        <template #item.uniform="{ item }">
          {{ formatUang(item.uniform) }}
        </template>

        <template #item.work_on_day_off="{ item }">
          {{ formatUang(item.work_on_day_off) }}
        </template>

        <template #item.workday_bonus="{ item }">
          {{ formatUang(item.workday_bonus) }}
        </template>

        <template #item.bpjs_kesehatan="{ item }">
          {{ formatUang(item.bpjs_kesehatan) }}
        </template>

        <template #item.bpjs_tk="{ item }">
          {{ formatUang(item.bpjs_tk) }}
        </template>

        <template #bottom>
          <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4">
            <span class="text-sm text-disabled">
              {{ paginationData }}
            </span>
            <VPagination v-model="meta.current_page" variant="outlined" size="small" :length="meta.last" :total-visible="5" />
          </VCardText>
        </template>
      </VDataTableServer>
    </VCard>
  </div>
  </div>
</template>

<route lang="yaml">
  meta:
    action: Manage
    subject: Salary
    redirectIfLoggedIn: false
</route>
