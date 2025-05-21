<script setup>
import { formatRibuan } from '@/@core/utils/formatters';
import axiosIns from '@/plugins/axios';
import { useToast } from 'vue-toastification';
import router from '@/router';
import { computed } from 'vue';
import { VDateInput } from 'vuetify/lib/labs/components.mjs';

const toast = useToast()

const args = computed(() => {
  return {
    page: page,
    per_page: perPage,
  }
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
    const ret = await axiosIns.get("/synchronize")
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
  find = searchQuery.value
}

const clearHandler = () => {
  find = ''
}

const paginationData = computed(() => {
  return `Showing ${meta.from} to ${meta.to} of ${meta.total}`;
});

watchEffect(() => {
  fetchData()
})

const headers = [
  {
    title: 'TABLE',
    key: 'table_name',
  },
  {
    title: 'LAST SYNC',
    key: 'last_sync_at',
  },
  {
    title: 'STATUS',
    key: 'status',
  },
  {
    title: 'MESSAGE',
    key: 'message',
  },
  
]

const updateOptions = options => {
  args.sort_by = options.sortBy[0]?.key || 'last_sync_at'
  args.sort_order = options.sortBy[0]?.order || 'desc'
}

const selectedItem = ref([]);

</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <VRow>
          <VCol style="max-width: 120px; width: 120px;">
            <VSelect v-model="perPage" variant="outlined" :items="[10, 20, 30, 50]" :loading="waiting" />
          </VCol>
          <VCol class="d-flex gap-4">
            <VTextField placeholder="Cari data .." v-model="searchQuery" clearable @keyup.enter="findHandler"
              @click:clear="clearHandler" :loading="waiting" />
              </VCol>
        </VRow>
        <VRow>
          <VCol cols="3">
            <VDateInput density="compact" prepend-icon="" label="From Date" />
          </VCol>
          <VCol cols="3">
            <VDateInput density="compact" prepend-icon="" label="From Date" />
          </VCol>
          <VCol cols="6">
            <VAutocomplete :items="[{id: 1, name: 'New'}, {id: 2, name: 'Modified'}, {id: 3, name: 'Exported'}]"
              item-value="id" item-title="name" label="Status" dense clearable=""
            />
          </VCol>
        </VRow>
      </VCardText>
      <VDivider />
      <VDataTableServer :items="dataset" :headers="headers" item-value="DocKey" :loading="waiting"
        @update:options="updateOptions">
        <template #bottom>
          <VDivider />
          <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4">
            <span class="text-sm text-disabled">
              {{ paginationData }}
            </span>
            <VPagination v-model="page" variant="outlined" size="small" :length="meta.last" :total-visible="5" />
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