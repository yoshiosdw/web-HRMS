<script setup>
import axiosIns from '@/plugins/axios';
import { useToast } from 'vue-toastification';
import ability from '@/plugins/casl/ability'
import { onMounted, toRaw, watch, watchEffect, ref, computed, reactive } from 'vue';
import { formatRibuan, formatUang } from '@/@core/utils/formatters';
const toast = useToast()
import editForm from './edit.vue'
import addForm from './add.vue'
import deleteConfirmation from '@/pages/misc/delete-confirmation/index.vue'
import addUser from './addUser.vue';
import editUser from './editUser.vue'

const args = reactive({
  page: 1,
  per_page: 10,
  find: '',
  sort_by: 'created_at',
  sort_order: 'desc',
  employment_status_id: null,
  organization_id: null,
  has_username: null,
  is_active: 1,
})

const meta = reactive({
  total: 0,
  from: 0,
  to: 0,
  last: 0
})

const waiting = ref(false)

const dataset = ref([])
const fetchData = async () => {
  waiting.value = true
  try {
    const ret = await axiosIns.get("/employees", {
      params: { ...args },
    })
    dataset.value = ret.data.data
    meta.total = ret.data.meta.total
    meta.last = ret.data.meta.last
    meta.from = ret.data.meta.from
    meta.to = ret.data.meta.to
  } catch (error) {
    console.log(error)
    toast.error('Gagal memuat data. Error: ' + error.message)
  } finally {
    waiting.value = false
  }
}

watchEffect(() => {
  fetchData()
})

const paginationData = computed(() => {
  return `Showing ${meta.from} to ${meta.to} of ${meta.total}`;
});

const searchQuery = ref('')
const findHandler = () => {
  args.find = searchQuery.value
}

const clearHandler = () => {
  args.find = ''
}

const headers = [
  { title: 'ACTION', key: 'action', width: 50 },
  { title: 'EMPLOYEE ID', key: 'identity_number', sortable: true },
  { title: 'USERNAME', key: 'user.username', sortable: true },
  { title: 'BADGE NUMBER', key: 'badge_number', sortable: true },
  { title: 'NAME', key: 'name', sortable: true },
  { title: 'GENDER', key: 'gender', sortable: true },
  { title: 'PHONE', key: 'phone_number', sortable: true },
  { title: 'ALTERNATE PHONE', key: 'alternate_phone_number', sortable: true },
  { title: 'EMAIL', key: 'email', sortable: true },
  { title: 'EMPLOYEE STATUS', key: 'employment_status.name', sortable: true,
    formatter: item => item.employment_status?.name || '-'
   },
  { title: 'ORGANIZATION', key: 'organization.name', sortable: true,
    formatter: item => item.organization?.name || '-'
   },
  { title: 'JOB LEVEL', key: 'level_job.name', sortable: true },
  { title: 'JOB POSITION', key: 'position.name', sortable: true },
  
  {
    title: 'STATUS',
    key: 'is_active',
    sortable: false,
    formatter: item => item.is_active === 1 ? 'Active' : 'Nonactive'
  },
]

const updateOptions = options => {
  args.sort_by = options.sortBy[0]?.key || 'created_at'
  args.sort_order = options.sortBy[0]?.order || 'desc'
}

const editUserVisible = ref(false)
const selectedUserId = ref(null)
const selectedUsername = ref('')
const selectedRoleName = ref('')

const getEditUserStatus = val => {
  editUserVisible.value = val.isVisible
  if (val.isOk === true) fetchData()
}

const openEditUserDialog = (item) => {
  if (item.user) {
    selectedUserId.value = item.user.id
    selectedUsername.value = item.user.username || ''
    editUserVisible.value = true
  } else {
    toast.error('User tidak ditemukan untuk karyawan ini.')
  }
}


const deactivateUser = async employeeId => {
  try {
    await axiosIns.patch(`/employees/deactivate/${employeeId}`)
    fetchData()
  } catch (err) {
    console.error(err)
    toast.error('Gagal menonaktifkan user')
  }
}

const addFormVisible = ref(false)
const getAddFormStatus = val => {
  addFormVisible.value = val.isVisible
  if(val.isOk === true) fetchData()
}

const editFormVisible = ref(false)
const getUpdateStatus = val => {
  editFormVisible.value = val.isVisible
  if(val.isOk === true) fetchData()
}

