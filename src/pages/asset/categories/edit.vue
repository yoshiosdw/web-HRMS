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
  assetCategory:{
    type: Object,
    required: true
  }
})

const emits = defineEmits([
  'assetCategory', 'isVisible'
])

const sendData = val => {
  emits('assetCategory', val)
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
      const { created_at, updated_at, ...sanitizedObject } = prop.assetCategory;
      updateAssetCategory( sanitizedObject )
    }
  })
}

const savingProcess = ref(false)
const updateAssetCategory = async data => {
  savingProcess.value = true
  try {
    const ret = await axiosIns.patch(`asset/categories/${prop.assetCategory.id}`, data)
    sendData(ret)
  } catch (error) {
    console.log(error)
    toast.error('Gagal mengubah data Kategori')
  } finally {
    savingProcess.value = false
  }
}

const categories = ref()
const categoryLoading = ref(false)
const fetchCategories = async () => {
  categoryLoading.value = true
  try {
    const ret = await axiosIns.get('asset/categories')
    categories.value = ret.data.data
  } catch (error) {
    
  } finally {
    categoryLoading.value = false
  }
}

onMounted(()=>{
  fetchCategories()
})

</script>
<template>
  <VDialog v-model="prop.isVisible" width="1024" persistent>
    <VCard>
      <VCardTitle>
        <VLabel>Ubah Data Kategori Aset</VLabel>
      </VCardTitle>
      <VDivider />
      <VForm ref="refForm" @submit.prevent="onSubmit">
        <VCardText>
          <VRow>
            <VCol cols="6">
              <VTextField v-model="prop.assetCategory.name" />
            </VCol>
            <VCol cols="6">
              <VAutocomplete v-model="prop.assetCategory.parent_id" :items="categories" item-value="id" item-title="name" />
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