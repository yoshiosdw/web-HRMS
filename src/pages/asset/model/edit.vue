<script setup>
import DialogCloseBtn from '@/@core/components/DialogCloseBtn.vue';
import { requiredValidator } from '@/@core/utils/validators';
import axiosIns from '@/plugins/axios';
import { useToast } from 'vue-toastification';

const prop = defineProps({
  isVisible:{
    type: Boolean,
    required: true
  },
  assetModel:{
    type: Object,
    required: true
  }
})

const emits = defineEmits([
  'assetModel', 'isVisible'
])

const sendData = val => {
  emits('assetModel', val)
  emits('isVisible', false)
}

const closeDialog = () => {
  emits('isVisible', false)
}


const toast = useToast()
const refForm = ref()
const onSubmit = () => {
  refForm.value?.validate()
  .then(({valid: isValid})=>{
    if(isValid) {
      const { category, type, created_at, updated_at, ...sanitizedObject } = prop.assetModel;
      updateAsetModel( sanitizedObject )
    }
  })
}

const savingProcess = ref(false)
const updateAsetModel = async data => {
  savingProcess.value = true
  try {
    const ret = await axiosIns.patch(`asset/models/${prop.assetModel.id}`, data)
    sendData(ret)
  } catch (error) {
    console.log(error)
    toast.error('Gagal membuat data Model')
  } finally {
    savingProcess.value = false
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

</script>
<template>
  <VDialog v-model="prop.isVisible" width="1024" persistent>
    <VCard>
      <VCardTitle>
        <VLabel>Ubah Data Asset Model</VLabel>
      </VCardTitle>
      <VDivider />
      <VForm ref="refForm" @submit.prevent="onSubmit">
        <VCardText>
          <VRow>
            <VCol cols="4">
              <VTextField label="Kode model" :rules="[requiredValidator]" v-model="prop.assetModel.identity_number" />
            </VCol>
            <VCol cols="8">
              <VTextField label="Nama model" :rules="[requiredValidator]" v-model="prop.assetModel.name" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="6">
              <VAutocomplete label="Kategori" :rules="[requiredValidator]" :items="categories" item-title="name"
                item-value="id" v-model="prop.assetModel.asset_category_id" />
            </VCol>
            <VCol cols="6">
              <VAutocomplete label="Tipe" :rules="[requiredValidator]" :items="types" item-title="name" item-value="id"
                v-model="prop.assetModel.asset_type_id" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12">
              <VTextarea label="Keterangan" rows="2" v-model="prop.assetModel.note" />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText>
          <div class="d-flex justify-end gap-4">
            <VBtn @click="closeDialog" color="warning" variant="outlined" :loading="savingProcess">Close
            </VBtn>
            <VBtn type="submit" variant="outlined" :loading="savingProcess">Simpan</VBtn>
          </div>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>