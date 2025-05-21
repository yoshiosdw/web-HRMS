<script setup>
import axiosIns from '@/plugins/axios'
import Swal from 'sweetalert2'
import { ref, watchEffect, toRaw } from 'vue'
import { useToast } from 'vue-toastification'
import router from '@/router'
import deleteConfirmation from '@/pages/misc/delete-confirmation/index.vue'
import { or } from '@vueuse/math';

const headers = ref([
  { title: 'PERMIT CODE', key: 'permit.document_number', sortable: true},
  { title: 'CHECK IN BY', key: 'checkin_by.identity_number', sortable: true},
  { title: 'CHECK IN AT', key: 'check_in_at', sortable: true},
  { title: 'CHECK OUT BY', key: 'checkout_by.identity_number', sortable: false}, 
  { title: 'CHECK OUT AT', key: 'check_out_at', sortable: false}, 
  { title: 'DURATION', key: 'duration', sortable: false}, 
])

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

const props = defineProps({
  headerId: {
    type: String,
    required: true,
  },
})

const route = useRoute()
const permit_id = ref(route.params.line)
const showLoading = ref(false)
const args = reactive({
    page: 1,
    per_page: 10,
    find: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    permit_id: permit_id
})

const meta = reactive({
    total: 0,
    from: 0,
    to: 0,
    last: 0
})

const waiting = ref(false)
const dataset = ref([])
const permitData = ref([])
const documentNumber = ref()
const documentDate = ref()
const employeeId = ref()
const permitType = ref()
const fromLocation = ref()
const toLocation =ref()
const toast = useToast()

const fetchPermit = async (permit_id) => {
    waiting.value = true
    try {
        const ret = await axiosIns.get(`/permits/${permit_id}`)
        permitData.value = ret.data.data[0]

        documentNumber.value = permitData.value.document_number
        documentDate.value = permitData.value.document_date
        employeeId.value = permitData.value.employee?.identity_number
        permitType.value = permitData.value.permit_type?.name
        fromLocation.value = permitData.value.from_location
        toLocation.value = permitData.value.to_location
    } catch (error) {
        console.log(error)
        toast.error('Gagal memuat data. Error: ' + error.message)
    } finally {
        waiting.value = false
    }
}
const fetchData = async () => {
    waiting.value = true;
    try {
        const ret = await axiosIns.get('/permit-lines', {
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
    fetchPermit(permit_id.value)
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

const selectedData = ref(null)
const deleteData = async id => {
  waiting.value = true
  try {
    await axiosIns.delete(`/permit-lines/${id}`)
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

const paginationData = computed(() => {
    return `Showing ${meta.from} to ${meta.to} of ${meta.total}`;
});
</script>

<template>
    <div>
    <VCard :loading="showLoading" class="mb-4">
      <VCardTitle>Detail Sikel</VCardTitle>
      <VDivider />
      <VCardText>
          <VRow>
            <VCol cols="4">
              <VTextField
                v-model="documentNumber"
                label="Document Number"
                variant="filled"
                readonly
              />
            </VCol>
            <VCol cols="4">
              <VTextField
                v-model="documentDate"
                label="Document Date"
                variant="filled"
                readonly
              />
            </VCol>
            <VCol cols="4">
              <VTextField
                v-model="employeeId"
                label="Employee ID"
                variant="filled"
                readonly
              />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="4">
              <VTextField
                v-model="permitType"
                label="Permit Type"
                variant="filled"
                readonly
              />
            </VCol>
            <VCol cols="4">
              <VTextField
                v-model="fromLocation"
                label="From Location"
                variant="filled"
                readonly
              />
            </VCol>
            <VCol cols="4">
              <VTextField
                v-model="toLocation"
                label="To Location"
                variant="filled"
                readonly
              />
            </VCol>
          </VRow>

          <VRow class="mt-3">
              <VCol
                cols="12"
                class="d-flex justify-end gap-3"
              >
                <VBtn
                  color="warning"
                  :disabled="showLoading"
                  @click="router.back()"
                >
                  Back
                </VBtn>
              </VCol>
            </VRow>
      </VCardText>
    </VCard>

    <VCard>
      <deleteConfirmation :is-visible="deleteConfirmVisible" @status="getDeleteConfirmation" />
      <VCardText>
        <VRow class="d-flex">
          <VCol cols="2" style="max-width: 120px; width: 120px;">
            <VSelect v-model="args.per_page" variant="outlined" :items="[10, 20, 30, 50]" />
          </VCol>
          <VCol class="d-flex gap-4">
            <VTextField placeholder="Find .." v-model="searchQuery" clearable @keyup.enter="findHandler"
              @click:clear="clearHandler" prepend-inner-icon="tabler:search" />
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
        <template #item.duration="{ item }">
          {{ getDuration(item.check_in_at, item.check_out_at) }}
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
