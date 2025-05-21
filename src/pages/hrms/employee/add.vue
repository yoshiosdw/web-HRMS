<script setup>
import { ref, reactive, watch } from 'vue'
import { useToast } from 'vue-toastification'
import axiosIns from '@/plugins/axios'
import { requiredValidator } from '@/@core/utils/validators'

const toast = useToast()

const prop = defineProps({
  isVisible: Boolean,
})

const emit = defineEmits(['status'])

const step = ref(1)
const addEmployeeForm = ref()
const addUserForm = ref()
const showLoading = ref(false)

const employmentStatusList = ref([])
const organizationList = ref([])
const jobLevelList = ref([])
const jobPositionList = ref([])
const roles = ref([])

const createdEmployee = ref(null)

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

const username = ref(null)
const employee_id = ref(null)
const employee_name = ref(null)
const role_id = ref(null)
const password = ref(null)
const password_confirmation = ref(null)
const isPasswordVisible = ref(false)
const isConfPasswordVisible = ref(false)

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

const resetAll = () => {
  identity_number.value = null
  badge_number.value = null
  name.value = null
  gender.value = null
  phone_number.value = null
  alternate_phone_number.value = null
  email.value = null
  employment_status_id.value = null
  organization_id.value = null
  job_level.value = null
  job_position.value = null
  is_active.value = true

  username.value = null
  role_id.value = null
  password.value = null
  password_confirmation.value = null

  createdEmployee.value = null
  step.value = 1
}

const close = (isVisible = false, isOk = false) => {
  resetAll()
  emit('status', { isVisible, isOk })
}

const fetchData = async () => {
  try {
    const [employmentStatusRes, organizationRes, jobLevelRes, jobPositionRes, rolesRes] = await Promise.all([
      axiosIns.get('/employment/statuses'),
      axiosIns.get('/organizations'),
      axiosIns.get('/job-levels'),
      axiosIns.get('/job-positions'),
      axiosIns.get('/roles'),
    ])

    employmentStatusList.value = employmentStatusRes.data.data
    organizationList.value = organizationRes.data.data
    jobLevelList.value = jobLevelRes.data.data
    jobPositionList.value = jobPositionRes.data.data
    roles.value = rolesRes.data.data
  } catch (err) {
    console.error(err)
    toast.error('Gagal memuat data referensi')
  }
}

const onSubmitEmployee = () => {
  addEmployeeForm.value?.validate().then(({ valid }) => {
    if (valid) {
      username.value = identity_number.value
      password.value = 'Lbg@1080*'
      password_confirmation.value = 'Lbg@1080*'
      employee_name.value = name.value
      step.value = 2
    }
  })
}

const createUser = async () => {
  showLoading.value = true
  try {
    const employeeRes = await axiosIns.post('/employees', { ...payload })
    const createdEmp = employeeRes.data.data
    employee_id.value = createdEmp.id
    employee_name.value = createdEmp.name

    const registerRes = await axiosIns.post('/register', {
      username: username.value,
      employee_id: employee_id.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    })

    const userId = registerRes.data.data.id

    await axiosIns.post('/roles/asign/user', {
      user_id: userId,
      role: role_id.value,
    })

    toast.success('User & Employee berhasil dibuat')
    close(false, true)
  } catch (err) {
    const msg = err.response?.data?.message
    if (msg && typeof msg === 'object') {
      const messages = Object.entries(msg)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
        .join('\n')
      toast.error(messages)
    } else {
      toast.error('Gagal membuat user: ' + (msg || err.message))
    }
  } finally {
    showLoading.value = false
  }
}

const emailValidator = val => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(val) || 'Format email tidak valid'
}

const onSubmitUser = () => {
  addUserForm.value?.validate().then(({ valid }) => {
    if (valid) createUser()
  })
}

watch(() => prop.isVisible, (val) => {
  if (val) fetchData()
});
</script>

<template>
  <VDialog v-model="prop.isVisible" width="1024" persistent>
    <template v-if="step === 1">
      <VForm ref="addEmployeeForm" @submit.prevent="onSubmitEmployee">
        <VCard :loading="showLoading">
          <VCardTitle class="d-flex justify-space-between">
            <VLabel>Step 1: Add Employee</VLabel>
            <VBtn icon="tabler-x" variant="text" size="x-small" @click="close()" color="error" />
          </VCardTitle>
          <VDivider />
          <VCardText>
            <VRow>
              <VCol cols="2"><VTextField label="NIK" v-model="identity_number" :rules="[requiredValidator]" /></VCol>
              <VCol cols="2"><VTextField label="Badge Number" v-model="badge_number" /></VCol>
              <VCol cols="8"><VTextField label="Name" v-model="name" :rules="[requiredValidator]" /></VCol>
            </VRow>
            <VRow>
              <VCol cols="4"><VTextField label="Email" v-model="email" :rules="[requiredValidator, emailValidator]" /></VCol>
              <VCol cols="4"><VTextField label="Phone Number" v-model="phone_number" type="number" /></VCol>
              <VCol cols="4"><VTextField label="Alternate Phone Number" v-model="alternate_phone_number" type="number" /></VCol>
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
            <VBtn @click="close()" color="warning" variant="outlined" :loading="showLoading">Cancel</VBtn>
            <VBtn type="submit" color="success" variant="outlined" :loading="showLoading">Next</VBtn>
          </VCardText>
        </VCard>
      </VForm>
    </template>

    <template v-if="step === 2">
      <VForm ref="addUserForm" @submit.prevent="onSubmitUser">
        <VCard :loading="showLoading">
          <VCardTitle class="d-flex justify-space-between">
            <VLabel>Step 2: Create User</VLabel>
            <VBtn icon="tabler-x" variant="text" size="x-small" @click="close()" color="error" />
          </VCardTitle>
          <VDivider />
          <VCardText>
            <VRow>
              <VCol cols="12"><VTextField label="Employee" :model-value="employee_name" readonly /></VCol>
              <VCol cols="6">
                <VTextField
                  label="Username"
                  v-model="username"
                  :rules="[requiredValidator]"
                  hint="Default: NIK"
                  persistent-hint
                />
              </VCol>
              <VCol cols="6">
                <VSelect v-model="role_id" :items="roles" item-title="name" item-value="id" label="Role" :rules="[requiredValidator]" />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="6">
                <VTextField
                  label="Password"
                  v-model="password"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  hint="Default: Lbg@1080*"
                  persistent-hint
                />
              </VCol>
              <VCol cols="6">
                <VTextField
                  label="Confirm Password"
                  v-model="password_confirmation"
                  :rules="[requiredValidator, val => val === password || 'Passwords do not match']"
                  :type="isConfPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isConfPasswordVisible = !isConfPasswordVisible"
                />
              </VCol>
            </VRow>
          </VCardText>
          <VCardText class="d-flex justify-space-between">
            <VBtn @click="step = 1" variant="outlined">Back</VBtn>
            <VBtn type="submit" color="success" variant="outlined" :loading="showLoading">Save</VBtn>
          </VCardText>
        </VCard>
      </VForm>
    </template>
  </VDialog>
</template>

<route lang="yaml">
    meta:
      action: Manage,
      subject: Employee
      redirectIfLoggedIn: false
</route>
