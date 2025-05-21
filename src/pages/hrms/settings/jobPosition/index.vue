<script setup>
import axiosIns from '@/plugins/axios';
import { ref, watchEffect, toRaw } from 'vue'
import editForm from './edit.vue'
import addForm from './add.vue'
import deleteConfirmation from '@/pages/misc/delete-confirmation/index.vue'
import { useToast } from 'vue-toastification'

const headers = ref([
  { title: 'ACTION', key: 'action', width: 50, },
  { title: 'NAME', key: 'name', sortable: true}, 
  { title: 'DESCRIPTION', key: 'description'},
])

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
const toast = useToast()

const fetchData = async () => {
    waiting.value = true;
    try {
        const ret = await axiosIns.get('/job-positions', {
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

const searchQuery = ref('')
const findHandler = () => {
  args.find = searchQuery.value
}
const clearHandler = () => {
  args.find = ''
}

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
    await axiosIns.delete(`/job-positions/${id}`)
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
  const file = event.target.files[0]
  if (!file) return

  selectedFile.value = file

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const response = await axiosIns.post('/job-positions/import-data', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    fetchData()
    toast.success('File berhasil diimport!', 'success')
  } catch (error) {
    toast.error('Gagal import file.', 'error')
    console.error(error)
  }
}

const paginationData = computed(() => {
    return `Showing ${meta.from} to ${meta.to} of ${meta.total}`;
});
</script>

<template>
  <div>
    <addForm :is-visible="addFormVisible" @status="getAddFormStatus"/>
    <editForm :is-visible="editFormVisible" :data="selectedData" @status="getUpdateStatus" />
    <deleteConfirmation :is-visible="deleteConfirmVisible" @status="getDeleteConfirmation" />
    <VCard>
      <VCardText>
        <VRow class="d-flex flex-wrap align-center">
          <VCol cols="12" sm="2" style="max-width: 120px; width: 120px;">
            <VSelect v-model="args.per_page" variant="outlined" :items="[10, 20, 30, 50]" />
          </VCol>
          <VCol  class="d-flex flex-wrap gap-2">
            <VTextField placeholder="Find .." v-model="searchQuery" clearable @keyup.enter="findHandler"
              @click:clear="clearHandler" prepend-inner-icon="tabler:search" />
              <div>
              <input 
              ref="fileInput" type="file"
              accept=".xlsx, .xls"
              @change="importExcelHandler"
              style="display: none"  />
              </div>
              <VBtn variant="outlined" prepend-icon="mdi-import" @click="triggerFileInput">Import</VBtn>
            <VBtn variant="outlined" prepend-icon="tabler-plus" @click="addFormVisible = true">Add New</VBtn>
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
        <template #item.name="{item}" >
          <div @click="updateClickHandler(item)" style="cursor: pointer;" class="text-primary">
            {{ item.name }}
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
