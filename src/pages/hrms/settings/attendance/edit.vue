<script setup>
import { isEmpty } from '@/@core/utils'
import { requiredValidator } from '@/@core/utils/validators'
import axiosIns from '@/plugins/axios'
import { watch, ref, reactive } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const prop = defineProps({
  isVisible: {
    type: Boolean,
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
const latitude = ref()
const longitude = ref()
const radius = ref()

const initPayload = () => {
  id.value = prop.data?.id
  name.value = prop.data?.name
  latitude.value = prop.data?.latitude
  longitude.value = prop.data?.longitude
  radius.value = prop.data?.radius
}


const payload = reactive({
  name,
  latitude,
  longitude,
  radius
})

const close = (isVisible = false, isOk = false) => {
  emit('status', { isVisible, isOk })
}

const waiting = ref(false)

const updateData = async () => {
  waiting.value = true
  try {
    await axiosIns.put(`/attendance-locations/${id.value}`, { ...payload })
    toast.success('Data updated successfully')
    close(false, true)
  } catch (error) {
    console.error(error)
    toast.error('Saving failed! Error: ' + error.message)
  } finally {
    waiting.value = false
  }
}

const formEdit = ref()
const onSubmit = () => {
  formEdit.value?.validate()
    .then(({ valid }) => {
      if (valid) updateData()
    })
}

const positiveNumberValidator = value => {
  return !isNaN(value) && Number(value) > 0 || 'Must be a positive number'
}

watch(() => prop.data, val => {
  if (!isEmpty(val)) {
    initPayload()
  }
})
</script>

<template>
  <VDialog v-model="prop.isVisible" width="600" persistent>
    <VForm ref="formEdit" @submit.prevent="onSubmit()">
      <VCard>
        <VCardTitle class="d-flex justify-space-between">
          <VLabel>Attendance Location - Edit</VLabel>
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
                  type="number"
                  :rules="[requiredValidator]"
                />
              </VCol>
            <VCol cols="6">
              <VTextField
                label="Latitude"
                v-model="latitude"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                label="Longitude"
                v-model="longitude"
                :rules="[requiredValidator]"
              />
              
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end gap-4">
          <VBtn @click="close()" color="warning" variant="outlined" :loading="waiting">Cancel</VBtn>
          <VBtn type="submit" color="success" variant="outlined" :loading="waiting">Save</VBtn>
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
