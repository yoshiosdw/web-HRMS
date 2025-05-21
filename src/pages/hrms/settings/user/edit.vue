<script setup>
import { ref, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axiosIns from '@/plugins/axios'
import { requiredValidator } from '@/@core/utils/validators'
import Employee from '@/pages/hrms/employment/employee.vue'
import { isEmpty } from '@/@core/utils'

const toast = useToast()

const prop = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['status'])

const formEdit = ref()
const showLoading = ref(false)

const user_id = ref(null)
const username = ref('')
const employee_id = ref(null)
const employee_name = ref('')
const role_id = ref(null)

const roles = ref([])

const initPayload = () => {
  user_id.value = prop.data?.id || null
  username.value = prop.data?.username || ''
  employee_id.value = prop.data?.employee_id || null
  employee_name.value = prop.data?.employee?.name || ''
  role_id.value = prop.data?.roles?.[0]?.id || null
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

const close = (isVisible = false, isOk = false) => {
  emit('status', { isVisible, isOk })
}

const onSubmit = () => {
  formEdit.value?.validate().then(({ valid }) => {
    if (valid) updateUser()
  })
}

const updateUser = async () => {
  showLoading.value = true
  try {
    // 1. Update user
    await axiosIns.patch(`/users/${user_id.value}`, {
      username: username.value,
      employee_id: employee_id.value,
    })

    // 2. Update role
    await axiosIns.post('/roles/asign/user', {
      user_id: user_id.value,
      role: role_id.value,
    })

    toast.success('User updated successfully')
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
      toast.error('Failed to update user: ' + (responseMessage || err.message))
    }
  } finally {
    showLoading.value = false
  }
}

const getEmployee = emp => {
  employee_id.value = emp.id
  employee_name.value = emp.name
}

watch(() => prop.data, val => {
  if (!isEmpty(val)) initPayload()
})

onMounted(() => {
  fetchRoles()
})
</script>

<template>
  <VDialog v-model="prop.isVisible" width="800">
    <VForm ref="formEdit" @submit.prevent="onSubmit">
      <VCard :loading="showLoading">
        <VCardTitle class="d-flex justify-space-between">
          <VLabel>User - Edit</VLabel>
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
        </VCardText>

        <VCardText class="d-flex justify-end gap-4">
          <VBtn @click="close()" color="warning" variant="outlined" :loading="showLoading">
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
  action: update
  subject: User
  redirectIfLoggedIn: false
</route>
