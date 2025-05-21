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
const citizen_id = ref()
const name = ref()

const initPayload = () => {
  id.value = prop.data?.id
  citizen_id.value = prop.data?.citizen_id
  name.value = prop.data?.name
}

const payload = reactive({
  citizen_id: null,
  name: null,
  birth_date: null,
  birth_place: null,
  gender: null,
  religion: null,
  address: null,
  city: null,
  province: null,
  country: null,
  postal_code: null,
  marital_status: null,
  blood_type: null,
  phone_number: null,
  alternate_phone_number: null,
  email: null
})

const close = (isVisible = false, isOk = false) => {
  emit('status', {isVisible: isVisible, isOk: isOk})
}

const waiting = ref(false)
const updateData = async () => {
  waiting.value = true
  try {
    await axiosIns.put(`/people/${id.value}`, {...payload})
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
})

</script>
<template>
  <VDialog v-model="prop.isVisible" width="1024" persistent>
    <VForm ref="formEdit" @submit.prevent="onSubmit()">
      <VCard>
        <VCardTitle class="d-flex justify-space-between">
          <VLabel>Person - Edit</VLabel>
          <VBtn icon="tabler-x"  variant="text" size="x-small" @click="close()" color="error"/>
        </VCardTitle>
        <VDivider />
        <VCardText>
          <VRow>
            <VCol cols="4">
              <VTextField label="Citizen ID" v-model="citizen_id" />
            </VCol>
            <VCol cols="8">
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