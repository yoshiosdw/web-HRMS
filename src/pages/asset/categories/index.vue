<script setup>
import axiosIns from '@/plugins/axios';
import { watchEffect } from 'vue';
import { useToast } from 'vue-toastification';
import AssetCategoryAdd from './add.vue'
import ConfirmDialog from '@/@core/components/ConfirmDialog.vue';
import AssetCategoryUpdate from './edit.vue'

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

const assetCategores = ref([])
const fetchAssetCategories = async (perPage, page, find) => {
  showLoading.value = true
  try {
    const ret = await axiosIns.get('/asset/categories', {
      params: {
        page: page,
        per_page: perPage,
        find: find
      }
    })
    assetCategores.value = ret.data.data
    total.value = ret.data.meta.total
    last.value = ret.data.meta.last
    from.value = ret.data.meta.from
    to.value = ret.data.meta.value
  } catch (error) {
    toast.error('Gagal memuat data Kategori Aset')
  } finally {
    showLoading.value = false
  }
}

const paginationData = computed(() => {
  return `Showing ${from.value} to ${to.value} of ${total.value}`;
});

watchEffect(() => {
  fetchAssetCategories(perPage.value, page.value, find.value)
})

const findHandler = () => {
  find.value = searchQuery.value
}

const clearHandler = () => {
  find.value = ''
}

const getAssetCategory = val => {
  if (val) fetchAssetCategories(perPage.value, page.value, find.value)
}

const confirmVisible = ref(false)
const showConfirm = () => {
  confirmVisible.value = true
}

const updateFormVisible = ref(false)
const assetCategory = ref(null)
const update = data => {
  updateFormVisible.value = true
  assetCategory.value = data
}

const setStatusVisible = val => {
  updateFormVisible.value = val
}

const fixingDataHandler = async () => {
  try {
    await axiosIns.post('/asset/categories/fix', null);
    toast.success('Fixing sukses')
  } catch (error) {
    toast.error(error.data.message)
  }
}

</script>
<template>
  <div>
    <AssetCategoryUpdate :is-visible="updateFormVisible" :asset-category="assetCategory"
      @isVisible="setStatusVisible" />

    <ConfirmDialog :confirmation-msg="Hai" :is-dialog-visible="confirmVisible" />
    <VCard :loading="showLoading">
      <VCardText class="d-flex gap-4">
        <div class="me-3" style="width: 80px;">
          <VSelect v-model="perPage" density="compact" variant="outlined" :items="[10, 20, 30, 50]" />
        </div>
        <VTextField placeholder="Cari data .." v-model="searchQuery" clearable @keyup.enter="findHandler"
          @click:clear="clearHandler" />
        <div class="d-flex flex-wrap gap-4">
          <AssetCategoryAdd @asset-category="getAssetCategory" :is-loading="showLoading"/>
          <VBtn prepend-icon="tabler-arrow-down" variant="outlined" :loading="showLoading">
            Import
          </VBtn>
          <VBtn prepend-icon="tabler-file-excel" variant="outlined" :loading="showLoading">
            Export to Excel
          </VBtn>
          <VBtn prepend-icon="tabler-file-excel" variant="outlined" @click="fixingDataHandler" :loading="showLoading">
            Fix Data
          </VBtn>
        </div>
      </VCardText>
      <VTable class="text-uppercase text-no-wrap">
        <thead style="background-color: #efefef">
          <tr>
            <th scope="col">Aksi</th>
            <th scope="col">Nama</th>
            <th scope="col">Parent</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in assetCategores" :key="data.id">
            <td>
              <div class="d-flex flex-column justify-center">
                <VBtn icon variant="text" color="default" size="x-small">
                  <VIcon :size="22" icon="tabler-dots-vertical" />
                  <VMenu activator="parent">
                    <VList>
                      <VListItem value="user">
                        <VListItemTitle>
                          <VIcon color="success" icon="carbon:category-new" size="24" class="me-3" />
                          Sub Kategori
                        </VListItemTitle>
                      </VListItem>
                      <VDivider />
                      <VListItem @click="update(data)">
                        <VListItemTitle>
                          <VIcon color="success" icon="tabler-pencil" size="24" class="me-3" />
                          Ubah
                        </VListItemTitle>
                      </VListItem>
                      <VListItem value="user">
                        <VListItemTitle>
                          <VIcon color="error" icon="tabler-trash" size="24" class="me-3" @click="showConfirm" />
                          Hapus
                        </VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                </VBtn>
              </div>
            </td>
            <td>{{ data.name }}</td>
            <td>{{ data.parent ? data.parent.name : '-' }}</td>
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