<script setup>
import axiosIns from '@/plugins/axios';
import { useToast } from 'vue-toastification';
import { onMounted, toRaw, watch, watchEffect } from 'vue';
import { formatRibuan, formatUang } from '@/@core/utils/formatters';
import PermitDetailDialog from './detail.vue'
const toast = useToast()

const args = reactive({
  page: 1,
  per_page: 10,
  find: '',
  sort_by: 'created_at',
  sort_order: 'desc',
  status: null,
})

const meta = reactive({
  total: 0,
  from: 0,
  to: 0,
  last: 0
})

const waiting = ref(false)

const dataset = ref([])
const coba = ref([])
const fetchData = async () => {
  waiting.value = true
  try {
    const ret = await axiosIns.get("/permits", {
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

  {
    title: 'STATUS',
    key: 'status',
    sortable: false,
    formatter: item => item.status === 1 ? 'Active' : 'Nonactive'
  },
  { title: 'DOCUMENT NUMBER', key: 'document_number', sortable: true },
  { title: 'DOCUMENT DATE', key: 'document_date', sortable: true, 
  formatter: item => new Date(item.document_date).toLocaleDateString()
   },

  {
    title: 'EMPLOYEE',
    key: 'employee.name', 
    sortable: true,
    formatter: item => item.employee?.name || '-'
  },
  { title: 'PERMIT TYPE', key: 'permit_type.name', sortable: true },
  { title: 'DURATION', key: 'duration', sortable: true },
]

function getDuration(start, end) {
  if (!start || !end) return '-'

  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffMs = endDate - startDate

  const diffMinutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  return `${hours}h ${minutes}m`
}

const updateOptions = options => {
  args.sort_by = options.sortBy[0]?.key || 'created_at'
  args.sort_order = options.sortBy[0]?.order || 'desc'
}

const statusOptions = [
  { title: 'Draft', value: 0 },
  { title: 'Approved', value: 1 },
  { title: 'Check Out', value: 2 },
  { title: 'Ended', value: 3 },
  { title: 'Rejected', value: 4 },
]
const selectedStatus = ref(null)
watch(selectedStatus, val => {
  args.status = val
})

const showDetailDialog = ref(false)
const selectedPermitId = ref(null)

const openDetailDialog = id => {
  selectedPermitId.value = id
  showDetailDialog.value = true
}

</script>
<template>
  <div>
<PermitDetailDialog
  :is-visible="showDetailDialog"
  :header-id="selectedPermitId"
  @close="showDetailDialog = false"
/>

    <VCard>
      <VCardText>
        <VRow class="d-flex flex-wrap align-center">
          <VCol cols="12" sm="2" style="max-width: 120px; width: 120px;">
            <VSelect v-model="args.per_page" variant="outlined" :items="[10, 20, 30, 50]" />
          </VCol>

          <VCol cols="12" sm="2" >
            <VSelect
              v-model="selectedStatus"
              :items="statusOptions"
              item-title="title"
              item-value="value"
              label="Status"
              clearable
              variant="outlined"
            />
          </VCol>

          <VCol>
            <VTextField
              placeholder="Find .."
              v-model="searchQuery"
              clearable
              @keyup.enter="findHandler"
              @click:clear="clearHandler"
              prepend-inner-icon="tabler:search"
            />
          </VCol>
        </VRow>
      </VCardText>
      <VDivider />
      <VDataTableServer :items="dataset" :headers="headers" item-value="id" :loading="waiting"
        @update:options="updateOptions" class="text-no-wrap">
        
        <template #item.duration="{ item }">
          {{ getDuration(item.check_out_at, item.check_in_at) }}
        </template>

        <template #item.status="{ item }">
          <span :class="{
            'text-warning': item.status === 0,
            'text-success': item.status === 1,
            'text-info': item.status === 2,
            'text-muted': item.status === 3,
            'text-error': item.status === 4
          }">
            {{
              item.status === 0 ? 'Draft' :
              item.status === 1 ? 'Approved' :
              item.status === 2 ? 'Check Out' :
              item.status === 3 ? 'Ended' :
              item.status === 4 ? 'Rejected' :
              'Unknown'
            }}
          </span>
        </template>
        <template #item.document_number="{ item }">
          <a href="#" @click.prevent="openDetailDialog(item.id)">
            {{ item.document_number }}
          </a>
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
    subject: Permit
    redirectIfLoggedIn: false
  </route>
