<script setup>
import { ref, reactive, watch } from 'vue'
import { useToast } from 'vue-toastification'
import axiosIns from '@/plugins/axios'
import { requiredValidator } from '@/@core/utils/validators'
import { isEmpty } from '@/@core/utils'

const toast = useToast()

const prop = defineProps({
  isVisible: Boolean,
  data: Object,
})

const emit = defineEmits(['status'])

const showLoading = ref(false)
const formEdit = ref()

// Select Options
const employmentStatusList = ref([])
const organizationList = ref([])
const jobLevelList = ref([])
const jobPositionList = ref([])

// Employee Fields
const id = ref()
const identity_number = ref()
const badge_number = ref()
const name = ref()
const gender = ref()
const phone_number = ref()
const alternate_phone_number = ref()
const email = ref()
const employment_status_id = ref()
const organization_id = ref()
const job_level = ref()
const job_position = ref()
const is_active = ref(true)

const payload = reactive({
  identity_number,
  badge_number,
  name,
  gender,
  phone_number,
  alternate_phone_number,
  email,
  employment_status_id,
  organization_id,
  job_level,
  job_position,
  get is_active() {
    return is_active.value ? 1 : 0
  },
})

const fetchData = async () => {
  try {
    const [employmentStatusRes, organizationRes, jobLevelRes, jobPositionRes] = await Promise.all([
      axiosIns.get('/employment/statuses'),
      axiosIns.get('/organizations'),
      axiosIns.get('/job-levels'),
      axiosIns.get('/job-positions'),
    ])
    employmentStatusList.value = employmentStatusRes.data.data
    organizationList.value = organizationRes.data.data
    jobLevelList.value = jobLevelRes.data.data
    jobPositionList.value = jobPositionRes.data.data
  } catch (err) {
    toast.error('Gagal memuat data referensi')
  }
}

const initPayload = () => {
  const emp = prop.data
  id.value = emp.id
  identity_number.value = emp.identity_number
  badge_number.value = emp.badge_number
  name.value = emp.name
  gender.value = emp.gender
  phone_number.value = emp.phone_number
  alternate_phone_number.value = emp.alternate_phone_number
  email.value = emp.email
  employment_status_id.value = emp.employment_status_id
  organization_id.value = emp.organization_id
  job_level.value = emp.job_level
  job_position.value = emp.job_position
  is_active.value = Boolean(emp.is_active)
}

const close = (isVisible = false, isOk = false) => {
  emit('status', { isVisible, isOk })
}

const onSubmitEmployee = () => {
  formEdit.value?.validate().then(({ valid }) => {
    if (valid) updateEmployee()
  })
}

const updateEmployee = async () => {
  showLoading.value = true
  try {
    await axiosIns.patch(`/employees/${id.value}`, { ...payload })
    toast.success('Data berhasil diperbarui')
    close(false, true)
  } catch (error) {
    toast.error('Gagal menyimpan employee: ' + error.message)
  } finally {
    showLoading.value = false
  }
}

const emailValidator = val => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(val) || 'Format email tidak valid'
}

watch(() => prop.isVisible, (val) => {
  if (val) {
    fetchData()
    if (!isEmpty(prop.data)) {
      initPayload()
    }
  }
})
</script>

<template>
  <VDialog v-model="prop.isVisible" width="1024" persistent>
    <VForm ref="formEdit" @submit.prevent="onSubmitEmployee">
      <VCard :loading="showLoading">
        <VCardTitle class="d-flex justify-space-between">
          <VLabel>Edit Employee</VLabel>
          <VBtn icon="tabler-x" variant="text" @click="close()" color="error" />
        </VCardTitle>
        <VDivider />
        <VCardText>
          <VRow>
            <VCol cols="4"><VTextField label="NIK" v-model="identity_number" :rules="[requiredValidator]" /></VCol>
            <VCol cols="3"><VTextField label="Badge Number" v-model="badge_number" /></VCol>
            <VCol cols="5"><VTextField label="Name" v-model="name" :rules="[requiredValidator]" /></VCol>
          </VRow>
          <VRow>
            <VCol cols="4"><VTextField label="Email" v-model="email" :rules="[requiredValidator, emailValidator]"/></VCol>
            <VCol cols="4"><VTextField label="Phone Number" v-model="phone_number" /></VCol>
            <VCol cols="4"><VTextField label="Alternate Phone Number" v-model="alternate_phone_number" /></VCol>
          </VRow>
          <VRow>
            <VCol cols="3">
              <VSelect v-model="gender" :items="['Male', 'Female']" label="Gender" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="4">
              <VSelect v-model="employment_status_id" :items="employmentStatusList" item-title="name" item-value="id" label="Employment Status" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="5">
              <VSelect v-model="organization_id" :items="organizationList" item-title="name" item-value="id" label="Organization" :rules="[requiredValidator]" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="3">
              <VSelect v-model="job_level" :items="jobLevelList" item-title="name" item-value="id" label="Job Level" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="7">
              <VAutocomplete v-model="job_position" :items="jobPositionList" item-title="name" item-value="id" label="Job Position" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="2">
              <VSwitch v-model="is_active" label="Is Active" />
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end gap-4">
          <VBtn @click="close()" color="warning" variant="outlined">Cancel</VBtn>
          <VBtn type="submit" color="success" variant="outlined" :loading="showLoading">Save</VBtn>
        </VCardText>
      </VCard>
    </VForm>
  </VDialog>
</template>

<route lang="yaml">
meta:
  action: read
  subject: Auth
  redirectIfLoggedIn: false
</route>
