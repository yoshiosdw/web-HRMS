<script setup>
import { isEmpty } from '@/@core/utils';
import { betweenValidator, requiredValidator } from '@/@core/utils/validators';
import axiosIns from '@/plugins/axios';
import { onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast()
const prop = defineProps({
  isVisible:{
    type:Boolean,
    required: true
  }, 
  data: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['status'])

const id = ref()
const name = ref()


const initPayload = () => {
  id.value = prop.data?.id
  name.value = prop.data?.name
}

const payload = reactive({
  name: name,
})

const close = (isVisible = false, isOk = false) => {
  emit('status', {isVisible: isVisible, isOk: isOk})
}

const waiting = ref(false)
const updateData = async () => {
  waiting.value = true
  try {
    await axiosIns.patch(`/employment/statuses/${id.value}`, {...payload})
    close(false, true)
  } catch (error) {
    console.log(error);
    toast.error('Saving failed! Error: ' + error.message)
  } finally {
    waiting.value = false
  }
}

const formEdit = ref()
const onSubmit = () => {
  formEdit.value?.validate()
  .then(({valid: isValid})=>{
    if (isValid) updateData()
  })
} 

watch(() => prop.data, val => {
  if(!isEmpty(val)){
    initPayload()
  }
});

</script>
<template>
  <VDialog v-model="prop.isVisible" width="1024" persistent>
    <VForm ref="formEdit" @submit.prevent="onSubmit()">
      <VCard>
        <VCardTitle class="d-flex justify-space-between">
          <VLabel>Employee Status - Edit</VLabel>
          <VBtn icon="tabler-x"  variant="text" size="x-small" @click="close()" color="error"/>
        </VCardTitle>
        <VDivider />
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField label="Name" v-model="name" />
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end gap-4">
          <VBtn @click="close()" color="warning" variant="outlined" :loading="showLoading">Cancel</VBtn>
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