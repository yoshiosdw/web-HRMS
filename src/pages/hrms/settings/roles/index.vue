<script setup>
import axiosIns from '@/plugins/axios'
import Swal from 'sweetalert2'
import { reactive, ref, watch } from 'vue'
import deleteConfirmation from '@/pages/misc/delete-confirmation/index.vue'
import RoleForm from './roleForm.vue'

const args = reactive({
  page: 1,
  per_page: 10,
  find: '',
})

const meta = reactive({
  total: 0,
  from: 0,
  to: 0,
  last: 0,
})

const waiting = ref(false)
const dataset = ref([])

const isFormVisible = ref(false)
const formMode = ref('add') 
const currentRole = ref(null)
const searchQuery = ref('')

const findHandler = () => {
  args.find = searchQuery.value
}

const clearHandler = () => {
  args.find = ''
}
const fetchData = async () => {
  waiting.value = true
  try {
    const res = await axiosIns.get('/roles', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('hrmsToken'),
      },
      params: { ...args },
    })
    dataset.value = res.data.data
    meta.total = res.data.meta?.total || 0
    meta.from = res.data.meta?.from || 0
    meta.to = res.data.meta?.to || 0
    meta.last = res.data.meta?.last_page || 1
  } catch (error) {
    Swal.fire('LBG', 'Gagal memuat data role', 'error')
    console.error(error)
  } finally {
    waiting.value = false
  }
}

const deleteRoleHandler = async id => {
    waiting.value = true
  try {
    await axiosIns.delete(`/roles/${id}`)
    await fetchData()
  } catch (error) {
    console.log(error)
    toast.error('Error while deleting data. Error: ' + error.message)
  } finally {
    waiting.value = false
  }
}

const deleteConfirmVisible = ref(false)
const selectedData = ref(null)
const deleteClickHandler = data => {
  deleteConfirmVisible.value = true
  selectedData.value = data
}
const getDeleteConfirmation = val => {
  deleteConfirmVisible.value = val.isVisible
  if(val.confirm === true) {
    const id = toRaw(selectedData.value).id
    deleteRoleHandler(id)
  }
}

const openAddForm = () => {
  formMode.value = 'add'
  currentRole.value = null
  isFormVisible.value = true
}

const openEditForm = (role) => {
  formMode.value = 'edit'
  currentRole.value = role
  isFormVisible.value = true
}

const onFormStatus = ({ isVisible, isOk }) => {
  isFormVisible.value = isVisible
  if (isOk) fetchData()
}

watch([() => args.page, () => args.per_page, () => args.find], fetchData, {
  immediate: true,
});
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
      <VOverlay v-model="waiting" />
      <deleteConfirmation :is-visible="deleteConfirmVisible" @status="getDeleteConfirmation" />
      <VCard :loading="waiting">
        <VCardText class="d-flex gap-4">
          <div style="min-width: 80px;">
            <VSelect v-model="args.per_page" :items="[10, 20, 30, 50]" />
          </div>
          <VTextField placeholder="Search Role" v-model="searchQuery" clearable @keyup.enter="findHandler"
              @click:clear="clearHandler" prepend-inner-icon="tabler:search" />
          <VBtn @click="openAddForm">Add New Role</VBtn>
        </VCardText>
      </VCard>
    </VCol>

    <VCol v-for="role in dataset" :key="role.id" cols="4">
      <VCard>
        <VCardText>
          <div class="d-flex align-center justify-space-between">
            <h4>{{ role.name }}</h4>
          </div>

          <div class="d-flex justify-end gap-4 mt-2">
            <VBtn
              icon="tabler-pencil"
              variant="tonal"
              size="small"
              @click="openEditForm(role)"
            />
            <VBtn
              v-if="role.name !== 'administrator'"
              icon="tabler-trash"
              color="error"
              variant="tonal"
              size="small"
              @click="deleteClickHandler(role)"
            />
          </div>
        </VCardText>
      </VCard>
    </VCol>

  </VRow>
  
  <RoleForm
  :is-visible="isFormVisible"
  :mode="formMode"
  :role-data="currentRole"
  @status="onFormStatus"
  />
</div>
</template>

<route lang="yaml">
meta:
  action: Read
  subject: Dashboard
  redirectIfLoggedIn: false
</route>