const addUserVisible = ref(false)
const getAddUserStatus = val => {
  addUserVisible.value = val.isVisible
  if(val.isOk === true) fetchData()
}
const setUserData = ref(null)
const openAddUserDialog = (item) => {
  setUserData.value = item
  addUserVisible.value = true
}

const selectedData = ref(null)
const updateClickHandler = item => {
  selectedData.value = item
  editFormVisible.value = true
}

const deleteData = async id => {
  waiting.value = true
  try {
    await axiosIns.delete(`/employees/${id}`)
    await fetchData()
  } catch (error) {
    console.log(error)
    toast.error('Error while deleting data. Error: ' + error.message)
  } finally {
    waiting.value = false
  }
}

const deleteConfirmVisible = ref(false)
const deleteClickHandler = data => {
  deleteConfirmVisible.value = true
  selectedData.value = data
}
const getDeleteConfirmation = val => {
  deleteConfirmVisible.value = val.isVisible
  if(val.confirm === true) {
    const id = toRaw(selectedData.value).id
    deleteData(id)
  }
}

const selectedFile = ref(null)
const fileInput = ref(null)
const triggerFileInput = () => {
  fileInput.value?.click()
}

const importExcelHandler = async (event) => {
  waiting.value = true
  const file = event.target.files[0]
  if (!file) return

  selectedFile.value = file

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const response = await axiosIns.post('/import/employees', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    fetchData()
    toast.success('File berhasil diimport!', 'success')
  } catch (error) {
    const errors = error?.response?.data?.errors
    let message = 'Failed to import file.'
    if (Array.isArray(errors) && errors.length > 0) {
    const grouped = {}

    errors.forEach(e => {
      if (!grouped[e.error]) {
        grouped[e.error] = []
      }
      grouped[e.error].push(e.row)
    })
    const groupedMessages = Object.entries(grouped).map(([errorMsg, rows]) => {
      const rowDisplay = rows.length > 1
        ? `Row: ${rows[0]}–${rows[rows.length - 1]}`
        : `Row: ${rows[0]}`
      return `${rowDisplay} Error: ${errorMsg}`
    })

      message += ' ' + groupedMessages.join('; ')
    } else {
      message += ' ' + (errors?.response?.data?.message || 'failed to import file')
    }
    toast.error(message)
  } finally {
    waiting.value = false
  }
}

const downloadExportExcel = async () => {
  waiting.value = true
  try {
    const response = await axiosIns.get('/export/employees',
            { responseType: 'blob' }, 
        )
    const url = window.URL.createObjectURL(new Blob([response.data]))

    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', `ExportEmployee.xlsx`) 
    document.body.appendChild(link)
    link.click() 

    URL.revokeObjectURL(url)
    document.body.removeChild(link) 
    waiting.value = false
    toast.success('File berhasil didownload!')
  } catch (error) {
    toast.error('Gagal Mengunduh')
  }
}

const employmentStatusList = ref([])
const selectedStatus = ref(null)
const organizationList = ref([])
const selectedOrganization = ref(null)
const filterUsername = ref(null)
const listUsername = [
  { label: 'Has Username', value: 1 },
  { label: 'Not Has Username', value: 0 },
]

const fetchEmploymentStatuses = async () => {
  try {
    const res = await axiosIns.get('/employment/statuses')
    employmentStatusList.value = res.data.data
  } catch (err) {
    console.error(err)
    toast.error('Gagal memuat data status kepegawaian')
  }
}

const fetchOrganizations = async () => {
  try {
    const res = await axiosIns.get('/organizations')
    organizationList.value = res.data.data
  } catch (err) {
    console.error(err)
    toast.error('Gagal memuat data organisasi')
  }
}

watch(selectedStatus, val => {
  args.employment_status_id = val
})
watch(selectedOrganization, val => {
  args.organization_id = val
})
watch(filterUsername, val => {
  args.has_username = val
})

onMounted(() => {
  fetchEmploymentStatuses()
  fetchOrganizations()
});
</script>

