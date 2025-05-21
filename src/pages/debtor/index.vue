<script setup>
import { formatDate, formatDateMySql, formatUang } from '@/@core/utils/formatters';
import axiosIns from '@/plugins/axios';
import { useToast } from 'vue-toastification';
import router from '@/router';
import { computed } from 'vue';
import { VDateInput } from 'vuetify/lib/labs/components.mjs';
import { VDatePicker } from 'vuetify/lib/components/index.mjs';

const toast = useToast()

function getStartOfMonth() {
  const now = new Date(); // Get current date
  return new Date(now.getFullYear(), now.getMonth(), 1); // Set day to 1
}

const fromDate = ref(getStartOfMonth());
const toDate = ref(new Date())

const args = reactive({
  page: 1,
  per_page: 10,
  find: '',
  status: 0,
  from_date: computed(() => formatDateMySql(fromDate.value)),
  to_date: computed(() => formatDateMySql(toDate.value))
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
    const ret = await axiosIns.get("/debtors", {
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
  return `Showing ${meta.from} to ${meta.to} of ${meta.total}`;
});

watchEffect(() => {
  fetchData()
})

const statusName = ref()

const headers = [
  {
    title: '#ACCOUNT',
    key: 'account_number',
  },
  {
    title: 'NAME',
    key: 'company_name',
  },
  {
    title: '# NPWP',
    key: 'exempt_number',
  },
  {
    title: 'NIK',
    key: 'nik',
  },
  {
    title: 'ADDRESS',
    key: 'address1',
  },
  {
    title: 'LAST MODIFIED',
    key: 'debtor_updated_at',
  },
]

const synchHandler = async () => {
  waiting.value = true
  try {
    await axiosIns.post('/debtors/sync', {})
  } catch (error) {
    toast.error('Sync Gagal. Error: ' + error.message)
    console.log(error);
  } finally {
    waiting.value = false
    fetchData()
  }
}

const sample = () => {
  switch (key) {
    case value:
      
      break;
  
    default:
      break;
  }
}

</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <VRow>
          <VCol style="max-width: 120px; width: 120px;">
            <VSelect v-model="args.per_page" variant="outlined" :items="[10, 20, 30, 50, 100, 1000, 5000]"
              :loading="waiting" />
          </VCol>
          <VCol class="d-flex gap-4">
            <VTextField placeholder="Cari data .." v-model="searchQuery" clearable @keyup.enter="findHandler"
              @click:clear="clearHandler" :loading="waiting" />

            <div class="d-flex justify-end gap-4">
              <VBtn prepend-icon="tabler:bolt" variant="outlined" color="warning" @click="synchHandler" :loading="waiting">
                Sync Debtor
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCardText>
      <VDivider />
      <VDataTableServer :items="dataset" :headers="headers" item-value="doc_key" :loading="waiting">
        <template #item.company_name="{item}">
          <div class="text-no-wrap">
            {{ item.company_name }}
          </div>
        </template>
        <template #item.address1="{item}">
          <div class="text-no-wrap">
            {{ item.address1 }}
          </div>
        </template>
        <template #item.debtor_updated_at="{item}">
          <div class="text-no-wrap">
            {{ item.debtor_updated_at }}
          </div>
        </template>
        <template #bottom>
          <VDivider />
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
    subject: Dashboard
    redirectIfLoggedIn: false
  </route>