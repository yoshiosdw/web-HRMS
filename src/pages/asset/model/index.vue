<script setup>
import { onMounted, watchEffect } from 'vue';
import AddAssetModel from './add.vue'
import EditAssetModel from './edit.vue'
import { useAssetModelStore } from './useAssetModel';
import Confirmation from '@/pages/confirmation/index.vue'
import axiosIns from '@/plugins/axios';
import { useToast } from 'vue-toastification';

const toast = useToast()
const assetModelStore = useAssetModelStore()
const searchQuery = ref()
const findHandler = () => {
  assetModelStore.find = searchQuery.value
}
const clearHandler = () => {
  assetModelStore.find = null
}

watchEffect(()=>{
  assetModelStore.fetchAssetModel()
})

const getAssetModel = val => {
  if(val) assetModelStore.fetchAssetModel()
}

const isDialogVisible = ref(false)

const getVisibleValue = val => {
    isDialogVisible.value = val
}

const assetModel = ref()
const showDialog = (data) => {
  assetModel.value = data
  isDialogVisible.value = true
}

const paginationData = computed(() => {
  return `Showing ${assetModelStore.from} to ${assetModelStore.to} of ${assetModelStore.total}`;
});

const isConfirmVisible = ref(false)
const showConfirm = data => {
  assetModel.value = data
  isConfirmVisible.value = true
}

const getStatusVisible = val => {
  isConfirmVisible.value = val
  confirmedData.value = null
}

const confirmedData = ref(null)
const getConfirmedData = val => {
  confirmedData.value = val
  deleteData(val)
}

const transactionLoading = ref(false)
const deleteData = async data => {
  transactionLoading.value = true
  try {
    const ret = axiosIns.delete(`/asset/models/${data.id}`)
    // if(ret.data.status = 200) {
      assetModelStore.fetchAssetModel()
      toast.success('Berhasil hapus data')
  } catch (error) {
    console.log(error);
    toast.error('Hapus data gagal!')
  } finally {
    transactionLoading.value = false
  }
}
</script>

<template>
  <div>
    <Confirmation 
      :is-visible="isConfirmVisible" 
      :content-text="'Data akan hilang permanent'" 
      :header-title="'Hapus Data?'" 
      :data="assetModel"
      @isVisible="getStatusVisible"
      @data="getConfirmedData"
    />
    <VCard>
      <VCardText class="d-flex gap-4">
        <div class="me-3" style="width: 80px;">
          <VSelect v-model="assetModelStore.perPage" density="compact" variant="outlined" :items="[10, 20, 30, 50]" />
        </div>
        <VTextField placeholder="Cari data .." v-model="searchQuery" clearable @keyup.enter="findHandler"
          @click:clear="clearHandler" />
        <div class="d-flex flex-wrap gap-4">
          <AddAssetModel @asset-model="getAssetModel" />
          <VBtn prepend-icon="tabler-arrow-down" variant="outlined">
            Import
          </VBtn>
          <VBtn prepend-icon="tabler-file-excel" variant="outlined">
            Export to Excel
          </VBtn>
        </div>
      </VCardText>
      <VTable class="text-uppercase text-no-wrap">
        <thead style="background-color: #efefef">
          <tr>
            <th scope="col">Aksi</th>
            <th scope="col">Asset Model</th>
            <th scope="col">Kategori</th>
            <th scope="col">Tipe</th>
            <th scope="col">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in assetModelStore.asetModels" :key="data.id">
            <td>
              <div class="d-flex flex-column justify-center">
                <VBtn icon variant="text" color="default" size="x-small">
                  <VIcon :size="22" icon="tabler-dots-vertical" />
                  <VMenu activator="parent">
                    <VList>
                      <VListItem @click="showDialog(data)">
                        <VListItemTitle>
                          <VIcon color="primary" icon="tabler-pencil" size="24" class="me-3" />
                          Ubah
                        </VListItemTitle>
                      </VListItem>
                      <VListItem @click="showConfirm(data)">
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
            <td>
              <div>{{ data.identity_number }}</div>
              <small>{{ data.name }}</small>
            </td>
            <td>{{ data.category.name }}</td>
            <td>{{ data.type.name }}</td>
            <td>{{ data.note }}</td>
          </tr>
        </tbody>
      </VTable>

      <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4">
        <span class="text-sm text-disabled">
          {{ paginationData }}
        </span>
        <VPagination v-model="assetModelStore.page" variant="outlined" size="small" :length="assetModelStore.last"
          :total-visible="5" />
      </VCardText>
    </VCard>

    <EditAssetModel :asset-model="assetModel" v-model="isDialogVisible" @isVisible="getVisibleValue" />

  </div>
</template>
<route lang="yaml">
  meta:
    action: read
    subject: Auth
    redirectIfLoggedIn: false
  </route>