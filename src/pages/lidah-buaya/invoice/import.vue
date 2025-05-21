<script setup>
import { useToast } from 'vue-toastification'
import axiosIns from '@/plugins/axios'

const props = defineProps({
  isVisible:{
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['status'])

const close = ( val = false) => {
  emit('status', { isVisible: false, isConfirm: val })
}

const toast = useToast()

const file = ref(null)
const importWating = ref(false)

const importFile = async () => {
  importWating.value = true
  try {
    const formData = new FormData()

    formData.append('file', file.value)
    await axiosIns.post('/import/excel/lb', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    close(true)
  } catch (error) {
    console.error('Error importing file:', error)
    toast.error('Failed to import file. Error: ' + error.message)
  } finally {
    importWating.value = false
  }
}
</script>

<template>
  <VDialog
    v-model="props.isVisible"
    width="800px"
    persistent=""
  >
    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <VLabel> Import Faktur Pajak</VLabel>
        <VBtn
          icon="tabler-x"
          variant="text"
          size="x-small"
          color="error"
          :loading="importWating"
          @click="close"
        />
      </VCardTitle>
      <VDivider />
      <VCardText>
        <VRow>
          <VCol cols="12">
            <VFileInput
              v-model="file"
              label="File"
              accept=".xls, .xlsx"
              :loading="importWating"
            />
          </VCol>
        </VRow>

        <VRow>
          <VCol cols="12">
            <div class="d-flex justify-end gap-4">
              <VBtn
                color="primary"
                variant="outlined"
                :loading="importWating"
                @click="importFile"
              >
                Import
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<route lang="yaml">
  meta:
    action: Read
    subject: Dashboard
    redirectIfLoggedIn: false
  </route>
