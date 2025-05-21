<script setup>
import axiosIns from '@/plugins/axios'
import { useToast } from 'vue-toastification'
import { watchEffect, reactive, ref, computed, toRaw } from 'vue'
import addForm from './add.vue'
import editForm from './edit.vue'

const toast = useToast()

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

const fetchData = async () => {
  waiting.value = true
  try {
    const ret = await axiosIns.get('/users', {
      params: {
        page: args.page,
        perPage: args.per_page,
        find: args.find,
      },
    })
    dataset.value = ret.data.data
    meta.total = ret.data.meta.total
    meta.last = ret.data.meta.last
    meta.from = ret.data.meta.from
    meta.to = ret.data.meta.to
  } catch (err) {
    console.error(err)
    toast.error('Gagal memuat data user')
  } finally {
    waiting.value = false
  }
}

watchEffect(() => {
  fetchData()
})

const paginationData = computed(() => {
  return `Showing ${meta.from} to ${meta.to} of ${meta.total}`
})

const searchQuery = ref('')
const findHandler = () => {
  args.find = searchQuery.value
}

const clearHandler = () => {
  searchQuery.value = ''
  args.find = ''
}

const selectedData = ref(null)
const editFormVisible = ref(false)

const updateClickHandler = item => {
  selectedData.value = item
  editFormVisible.value = true
}

const getUpdateStatus = val => {
  editFormVisible.value = val.isVisible
  if (val.isOk === true) fetchData()
}

const activateUser = async employeeId => {
  try {
    await axiosIns.patch(`/employees/activate/${employeeId}`)
    fetchData()
  } catch (err) {
    console.error(err)
    toast.error('Gagal mengaktifkan user')
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


const removeRole = async id => {
  try {
    await axiosIns.patch(`/users/role/remove/${id}`)
    fetchData()
  } catch (err) {
    console.error(err)
    toast.error('Gagal menghapus role user')
  }
}

const headers = [
  { title: 'ACTION', key: 'action', width: 80 },
  { title: 'NAME', key: 'employee.name', formatter: item => item.employee?.name || '-' },
  { title: 'USERNAME', key: 'username' },
  { title: 'EMAIL', key: 'employee.email' },
  {
    title: 'ROLE',
    key: 'roles[0].name',
    formatter: item => item.roles?.[0]?.name || '-',
  },
  {
    title: 'STATUS',
    key: 'status',
  },
]

const addFormVisible = ref(false)
const getAddFormStatus = val => {
  addFormVisible.value = val.isVisible
  if (val.isOk === true) fetchData()
}

const updateOptions = options => {
  args.sort_by = options.sortBy?.[0]?.key || 'created_at'
  args.sort_order = options.sortBy?.[0]?.order || 'desc'
}
</script>

<template>
  <div>
    <addForm :is-visible="addFormVisible" @status="getAddFormStatus" />
    <editForm :is-visible="editFormVisible" :data="selectedData" @status="getUpdateStatus" />

    <VCard>
      <VCardText>
        <VRow class="d-flex">
          <VCol cols="2" style="max-width: 120px;">
            <VSelect v-model="args.per_page" :items="[10, 20, 30, 50]" variant="outlined" />
          </VCol>
          <VCol class="d-flex gap-4">
            <VTextField
              v-model="searchQuery"
              clearable
              @keyup.enter="findHandler"
              @click:clear="clearHandler"
              placeholder="Search user"
              prepend-inner-icon="tabler:search"
            />
            <VBtn variant="outlined" prepend-icon="tabler-plus" @click="addFormVisible = true">
              Add New Record
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
      <VDivider />

      <VDataTableServer
        :items="dataset"
        :headers="headers"
        :loading="waiting"
        item-value="id"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <template #item.action="{ item }">
          <VBtn icon variant="text" color="default" size="x-small">
            <VIcon icon="tabler-dots-vertical" />
            <VMenu activator="parent">
              <VList>
                <!-- <VListItem
                  @click="removeRole(item.id)"
                  v-if="item.employee?.is_active === 1 && item.roles?.length === 1"
                >
                  <VListItemTitle>
                    <VIcon color="error" icon="tabler-lock" size="24" class="me-2" />
                    Remove Role
                  </VListItemTitle>
                </VListItem> -->

                <VListItem
                  @click="deactivateUser(item.employee?.id)"
                  v-if="item.employee?.is_active === 1"
                >
                  <VListItemTitle>
                    <VIcon color="info" icon="tabler-trash" size="24" class="me-2" />
                    Deactivate
                  </VListItemTitle>
                </VListItem>

                <VListItem
                  @click="activateUser(item.employee?.id)"
                  v-if="item.employee?.is_active === 0"
                >
                  <VListItemTitle>
                    <VIcon color="success" icon="tabler-circle-check" size="24" class="me-2" />
                    Activate
                  </VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </template>

        <!-- <template #item.employee.name="{item}" >
          <div @click="updateClickHandler(item)" style="cursor: pointer;" class="text-primary">
            {{ item.employee?.name || '-' }} 
          </div>
        </template> -->

        <template #item.status="{ item }">
          <VChip :color="item.employee?.is_active === 1 ? 'success' : 'error'" size="small">
            {{ item.employee?.is_active === 1 ? 'Active' : 'Nonactive' }}
          </VChip>
        </template>

        <template #bottom>
          <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4">
            <span class="text-sm text-disabled">{{ paginationData }}</span>
            <VPagination
              v-model="args.page"
              :length="meta.last"
              variant="outlined"
              size="small"
              :total-visible="5"
            />
          </VCardText>
        </template>
      </VDataTableServer>
    </VCard>
  </div>
</template>

<route lang="yaml">
meta:
  action: Read
  subject: Dashboard
  redirectIfLoggedIn: false
</route>
