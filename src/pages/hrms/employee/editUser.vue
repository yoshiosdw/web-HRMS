<script setup>
import axiosIns from '@/plugins/axios'
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { requiredValidator } from '@/@core/utils/validators'

const toast = useToast()

const props = defineProps({
  isVisible: Boolean,
  userId: Number,
  usernameProp: String,
})

const emit = defineEmits(['status'])

const username = ref('')
const role_id = ref(null)
const roles = ref([])
const loading = ref(false)
const formRef = ref()

const fetchRoles = async () => {
  try {
    const res = await axiosIns.get('/roles')
    roles.value = res.data.data
  } catch (err) {
    console.error(err)
    toast.error('Gagal memuat daftar role')
  }
}

const close = (isVisible = false, isOk = false) => {
  emit('status', { isVisible, isOk })
}

const onSubmit = () => {
  formRef.value?.validate().then(({ valid }) => {
    if (valid) updateUserRole()
  })
}

const updateUserRole = async () => {
  loading.value = true
  try {
    await axiosIns.patch(`/users/role/${props.userId}`, {
      username: username.value,
      role: role_id.value,
    })
    toast.success('User berhasil diperbarui')
    close(false, true)
  } catch (err) {
    const msg = err.response?.data?.message || err.message
    toast.error('Gagal memperbarui user: ' + msg)
  } finally {
    loading.value = false
  }
}

// Inisialisasi saat dialog dibuka
watch(() => props.isVisible, val => {
  if (val) {
    username.value = props.usernameProp || ''
    role_id.value = null
    fetchRoles()
  }
})
</script>

<template>
  <VDialog v-model="props.isVisible" width="500">
    <VForm ref="formRef" @submit.prevent="onSubmit">
      <VCard :loading="loading">
        <VCardTitle class="d-flex justify-space-between">
          <span>Edit User</span>
          <VBtn icon="tabler-x" variant="text" size="x-small" @click="close()" color="error" />
        </VCardTitle>

        <VDivider />

        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                label="Username"
                v-model="username"
                :rules="[requiredValidator]"
                readonly
              />
            </VCol>
            
            <VCol cols="12">
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

        <VCardActions class="d-flex justify-end gap-4">
          <VBtn @click="close()" variant="outlined" color="warning" :loading="loading">Cancel</VBtn>
          <VBtn type="submit" variant="flat" color="primary" :loading="loading">Save</VBtn>
        </VCardActions>
      </VCard>
    </VForm>
  </VDialog>
</template>


<route lang="yaml">
meta:
  action: Manage
  subject: Employee
</route>
