<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import axiosIns from '@/plugins/axios'
import { watchEffect, ref, reactive } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const prop = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['status'])

const name = ref('')
const latitude = ref('')
const longitude = ref('')
const radius = ref('')

const resetForm = () => {
  name.value = ''
  latitude.value = ''
  longitude.value = ''
  radius.value = ''
}

const payload = reactive({
  name,
  latitude,
  longitude,
  radius 
})

const close = (isVisible = false, isOk = false) => {
  resetForm()
  emit('status', { isVisible, isOk })
}

const showLoading = ref(false)

const createData = async () => {
  showLoading.value = true
  try {
    await axiosIns.post('/attendance-locations', { ...payload })
    toast.success('Data created successfully')
    close(false, true)
  } catch (error) {
    console.error(error)
    toast.error('Saving failed! Error: ' + error.message)
  } finally {
    showLoading.value = false
  }
}

const positiveNumberValidator = value => {
  return !isNaN(value) && Number(value) > 0 || 'Must be a positive number'
}

const addForm = ref()
const onSubmit = () => {
  addForm.value?.validate()
    .then(({ valid }) => {
      if (valid) createData()
    })
}
</script>

<template>
  <VDialog v-model="prop.isVisible" width="600">
    <VForm ref="addForm" @submit.prevent="onSubmit">
      <VCard :loading="showLoading">
        <VCardTitle class="d-flex justify-space-between">
          <VLabel>Attendance Location - Add</VLabel>
          <VBtn icon="tabler-x" variant="text" size="x-small" @click="close()" color="error" />
        </VCardTitle>

        <VDivider />

        <VCardText>
          <VRow>
            <VCol cols="6">
              <VTextField
                label="Name"
                v-model="name"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                label="Radius (meters)"
                v-model="radius"
                :rules="[requiredValidator, positiveNumberValidator]"
                type="number"
              />
            </VCol>

            <VCol cols="6">
              <VTextField
                label="Latitude"
                v-model="latitude"
                type="number"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                label="Longitude"
                v-model="longitude"
                type="number"
                :rules="[requiredValidator]"
              />
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
  action: read
  subject: Auth
  redirectIfLoggedIn: false
</route>
