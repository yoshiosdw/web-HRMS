<script setup>
import axiosIns from '@/plugins/axios';
import { watchEffect } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast()
const showLoading = ref(false)
const perPage = ref(10)
const page = ref(1)
const total = ref(0)
const last = ref(0)
const from = ref(0)
const to = ref(0)
const searchQuery = ref()
const find = ref()

const employees = ref([])
const fethcEmployees = async (perPage, page, find) => {
  showLoading.value = true
  try {
    const ret = await axiosIns.get('/employees', {
      params: {
        page: page,
        per_page: perPage,
        find: find
      }
    })
    employees.value = ret.data.data
    total.value = ret.data.meta.total
    last.value = ret.data.meta.last
    from.value = ret.data.meta.from
    to.value = ret.data.meta.value
  } catch (error) {
    toast.error('Gagal memuat data Organisasi')
  } finally {
    showLoading.value = false
  }
}

const paginationData = computed(() => {
  return `Showing ${from.value} to ${to.value} of ${total.value}`;
});

watchEffect(() => {
  fethcEmployees(perPage.value, page.value, find.value)
})

const findHandler = () => {
  find.value = searchQuery.value
}

const clearHandler = () => {
  find.value = ''
}

</script>
<template>
  <div>
    <VCard>
      <VCardText class="d-flex gap-4">
        <div class="me-3" style="width: 80px;">
          <VSelect v-model="perPage" density="compact" variant="outlined" :items="[10, 20, 30, 50]" />
        </div>
        <VTextField placeholder="Cari data .." v-model="searchQuery" clearable />
        <div class="d-flex flex-wrap gap-4">
          <VBtn prepend-icon="tabler-plus" variant="outlined">
            Tambah
          </VBtn>
        </div>
      </VCardText>
      <VTable class="text-uppercase text-no-wrap">
        <thead style="background-color: #efefef">
          <tr>
            <th scope="col">Aksi</th>
            <th scope="col">NIK</th>
            <th scope="col">Nama</th>
            <th scope="col">Organisasi</th>
            <th scope="col">No. Telpon</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in employees" :key="data.id">
            <td>
              <div class="d-flex flex-column justify-center">
                <VBtn icon variant="text" color="default" size="x-small">
                  <VIcon :size="22" icon="tabler-dots-vertical" />
                  <VMenu activator="parent">
                    <VList>
                      <VListItem value="user">
                        <template #prepend>
                          <VIcon color="success" icon="tabler-user" size="24" class="me-3" />
                        </template>
                        <VListItemTitle>Users</VListItemTitle>
                      </VListItem>
                      <VDivider />
                      <VListItem value="user">
                        <template #prepend>
                          <VIcon color="success" icon="tabler-pencil" size="24" class="me-3" />
                        </template>
                        <VListItemTitle>Ubah</VListItemTitle>
                      </VListItem>
                      <VListItem value="user">
                        <VListItemTitle>
                          <VIcon color="error" icon="tabler-trash" size="24" class="me-3" />
                          Hapus
                        </VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                </VBtn>
              </div>
            </td>
            <td>{{ data.identity_number }}</td>
            <td>{{ data.name }}</td>
            <td>{{ data.organization.name }}</td>
            <td>{{ data.phone_number }}</td>
          </tr>
        </tbody>
      </VTable>
      <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4">
        <span class="text-sm text-disabled">
          {{ paginationData }}
        </span>
        <VPagination v-model="page" variant="outlined" size="small" :length="last" :total-visible="5" />
      </VCardText>
    </VCard>
  </div>
</template>

<route lang="yaml">
  meta:
    action: read
    subject: Auth
    redirectIfLoggedIn: false
  </route>