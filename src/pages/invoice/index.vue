<script setup>
import { formatDate, formatDateMySql, formatUang } from '@/@core/utils/formatters'
import axiosIns from '@/plugins/axios'
import { useToast } from 'vue-toastification'
import router from '@/router'
import { computed } from 'vue'
import { VDateInput } from 'vuetify/lib/labs/components.mjs'
import { VDatePicker } from 'vuetify/lib/components/index.mjs'
import { isEmpty } from '@/@core/utils'
import Import from './import.vue'

const toast = useToast()

function getStartOfMonth() {
  const now = new Date() // Get current date
  
  return new Date(now.getFullYear(), now.getMonth(), 1) // Set day to 1
}

const fromDate = ref(getStartOfMonth())
const toDate = ref(new Date())

const args = reactive({
  page: 1,
  per_page: 10,
  find: '',
  status: 0,
  from_date: computed(() => formatDateMySql(fromDate.value)),
  to_date: computed(() => formatDateMySql(toDate.value)),
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
    const ret = await axiosIns.get("/invoices", {
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

const searchQuery = ref()

const findHandler = () => {
  args.find = searchQuery.value
}

const clearHandler = () => {
  args.find = ''
}

const paginationData = computed(() => {
  return `Showing ${meta.from} to ${meta.to} of ${meta.total}`
})

watchEffect(() => {
  fetchData()
})

const statusName = ref()

const headers = [
  {
    title: 'STATUS',
    key: 'status_name',
  },
  {
    title: '#INVOICE',
    key: 'doc_number',
  },
  {
    title: '#FAKTUR PAJAK',
    key: 'no_factur',
  },
  
  {
    title: 'TANGGAL',
    key: 'doc_date',
  },
  {
    title: '# CUSTOMER',
    key: 'debtor_key',
  },
  {
    title: 'CUSTOMER',
    key: 'debtor.company_name',
  },

]

const resolveStatusName = val => {
  switch (val) {
  case 1: 
    return  { name: 'Modified', color: 'warning' }
  case 2: 
    return  { name: 'Exported', color: 'success' }
  case 0:
    return  { name: 'New', color: 'default' }
  }
}


const exportWaiting = ref(false)

const exportAndDownload = async () => {
  exportWaiting.value = true
  try {
    const response = await axiosIns.post('/invoices/export/xml', { doc_key: selectedItem.value },
      {
        headers: {
          responseType: 'blob', 
        },
      },
    )

    const blob = new Blob([response.data], { type: 'application/xml' })

    selectedItem.value = null

    const link = document.createElement('a')
    const url = window.URL.createObjectURL(blob)

    link.href = url
    link.setAttribute('download', 'invoice.xml') 
    document.body.appendChild(link)

    link.click()

    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting file:', error)
    alert('Failed to export file.')
  } finally {
    exportWaiting.value = false
    fetchData()
  }
}

const exportToCsv = async () => {
  exportWaiting.value = true
  try {
    const response = await axiosIns.get('/djp/tki/invoice', {
      params: {
        doc_key: selectedItem.value, 
      },
    },
    {
      headers: {
        responseType: 'blob', 
      },
    },
    )

    const blob = new Blob([response.data], { type: 'application/csv' })

    selectedItem.value = null

    const link = document.createElement('a')
    const url = window.URL.createObjectURL(blob)

    link.href = url
    link.setAttribute('download', 'invoice.csv') 
    document.body.appendChild(link)

    link.click()

    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting file:', error)
    alert('Failed to export file.')
  } finally {
    exportWaiting.value = false
    fetchData()
  }
}

const selectedItem = ref([])

const synchHandler = async () => {
  waiting.value = true
  try {
    await axiosIns.post('/invoices', {})
  } catch (error) {
    toast.error('Sync Gagal. Error: ' + error.message)
    console.log(error)
  } finally {
    waiting.value = false
  }
}

const importDialogVisible = ref(false)

const showImportDialog = () => {
  importDialogVisible.value = true
}

const gerImportDialogStatus = val => {
  importDialogVisible.value = val.isvVisible
  if(val.isConfirm) fetchData()
}

const downloadTemplateWaiting = ref(false)

const downloadTemplate = async () => {
  downloadTemplateWaiting.value = true
  try {
    const response = await axiosIns.get('/export/excel/tki', {
      responseType: 'blob', 
      params: {
        from_date: args.from_date,
        to_date: args.to_date,
      },
    })

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const link = document.createElement('a')
    const url = window.URL.createObjectURL(blob)

    link.href = url
    link.setAttribute('download', 'invoice_template.xlsx') 
    document.body.appendChild(link)

    link.click()

    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting file:', error)
    alert('Failed to export file.')
  } finally {
    downloadTemplateWaiting.value = false
  } 
}
</script>

<template>
  <div>
    <Import
      :is-visible="importDialogVisible"
      @status="gerImportDialogStatus"
    />
    <VCard>
      <VCardText>
        <VRow>
          <VCol style="max-width: 120px; width: 120px;">
            <VSelect
              v-model="args.per_page"
              variant="outlined"
              :items="[10, 20, 30, 50, 100, 1000, 5000]"
              :loading="waiting"
            />
          </VCol>
          <VCol class="d-flex gap-4">
            <VTextField
              v-model="searchQuery"
              placeholder="Cari data .."
              clearable
              :loading="waiting"
              @keyup.enter="findHandler"
              @click:clear="clearHandler"
            />

            <div class="d-flex justify-end gap-4">
              <VBtn
                prepend-icon="tabler:bolt"
                variant="outlined"
                color="warning"
                :loading="waiting || exportWaiting"
                @click="synchHandler"
              >
                Sync Invoice
              </VBtn>
              <VBtn
                prepend-icon="tabler:file-type-xml"
                variant="outlined"
                :loading="exportWaiting || waiting"
                :disabled="isEmpty(selectedItem)"
                @click="exportAndDownload"
              >
                To XML
              </VBtn>
              <VBtn
                prepend-icon="tabler:file-type-csv"
                variant="outlined"
                :loading="exportWaiting || waiting"
                :disabled="isEmpty(selectedItem)"
                @click="exportToCsv"
              >
                To CSV
              </VBtn>
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="4">
            <div class="d-flex justify-space-between gap-4">
              <VDateInput
                v-model="fromDate"
                density="compact"
                prepend-icon=""
                label="From Date"
                hide-actions=""
              />
              <VDateInput
                v-model="toDate"
                density="compact"
                prepend-icon=""
                label="From Date"
                hide-actions=""
              />
            </div>
          </VCol>
          <VCol cols="8">
            <div class="d-flex justify-space-between gap-4">
              <VAutocomplete
                v-model="args.status"
                :items="[{id: 0, name: 'New'}, {id: 1, name: 'Modified'}, {id: 2, name: 'Exported'}]"
                item-value="id"
                item-title="name"
                label="Status"
                dense
                clearable=""
              />
              <VBtn
                variant="outlined"
                color="warning"
                prepend-icon="tabler:arrow-bar-to-down"
                @click="downloadTemplate"
              >
                Download Invoice Template
              </VBtn>
              <VBtn
                variant="outlined"
                color="warning"
                prepend-icon="tabler:arrow-bar-to-down"
                @click="showImportDialog"
              >
                Import Faktur Pajak
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCardText>
      <VDivider />
      <VDataTableServer
        v-model="selectedItem"
        :items="dataset"
        :headers="headers"
        item-value="doc_key"
        :loading="waiting"
        show-select
      >
        <template #item.status_name="{item}">
          <div>
            <VChip
              variant="outlined"
              :color="resolveStatusName(item.is_exported).color"
            >
              {{ resolveStatusName(item.is_exported ).name }}
            </VChip>
          </div>
        </template>
        <template #item.net_total="{item}">
          <div class="text-right">
            {{ formatUang(item.net_total) }}
          </div>
        </template>
        <template #bottom>
          <VDivider />
          <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4">
            <span class="text-sm text-disabled">
              {{ paginationData }}
            </span>
            <VPagination
              v-model="args.page"
              variant="outlined"
              size="small"
              :length="meta.last"
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
