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

const citizen_id = ref()
const name = ref()
const birth_date = ref()
const birth_place = ref()
const gender = ref()
const religion = ref()
const address = ref()
const city = ref()
const province = ref()
const country = ref()
const postal_code = ref()
const marital_status = ref()
const blood_type = ref()
const phone_number = ref()
const alternate_phone_number = ref()
const email = ref()

const close = (isVisible = false, isOk = false) => {
  resetForm()
  emit('status', {isVisible: isVisible, isOk: isOk})
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

const resetForm = () => {
  citizen_id.value = null,
  name.value = null,
  birth_date.value = null,
  birth_place.value = null,
  gender.value = null,
  religion.value = null,
  address.value = null,
  city.value = null,
  province.value = null,
  country.value = null,
  postal_code.value = null,
  marital_status.value = null,
  blood_type.value = null,
  phone_number.value = null,
  alternate_phone_number.value = null,
  email.value = null
}

const showLoading = ref(false)
const createData = async () => {
  showLoading.value = true;
  try {
    await axiosIns.post('/people', {...payload})
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
          <VLabel>Person - Add </VLabel>
          <VBtn icon="tabler-x"  variant="text" size="x-small" @click="close()" color="error"/>
        </VCardTitle>
        <VDivider />
        <VCardText>
          <VRow>
            <VCol cols="4">
              <VTextField label="Citizen ID" v-model="citizen_id" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="8">
              <VTextField label="Name" v-model="name" :rules="[requiredValidator]" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="4">
              <VTextField label="Birth Date" v-model="birth_date" :rules="[requiredValidator]" type="date" />
            </VCol>
            <VCol cols="4">
              <VTextField label="Birth Place" v-model="birth_place" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="4">
              <VTextField label="Gender" v-model="gender" :rules="[requiredValidator]" />
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