<script setup>
import { betweenValidator, requiredValidator } from '@/@core/utils/validators';
import axiosIns from '@/plugins/axios';
import { onMounted, watchEffect } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast()
const prop = defineProps({
  isVisible:{
    type:Boolean,
    required: true
  }
})

const emit = defineEmits(['status'])

const name = ref()

const close = (isVisible = false, isOk = false) => {
  resetForm()
  emit('status', {isVisible: isVisible, isOk: isOk})
}

const payload = reactive({
  name: name,
})

const resetForm = () => {
  name.value = null
}

const showLoading = ref(false)
const createData = async () => {
  showLoading.value = true;
  try {
    await axiosIns.post('/permit-types', {...payload})
    close(false, true)
  } catch (error) {
    console.log(error)
    toast.error('Saving failed! Error: ' + error.message)
  } finally {
    showLoading.value = false
  }
}



const addForm = ref()
const onSubmit = () => {
  addForm.value?.validate()
  .then(({valid: isValid})=>{
    if(isValid) createData()
  })
}

</script>
<template>
  <VDialog v-model="prop.isVisible" width="1024">
    <VForm ref="addForm" @submit.prevent="onSubmit">
      <VCard :loading="showLoading">
        <VCardTitle class="d-flex justify-space-between">
          <VLabel>Permit Type - Add </VLabel>
          <VBtn icon="tabler-x"  variant="text" size="x-small" @click="close()" color="error"/>
        </VCardTitle>
        <VDivider />
        <VCardText>
          <VRow>
            
            <VCol cols="12">
              <VTextField label="Name" v-model="name" :rules="[requiredValidator]" />
            </VCol>
          </VRow>
          
        </VCardText>
        <VCardText class="d-flex justify-end gap-4">
          <VBtn @click="close(false, false)" color="warning" variant="outlined" :loading="showLoading">Cancel</VBtn>
          <VBtn type="submit" color="success" variant="outlined" :loading="showLoading">Save</VBtn>
        </VCardText>
      </VCard>
    </VForm>
  </VDialog>
</template>
<route lang="yaml">
  meta:
    action: read,
    subject: Auth
    redirectIfLoggedIn: false
</route>