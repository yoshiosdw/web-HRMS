<script setup>
import DialogCloseBtn from '@/@core/components/DialogCloseBtn.vue';
import { requiredValidator } from '@/@core/utils/validators';
import axiosIns from '@/plugins/axios';
import { useToast } from 'vue-toastification';

const emits = defineEmits([
  'assetModel'
])

const sendData = val => {
  emits('assetModel', val)
}

const toast = useToast()
const isVisible = ref(false)
const refForm = ref()
const onSubmit = () => {
  refForm.value?.validate()
  .then(({valid: isValid})=>{
    if(isValid) createAssetModel()
  })
}

const savingProcess = ref(false)
const createAssetModel = async () => {
  savingProcess.value = true
  try {
    const ret = await axiosIns.post('asset/models', assetModel)
    sendData(ret)
    isVisible.value = false
  } catch (error) {
    console.log(error)
    toast.error('Gagal membuat data Model')
  } finally {
    savingProcess.value = true
  }
}

const categories = ref()
const categoryLoading  = ref(false)
const fetchCategories = async () => {
  categoryLoading.value = true
  try {
    const ret = await axiosIns.get('/asset/categories');
    categories.value = ret.data.data

  } catch (error) {
    console.log(error);
    toast.error('Gagal memuat data Kategori')
  } finally {
    categoryLoading.value = false
  }
}

const types = ref()
const fetchType = async () => {
  try {
    const ret = await axiosIns.get('asset/types')
    types.value = ret.data.data
  } catch (error) {
    console.log(error)
    toast.error('Gagal memuat data Tipe Aset')
  } 
}

onMounted(()=>{
  fetchCategories(), 
  fetchType()
})

const assetModel = reactive({
  identity_number: null,
  name: null,
  asset_category_id: null,
  asset_type_id: null,
  note: null
})

</script>
<template>
  <VDialog v-model="isVisible" width="1024" persistent>
    <template #activator="{props}">
      <VBtn v-bind="props" prepend-icon="tabler:plus" variant="outlined">Tambah</VBtn>
    </template>
    <VCard>
      <VCardTitle>
        <VLabel>Tambah Data Asset Model</VLabel>
      </VCardTitle>
      <VDivider />
      <VForm ref="refForm" @submit.prevent="onSubmit">
        <VCardText>
          <VRow>
            <VCol cols="4">
              <VTextField label="Kode model" :rules="[requiredValidator]" v-model="assetModel.identity_number"/>
            </VCol>
            <VCol cols="8">
              <VTextField label="Nama model" :rules="[requiredValidator]" v-model="assetModel.name"/>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="6">
              <VAutocomplete label="Kategori" :rules="[requiredValidator]" :items="categories" item-title="name"
                item-value="id" v-model="assetModel.asset_category_id"/>
            </VCol>
            <VCol cols="6">
              <VAutocomplete label="Tipe" :rules="[requiredValidator]" :items="types" item-title="name"
                item-value="id" v-model="assetModel.asset_type_id"/>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12">
              <VTextarea label="Keterangan" rows="2" v-model="assetModel.note"/>
            </VCol>
          </VRow>
        </VCardText>
        
        <VCardText>
          <div class="d-flex justify-end gap-4">
            <VBtn @click="isVisible = !isVisible" color="warning" variant="outlined" :loading="savingProcess">Close</VBtn>
            <VBtn type="submit" variant="outlined" :loading="savingProcess">Simpan</VBtn>
          </div>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>