<script setup>
import { ref, onMounted, watch } from 'vue'
import { requiredValidator } from '@/@core/utils/validators'
import axiosIns from '@/plugins/axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  isVisible: Boolean,
  mode: { type: String, default: 'add' },
  roleData: { type: Object, default: () => null },
})

const emit = defineEmits(['status'])

const roleName = ref('')
const selectedPermissions = ref([])
const permissions = ref([])
const filteredPermissions = ref([])
const searchPermission = ref('')
const isSaved = ref(false)
const showLoading = ref(false)
const roleId = ref(null)

const resetForm = () => {
  roleName.value = ''
  selectedPermissions.value = []
  isSaved.value = false
  roleId.value = null
  searchPermission.value = ''
}

const close = (isVisible = false, isOk = false) => {
  resetForm()
  emit('status', { isVisible, isOk })
}

const fetchPermissions = async () => {
  try {
    const response = await axiosIns.get('/permissions')
    permissions.value = response.data.data ?? []
    filteredPermissions.value = permissions.value
  } catch (error) {
    toast.error('Gagal memuat permissions. Error: ' + error.message)
  }
}

const createRole = async () => {
  showLoading.value = true
  try {
    const ret = await axiosIns.post('/roles', { name: roleName.value })
    roleId.value = ret.data.data.id
    isSaved.value = true
  } catch (error) {
    toast.error('Gagal membuat role. Error: ' + error.message)
  } finally {
    showLoading.value = false
  }
}

const updateRoleAndSyncPermissions = async () => {
  showLoading.value = true
  try {
    await updateRole()
    await syncPermission()

  } catch (error) {
    toast.error('Gagal memperbarui role dan permissions. Error: ' + error.message)
  } finally {
    showLoading.value = false
  }
}


const updateRole = async () => {
  showLoading.value = true
  try {
    const response = await axiosIns.patch(`/roles/${roleId.value}`, { name: roleName.value })
    roleId.value = response.data.data.id 
    isSaved.value = true
  } catch (error) {
    toast.error('Gagal update role. Error: ' + error.message)
  } finally {
    showLoading.value = false
  }
}

const syncPermission = async () => {
  showLoading.value = true
  try {
    await axiosIns.post('/roles/permission/sync', {
      role: roleId.value,
      permissions: selectedPermissions.value,
    })
    close(false, true)
  } catch (error) {
    toast.error('Set permission failed. Error: ' + error.message)
  } finally {
    showLoading.value = false
  }
}

const addForm = ref()
const onSubmit = () => {
  addForm.value?.validate().then(async ({ valid }) => {
    if (!valid) return

    if (props.mode === 'add') {
      await createRole()
    } else if (props.mode === 'edit') {
      await updateRole()
    }
  })
}

watch(
  () => props.isVisible,
  (val) => {
    if (val && props.mode === 'edit' && props.roleData) {
      roleId.value = props.roleData.id
      roleName.value = props.roleData.name
      selectedPermissions.value = props.roleData.permissions?.map(p => p.name) || []
      isSaved.value = true
    } else {
      resetForm()
    }
  }
)

watch(searchPermission, () => {
  const keyword = searchPermission.value.toLowerCase()
  filteredPermissions.value = permissions.value.filter(p =>
    p.feature.toLowerCase().includes(keyword) || p.access.toLowerCase().includes(keyword)
  )
})

onMounted(fetchPermissions)
</script>

<template>
  <VDialog v-model="props.isVisible" width="800">
    <VForm ref="addForm" @submit.prevent="onSubmit">
      <VCard :loading="showLoading">
        <VCardTitle class="d-flex justify-space-between">
          <VLabel>Role - {{ props.mode === 'edit' ? 'Edit' : 'Add' }}</VLabel>
          <VBtn icon="tabler-x" variant="text" size="x-small" @click="close()" color="error" />
        </VCardTitle>

        <VDivider />

        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="roleName"
                label="Role Name"
                :rules="[requiredValidator]"
              />
            </VCol>
          </VRow>

          <VRow v-if="isSaved">
            <VCol cols="12">
              <h4 class="mb-4">Permissions</h4>

              <VTextField
                v-model="searchPermission"
                placeholder="Search Permissions"
                prepend-inner-icon="tabler-search"
                class="mb-3"
              />
              <div style="max-height: 250px; overflow-y: auto;">
              <VTable class="text-no-wrap">
                <thead class="text-uppercase">
                  <tr>
                    <th>Select</th>
                    <th>Feature</th>
                    <th>Action</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="permission in filteredPermissions" :key="permission.id">
                    <td>
                      <VCheckbox
                        :value="permission.name"
                        v-model="selectedPermissions"
                      />
                    </td>
                    <td>{{ permission.feature }}</td>
                    <td>{{ permission.access }}</td>
                    <td>{{ permission.description }}</td>
                  </tr>
                </tbody>
              </VTable>
              </div>
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end gap-4">
          <VBtn @click="close(false, false)" color="warning" variant="outlined" :loading="showLoading">
            Cancel
          </VBtn>
          <VBtn v-if="!isSaved" type="submit" color="success" variant="outlined" :loading="showLoading">
            Save
          </VBtn>
          <VBtn v-if="isSaved" @click="updateRoleAndSyncPermissions" color="primary" variant="outlined" :loading="showLoading">
            Update
          </VBtn>
        </VCardText>
      </VCard>
    </VForm>
  </VDialog>
</template>


<route lang="yaml">
meta:
  action: Read
  subject: Dashboard
  redirectIfLoggedIn: false
</route>
