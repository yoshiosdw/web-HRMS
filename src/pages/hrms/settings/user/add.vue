<script setup>
import axiosIns from '@/plugins/axios'
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { requiredValidator } from '@/@core/utils/validators'
import Employee from '@/pages/hrms/employment/employee.vue'

const toast = useToast()

const prop = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['status'])

const username = ref()
const employee_id = ref()
const employee_name = ref()
const role_id = ref()
const password = ref()
const password_confirmation = ref()

const roles = ref([])
const showLoading = ref(false)

const getEmployee = emp => {
  employee_id.value = emp.id
  employee_name.value = emp.name
}

const fetchRoles = async () => {
  try {
    const res = await axiosIns.get('/roles')
    roles.value = res.data.data
  } catch (err) {
    console.error(err)
    toast.error('Failed to fetch roles')
  }
}

const resetForm = () => {
  username.value = null
  employee_id.value = null
  employee_name.value = null
  role_id.value = null
  password.value = null
  password_confirmation.value = null
}

const close = (isVisible = false, isOk = false) => {
  resetForm()
  emit('status', { isVisible, isOk })
}

const addForm = ref()

const onSubmit = () => {
  addForm.value?.validate().then(({ valid }) => {
    if (valid) createUserAndAssignRole()
  })
}

const createUserAndAssignRole = async () => {
  showLoading.value = true
  try {
    const registerResponse = await axiosIns.post('/register', {
      username: username.value,
      employee_id: employee_id.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    })

    const userId = registerResponse.data.data.id

    await axiosIns.post('/roles/asign/user', {
      user_id: userId,
      role: role_id.value,
    })

    toast.success('User created and role assigned successfully')
    close(false, true)
  } catch (err) {
    console.error(err)

    const responseMessage = err.response?.data?.message

    if (responseMessage && typeof responseMessage === 'object') {
      const messages = Object.entries(responseMessage)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
        .join('\n')
      toast.error(messages)
    } else {
      toast.error('Failed to create user or assign role: ' + (responseMessage || err.message))
    }
  } finally {
    showLoading.value = false
  }
}


onMounted(() => {
  fetchRoles()
})
</script>


<template>
  <VDialog v-model="prop.isVisible" width="800">
    <VForm ref="addForm" @submit.prevent="onSubmit">
      <VCard :loading="showLoading">
        <VCardTitle class="d-flex justify-space-between">
          <VLabel>User - Add</VLabel>
          <VBtn icon="tabler-x" variant="text" size="x-small" @click="close()" color="error" />
        </VCardTitle>
        <VDivider />

        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField label="Username" v-model="username" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="6" class="d-flex gap-3">
              <VTextField
                label="Employee"
                v-model="employee_name"
                readonly
                :rules="[requiredValidator]"
              />
              <Employee @employee="getEmployee" />
            </VCol>
            <VCol cols="6">
              <VSelect
                v-model="role_id"
                :items="roles"
                item-title="name"
                item-value="id"
                label="Role"
                :rules="[requiredValidator]"
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="6">
              <VTextField
                label="Password"
                type="password"
                v-model="password"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                label="Confirm Password"
                type="password"
                v-model="password_confirmation"
                :rules="[requiredValidator, val => val === password || 'Passwords do not match']"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end gap-4">
          <VBtn @click="close()" color="warning" variant="outlined" :loading="showLoading">Cancel</VBtn>
          <VBtn type="submit" color="success" variant="outlined" :loading="showLoading">Save</VBtn>
        </VCardText>
      </VCard>
    </VForm>
  </VDialog>
</template>

<route lang="yaml">
meta:
  action: create
  subject: User
  redirectIfLoggedIn: false
</route>
