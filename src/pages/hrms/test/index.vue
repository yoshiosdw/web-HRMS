<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { requiredValidator } from '@/@core/utils/validators'

const toast = useToast()
const router = useRouter()

const masterKey = ref('')
const isMasterKeyVisible = ref(false)
const showLoading = ref(false)

const addForm = ref()
const errors = ref({ masterKey: undefined })

const onSubmit = () => {
  addForm.value?.validate().then(({ valid }) => {
    if (valid) {
      submitMasterKey()
    }
  })
}

const submitMasterKey = () => {
  showLoading.value = true
  try {
    // Simpan master key ke localStorage agar bisa digunakan di dashboard
    localStorage.setItem('master_key', masterKey.value)

    toast.success('Master key berhasil disimpan!')

    // Redirect ke dashboard
    router.push({ name: 'hrms-test-dashboard' })
  } catch (error) {
    console.error(error)
    toast.error('Terjadi kesalahan saat menyimpan master key.')
  } finally {
    showLoading.value = false
  }
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>Submit Master Key</v-card-title>
          <v-card-text>
            <v-form ref="addForm" @submit.prevent="onSubmit">
              <v-text-field
                v-model="masterKey"
                label="Input Master Key"
                density="compact"
                :rules="[requiredValidator]"
                :type="isMasterKeyVisible ? 'text' : 'password'"
                :error-messages="errors.masterKey"
                :append-inner-icon="isMasterKeyVisible ? 'tabler-eye-off' : 'tabler-eye'"
                @click:append-inner="isMasterKeyVisible = !isMasterKeyVisible"
              />

              <v-btn
                :loading="showLoading"
                type="submit"
                color="primary"
                block
                class="mt-4"
              >
                Submit
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="yaml">
meta:
  action: Manage
  subject: Auth
  redirectIfLoggedIn: false
</route>
