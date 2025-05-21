<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import axiosIns from '@/plugins/axios'
import { watch, ref, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import { isEmpty } from '@/@core/utils'

const toast = useToast()

const prop = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
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

const showLoading = ref(false)
const id = ref()

const initPayload = () => {
  id.value = prop.data?.id
  citizen_id.value = prop.data?.citizen_id
  name.value = prop.data?.name
  birth_date.value = prop.data?.birth_date
  birth_place.value = prop.data?.birth_place
  gender.value = prop.data?.gender
  religion.value = prop.data?.religion
  address.value = prop.data?.address
  city.value = prop.data?.city
  province.value = prop.data?.province
  country.value = prop.data?.country
  postal_code.value = prop.data?.postal_code
  marital_status.value = prop.data?.marital_status
  blood_type.value = prop.data?.blood_type
  phone_number.value = prop.data?.phone_number
  alternate_phone_number.value = prop.data?.alternate_phone_number
  email.value = prop.data?.email
}

const close = (isVisible = false, isOk = false) => {
  emit('status', { isVisible, isOk })
}

const payload = reactive({
  citizen_id: citizen_id,
  name: name,
  birth_date: birth_date,
  birth_place: birth_place,
  gender: gender,
  religion: religion,
  address: address,
  city: city,
  province: province,
  country: country,
  postal_code: postal_code,
  marital_status: marital_status,
  blood_type: blood_type,
  phone_number: phone_number,
  alternate_phone_number: alternate_phone_number,
  email: email,
})

const updateData = async () => {
  showLoading.value = true
  try {
    await axiosIns.patch(`/person/${id.value}`, { ...payload })
    close(false, true)
  } catch (error) {
    console.error(error)
    toast.error('Saving failed! Error: ' + error.message)
  } finally {
    showLoading.value = false
  }
}

const editForm = ref()
const onSubmit = () => {
  editForm.value?.validate().then(({ valid }) => {
    if (valid) updateData()
  })
}

watch(() => prop.data, (val) => {
  if (!isEmpty(val)) {
    initPayload()
  }
})
</script>

<template>
  <VDialog v-model="prop.isVisible" width="1024">
    <VForm ref="editForm" @submit.prevent="onSubmit">
      <VCard :loading="showLoading">
        <VCardTitle class="d-flex justify-space-between">
          <VLabel>Person - Edit</VLabel>
          <VBtn icon="tabler-x" variant="text" size="x-small" @click="close()" color="error" />
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
              <VTextField label="Birth Place" v-model="birth_place" />
            </VCol>
            <VCol cols="4">
              <VSelect label="Gender" v-model="gender" :items="['Male', 'Female']" clearable />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="4">
              <VSelect label="Religion" v-model="religion" :items="['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']" clearable />
            </VCol>
            <VCol cols="8">
              <VTextField label="Address" v-model="address" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="4">
              <VTextField label="City" v-model="city" />
            </VCol>
            <VCol cols="4">
              <VTextField label="Province" v-model="province" />
            </VCol>
            <VCol cols="4">
              <VTextField label="Country" v-model="country" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="4">
              <VTextField label="Postal Code" v-model="postal_code" />
            </VCol>
            <VCol cols="4">
              <VSelect label="Marital Status" v-model="marital_status" :items="['-', 'Single', 'Married', 'Divorced', 'Widowed']" clearable />
            </VCol>
            <VCol cols="4">
              <VSelect label="Blood Type" v-model="blood_type" :items="['-', 'A', 'B', 'AB', 'O']" clearable />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="6">
              <VTextField label="Phone Number" v-model="phone_number" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="6">
              <VTextField label="Alternate Phone" v-model="alternate_phone_number" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12">
              <VTextField label="Email" v-model="email" />
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