<template>
  <div>
    <addForm :is-visible="addFormVisible" @status="getAddFormStatus"/>
    <editForm :is-visible="editFormVisible" :data="selectedData" @status="getUpdateStatus" />
    <deleteConfirmation :is-visible="deleteConfirmVisible" @status="getDeleteConfirmation" />
    <addUser :is-visible="addUserVisible" :employee="setUserData" @status="getAddUserStatus" />
    <editUser
      :is-visible="editUserVisible"
      :user-id="selectedUserId"
      :username-prop="selectedUsername"
      @status="getEditUserStatus"
    />


    <VCard>
      <VCardText>
        <VRow class="d-flex flex-wrap align-center">
          <VCol cols="12" sm="2" style="max-width: 120px; width: 120px;">
            <VSelect v-model="args.per_page" variant="outlined" :items="[10, 20, 30, 50]" />
          </VCol>
          <VCol class="d-flex flex-wrap gap-4">
            <VTextField placeholder="Find .." v-model="searchQuery" clearable @keyup.enter="findHandler"
            @click:clear="clearHandler" prepend-inner-icon="tabler:search" />
              <VBtn  v-if="$can('Manage', 'Employee')" variant="outlined" prepend-icon="tabler-plus" @click="addFormVisible = true">
                Add
              </VBtn>
          </VCol>
        </VRow>
        <VRow class="d-flex flex-wrap align-center mt-4"> 
          <VCol cols="12" sm="3">
            <VSelect
              v-model="selectedStatus"
              :items="employmentStatusList"
              item-title="name"
              item-value="id"
              label="Employment Status"
              clearable
              variant="outlined"
            />
          </VCol>
          <VCol cols="12" sm="3">
            <VSelect
              v-model="selectedOrganization"
              :items="organizationList"
              item-title="name"
              item-value="id"
              label="Organization"
              clearable
              variant="outlined"
            />
          </VCol>
          <VCol cols="12" sm="3">
            <VSelect
              v-model="filterUsername"
              :items="listUsername"
              item-title="label"
              item-value="value"
              label="Filter Username"
              clearable
              variant="outlined"
            />
          </VCol>
          <VCol cols="12" sm="3" class="d-flex  gap-2">
              <div>
              <input 
              ref="fileInput" type="file"
              accept=".xlsx, .xls"
              @change="importExcelHandler"
              style="display: none"  />
              </div>
              <VBtn  v-if="$can('Manage', 'Employee')" variant="outlined" prepend-icon="mdi-import" @click="triggerFileInput">Import</VBtn>
            <VBtn variant="outlined" prepend-icon="mdi-import" @click="downloadExportExcel">Export</VBtn>
          </VCol>
        </VRow>
      </VCardText>
      <VDivider />
      <VDataTableServer :items="dataset" :headers="headers" item-value="id" :loading="waiting"
        @update:options="updateOptions" class="text-no-wrap">
        <template #item.action="{item}">
          <div class="d-flex">
            <VBtn icon variant="text" color="default" size="x-small">
              <VIcon :size="22" icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem
                    @click="deactivateUser(item.id)"
                    v-if="item.is_active === 1"
                  >
                    <VListItemTitle>
                      <VIcon color="warning" icon="tabler-xbox-x" size="24" class="me-3" />
                      Deactivate
                    </VListItemTitle>
                  </VListItem>
                  <VListItem @click="deleteClickHandler(item)">
                    <VListItemTitle>
                      <VIcon color="error" icon="tabler-trash" size="24" class="me-3"/>
                      Delete
                    </VListItemTitle>
                  </VListItem>
                  <VListItem @click="openAddUserDialog(item)" v-if="!item.user">
                    <VListItemTitle>
                      <VIcon color="success" icon="tabler-user-plus" size="24" class="me-3"/>
                      Add User
                    </VListItemTitle>
                  </VListItem>
                  <VListItem
                    @click="openEditUserDialog(item)"
                    v-if="item.user && $can('Manage', 'Employee')"
                  >
                    <VListItemTitle>
                      <VIcon color="primary" icon="tabler-user-edit" size="24" class="me-3"/>
                      Edit User
                    </VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </div>
        </template>

        <template #item.identity_number="{item}">
          <div @click="updateClickHandler(item)" style="cursor: pointer;" class="text-primary">
            {{ item.identity_number }}
          </div>
        </template>
        <template #item.is_active="{ item }">
          <span>{{ item.is_active === 1 ? 'Active' : 'Nonactive' }}</span>
        </template>
        <template #bottom>
          <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4">
            <span class="text-sm text-disabled">
              {{ paginationData }}
            </span>
            <VPagination v-model="args.page" variant="outlined" size="small" :length="meta.last" :total-visible="5" />
          </VCardText>
        </template>
      </VDataTableServer>
    </VCard>
  </div>
</template>

<route lang="yaml">
  meta:
    action: Read
    subject: Employee
    redirectIfLoggedIn: false
</route>
