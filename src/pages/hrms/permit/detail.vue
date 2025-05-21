<script setup>
import axiosIns from '@/plugins/axios'
import { ref, watchEffect, reactive, computed } from 'vue'
import { useToast } from 'vue-toastification'
import deleteConfirmation from '@/pages/misc/delete-confirmation/index.vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  headerId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['close'])

const toast = useToast()

const headers = ref([
  { title: 'CHECK IN', key: 'check_in_at', sortable: true },
  { title: 'CHECK IN BY', key: 'checkin_by.name', sortable: true },
  { title: 'CHECK OUT', key: 'check_out_at', sortable: false },
  { title: 'CHECK OUT BY', key: 'checkout_by.name', sortable: false },
  { title: 'DURATION', key: 'duration', sortable: false },
])

const args = reactive({
  page: 1,
  per_page: 10,
  find: '',
  sort_by: 'created_at',
  sort_order: 'desc',
  permit_id: props.headerId,
})

const meta = reactive({
  total: 0,
  from: 0,
  to: 0,
  last: 0,
})

const dataset = ref([])
const waiting = ref(false)
const searchQuery = ref('')
const deleteConfirmVisible = ref(false)
const selectedData = ref(null)

const permitHeader = ref({
  document_number: '',
  document_date: '',
  employee: { name: '' },
  permit_type: { name: '' },
  from_location: '',
  to_location: '',
})

const fetchPermitHeader = async () => {
  try {
    const res = await axiosIns.get(`/permits/${props.headerId}`)
    
    // Ambil data dari array (index 0)
    const data = res.data.data?.[0] || {}

    permitHeader.value = {
      document_number: data.document_number || '',
      document_date: data.document_date ? new Date(data.document_date).toLocaleDateString() : '-',
      employee: data.employee || { name: '' },
      permit_type: data.permit_type || { name: '' },
      from_location: data.from_location || '-',
      to_location: data.to_location || '-',
    }
  } catch (error) {
    toast.error('Gagal memuat header permit: ' + error.message)
  }
}

const fetchData = async () => {
  waiting.value = true
  try {
    const ret = await axiosIns.get('/permit-lines', { params: { ...args } })
    dataset.value = ret.data.data
    meta.total = ret.data.meta.total
    meta.last = ret.data.meta.last
    meta.from = ret.data.meta.from
    meta.to = ret.data.meta.to
  } catch (error) {
    toast.error('Gagal memuat data: ' + error.message)
  } finally {
    waiting.value = false
  }
}

// Watch visibility untuk trigger fetching
watchEffect(() => {
  if (props.isVisible) {
    fetchPermitHeader()
    fetchData()
  }
})

// Reset data saat dialog ditutup
const watchClose = () => {
  if (!props.isVisible) {
    permitHeader.value = {
      document_number: '',
      document_date: '',
      employee: { name: '' },
      permit_type: { name: '' },
      from_location: '',
      to_location: '',
    }
    dataset.value = []
  }
}

const getDuration = (start, end) => {
  if (!start || !end) return '-'
  const diffMs = new Date(end) - new Date(start)
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m`
}

const updateOptions = options => {
  args.sort_by = options.sortBy[0]?.key || 'created_at'
  args.sort_order = options.sortBy[0]?.order || 'desc'
}

const findHandler = () => {
  args.find = searchQuery.value
  args.page = 1
  fetchData()
}

const clearHandler = () => {
  searchQuery.value = ''
  findHandler()
}

const paginationData = computed(() => {
  return `Showing ${meta.from} to ${meta.to} of ${meta.total}`
})

const getDeleteConfirmation = val => {
  deleteConfirmVisible.value = val.isVisible
  if (val.confirm) {
    const id = toRaw(selectedData.value).id
    deleteData(id)
  }
}

const deleteData = async id => {
  waiting.value = true
  try {
    await axiosIns.delete(`/permit-lines/${id}`)
    await fetchData()
    toast.success('Data berhasil dihapus')
  } catch (error) {
    toast.error('Gagal menghapus data: ' + error.message)
  } finally {
    waiting.value = false
  }
}
</script>

<template>
  <VDialog v-model="props.isVisible" max-width="1100" persistent>
    <VCard style="max-height: 90vh; display: flex; flex-direction: column;">
      <VCardTitle class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-medium">
          Permit Line Detail<span v-if="permitHeader.document_number"> – {{ permitHeader.document_number }}</span>
        </span>
        <VBtn icon="tabler-x" variant="text" @click="emit('close')" />
      </VCardTitle>

      <VDivider />

      <VCardText>
        <v-row>
        <v-col cols="12" sm="6" md="4">
          <strong>Document Number:</strong>
          <div>{{ permitHeader.document_number }}</div>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <strong>Document Date:</strong>
          <div>{{ permitHeader.document_date }}</div>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <strong>Employee Name:</strong>
          <div>{{ permitHeader.employee.name }}</div>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <strong>Permit Type:</strong>
          <div>{{ permitHeader.permit_type.name }}</div>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <strong>From Location:</strong>
          <div>{{ permitHeader.from_location }}</div>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <strong>To Location:</strong>
          <div>{{ permitHeader.to_location }}</div>
        </v-col>
      </v-row>

        <VRow class="d-flex">
          <VCol cols="2" style="max-width: 120px;">
            <VSelect v-model="args.per_page" variant="outlined" :items="[10, 20, 30, 50]" />
          </VCol>
          <VCol class="d-flex gap-4">
            <VTextField
              placeholder="Find..."
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

      <!-- Scrollable Table -->
      <div style="overflow-y: auto; flex-grow: 1;">
        <VDataTableServer
          :items="dataset"
          :headers="headers"
          item-value="id"
          :loading="waiting"
          @update:options="updateOptions"
          class="text-no-wrap"
        >
          <template #item.duration="{ item }">
            {{ getDuration(item.check_in_at, item.check_out_at) }}
          </template>

          <template #bottom>
            <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4">
              <span class="text-sm text-disabled">{{ paginationData }}</span>
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
      </div>
    </VCard>
  </VDialog>
</template>

<route lang="yaml">
meta:
  action: Read
  subject: Dashboard
  redirectIfLoggedIn: false
</route>
