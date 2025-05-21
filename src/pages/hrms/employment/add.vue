<script setup>
import { betweenValidator, requiredValidator } from '@/@core/utils/validators'
import axiosIns from '@/plugins/axios'
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import Employee from '@/pages/hrms/employment/employee.vue'

const toast = useToast()

const prop = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['status'])

const employee_id = ref()
const employee_name = ref()
const showEmployeeSelect = ref(true)

const organization_id = ref()
const job_level = ref()
const job_position = ref()
const from_date = ref()
const to_date = ref()
const is_active = ref(1)

const organizations = ref([])
const jobLevels = ref([])
const jobPositions = ref([])

const close = (isVisible = false, isOk = false) => {
  resetForm()
  emit('status', { isVisible, isOk })
}

const fetchOptions = async () => {
  try {
    const [orgRes, levelRes, positionRes] = await Promise.all([
      axiosIns.get('/organizations'),
      axiosIns.get('/job-levels'),
      axiosIns.get('/job-positions'),
    ])
    organizations.value = orgRes.data.data
    jobLevels.value = levelRes.data.data
    jobPositions.value = positionRes.data.data
  } catch (error) {
    console.error(error)
    toast.error('Failed to load select options')
  }
}

const payload = reactive({
  employee_id:employee_id,
  organization_id:organization_id,
  job_level:job_level,
  job_position:job_position,
  from_date:from_date,
  to_date:to_date,
  is_active:is_active
})

const resetForm = () => {
  employee_id.value = null
  organization_id.value = null
  job_level.value = null
  job_position.value = null
  from_date.value = null
  to_date.value = null
  is_active.value = 1
}

const showLoading = ref(false)

const createData = async () => {
  showLoading.value = true
  try {

    await axiosIns.post('/employments', {...payload})
    close(false, true)
  } catch (error) {
    console.error(error)
    toast.error('Saving failed! Error: ' + error.message)
  } finally {
    showLoading.value = false
  }
}

const addForm = ref()

const onSubmit = () => {
  addForm.value?.validate().then(({valid: isValid})=>{
    if(isValid) createData()
  })
}

const getEmployee = val => {
  employee_id.value = val.id
  employee_name.value = val.name
  organization_id.value = val.organization_id
  job_level.value = val.job_level
  job_position.value = val.job_position
}

// Mount
onMounted(() => {
  fetchOptions()
})
</script>

<template>
  <VDialog v-model="prop.isVisible" width="800">
    <VForm ref="addForm" @submit.prevent="onSubmit">
      <VCard :loading="showLoading">
        <VCardTitle class="d-flex justify-space-between">
          <VLabel>Employment - Add</VLabel>
          <VBtn icon="tabler-x" variant="text" size="x-small" @click="close()" color="error" />
        </VCardTitle>
        <VDivider />

        <VCardText>
          <VRow>
            <VCol cols="6" class="d-flex gap-3">
              <VTextField
                label="Employee Name"
                v-model="employee_name"
                readonly
                :rules="[requiredValidator]"
              />
              <Employee @employee="getEmployee" />
            </VCol>
            <VCol cols="6">
              <VSelect
                v-model="organization_id"
                :items="organizations"
                item-title="name"
                item-value="id"
                label="Organization"
                :rules="[requiredValidator]"
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="6">
              <VSelect
                v-model="job_level"
                :items="jobLevels"
                item-title="name"
                item-value="id"
                label="Job Level"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="6">
              <VSelect
                v-model="job_position"
                :items="jobPositions"
                item-title="name"
                item-value="id"
                label="Job Position"
                :rules="[requiredValidator]"
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="6">
              <VTextField
                label="From Date"
                type="date"
                v-model="from_date"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                label="To Date"
                type="date"
                v-model="to_date"
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="6">
              <VSwitch
                v-model="is_active"
                label="Is Active"
                :true-value="1"
                :false-value="0"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end gap-4">
          <VBtn @click="close(false, false)" color="warning" variant="outlined" :loading="showLoading">
            Cancel
          </VBtn>
          <VBtn type="submit" color="success" variant="outlined" :loading="showLoading">
            Save
          </VBtn>
        </VCardText>
      </VCard>
    </VForm>
  </VDialog>
</template>


<route lang="yaml">
  meta:
    action: read,
    subject: Auth
    redirectIfLoggedIn: false
</route>
