<script setup>
import axiosIns from '@/plugins/axios';
import { useToast } from 'vue-toastification';
import { onMounted, toRaw, watch, watchEffect } from 'vue';
import { formatRibuan, formatUang } from '@/@core/utils/formatters';
const toast = useToast()
import editForm from './edit.vue'
import addForm from './add.vue'
import deleteConfirmation from '@/pages/misc/delete-confirmation/index.vue'

const args = reactive({
  page: 1,
  per_page: 10,
  find: '',
  sort_by: 'created_at',
  sort_order: 'desc'
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
    const ret = await axiosIns.get("/employments", {
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
  { title: 'EMPLOYEE ID', key: 'employee.identity_number', sortable: true },
  { title: 'NAME', key: 'employee.name', sortable: true },
  { title: 'ORGANIZATION', key: 'organization.name', sortable: true },
  { title: 'JOB LEVEL', key: 'level_job.name', sortable: true },
  { title: 'JOB POSITION', key: 'position_job.name', sortable: true },
  {
    title: 'FROM DATE',
    key: 'from_date',
    sortable: true,
    formatter: item => item.from_date ? new Date(item.from_date).toLocaleDateString() : '-'
  },
  {
    title: 'TO DATE',
    key: 'to_date',
    sortable: true,
    formatter: item => item.to_date ? new Date(item.to_date).toLocaleDateString() : '-'
  },
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

const selectedData = ref(null)
const updateClickHandler = item => {
  selectedData.value = item
  editFormVisible.value = true
}

const deleteData = async id => {
  waiting.value = true
  try {
    await axiosIns.delete(`/employments/${id}`)
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
</script>
<template>
  <div>
    <addForm :is-visible="addFormVisible" @status="getAddFormStatus"/>
    <editForm :is-visible="editFormVisible" :data="selectedData" @status="getUpdateStatus" />
    <deleteConfirmation :is-visible="deleteConfirmVisible" @status="getDeleteConfirmation" />
    <VCard>
      <VCardText>
        <VRow class="d-flex">
          <VCol cols="2" style="max-width: 120px; width: 120px;">
            <VSelect v-model="args.per_page" variant="outlined" :items="[10, 20, 30, 50]" />
          </VCol>
          <VCol class="d-flex gap-4">
            <VTextField placeholder="Find .." v-model="searchQuery" clearable @keyup.enter="findHandler"
              @click:clear="clearHandler" prepend-inner-icon="tabler:search" />
            <VBtn variant="outlined" prepend-icon="tabler-plus" @click="addFormVisible = true">Add New Record</VBtn>
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
                  
                  <VListItem @click="deleteClickHandler(item)">
                    <VListItemTitle>
                      <VIcon color="error" icon="tabler-trash" size="24" class="me-3"/>
                      Delete
                    </VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </div>
        </template>
        <template #item.employee.identity_number="{item}" >
          <div @click="updateClickHandler(item)" style="cursor: pointer;" class="text-primary">
            {{ item.employee.identity_number }}
          </div>
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
    subject: Auth
    redirectIfLoggedIn: false
  </route>
