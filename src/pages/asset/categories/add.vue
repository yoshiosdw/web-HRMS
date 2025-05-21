<script setup>
import DialogCloseBtn from '@/@core/components/DialogCloseBtn.vue';
import axiosIns from '@/plugins/axios';
import { useToast } from 'vue-toastification';

const prop = defineProps({
  isLoading: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['assetCategory'])
const sendData = val => {
  emits('assetCategory', val)
}
const toast = useToast()
const refForm = ref()
const assetCategory = reactive({
  name: null
})
const onSubmitHandler = () => {
  refForm.value?.validate()
  .then(({valid: isValid})=>{
    if(isValid) createAssetCategory()
  })
}

const savingProcess = ref(false)
const createAssetCategory = async () => {
  try {
    const ret = axiosIns.post('/asset/categories', assetCategory)
    sendData(ret)
    isVisible.value = false
  } catch (error) {
    console.log(error)
    toast.error('Gagal meembuat data Kategori')
  } finally {
    savingProcess.value = false
  }
}
const isVisible = ref(false)

</script>
<template>
  <VDialog v-model="isVisible" width="600" persistent>
    <template #activator="{props}">
      <VBtn v-bind="props" prepend-icon="tabler:plus" variant="outlined" :loading="prop.isLoading">Tambah</VBtn>
    </template>
    <DialogCloseBtn @click="isVisible = !isVisible"/>
    <VCard>
      <VCardTitle>
        <VLabel>Tambah Asset Category</VLabel>
      </VCardTitle>
      <VDivider />
      <VCardText>
        <VForm ref="refForm" @submit.prevent="onSubmitHandler">
          <VRow>
            <VCol cols="12">
              <VTextField label="Nama Kategori" v-model="assetCategory.name"/>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" class="d-flex justify-end gap-4">
              <VBtn color="warning" @click="isVisible = !isVisible" variant="outlined">Cancel</VBtn>
              <VBtn type="submit" variant="outlined">Save</VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<route lang="yaml">
  meta:
    action: read
    subject: Auth
    redirectIfLoggedIn: false
  </route>