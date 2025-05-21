<script setup>
import { ref, onMounted } from 'vue'
import axiosIns from '@/plugins/axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

const showPasswordResetDialog = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const oldPassword = ref('')
const isOldPasswordVisible = ref(false)

onMounted(() => {
  const shouldReset = localStorage.getItem('needsPasswordReset') === 'true'
  if (shouldReset) {
    showPasswordResetDialog.value = true
  }
})

const submitPasswordReset = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    toast.error('Isi semua field password.')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    toast.error('Konfirmasi password tidak cocok.')
    return
  }

  if (newPassword.value === 'Lbg@1080*') {
    toast.error('Password baru tidak boleh sama dengan password default.')
    return
  }

  if (!oldPassword.value) {
    toast.error('Password lama wajib diisi.')
    return
  }


  isSubmitting.value = true

  try {
    const userData = JSON.parse(localStorage.getItem('appUserData'))
    await axiosIns.post('/users/change-password', {
      user_id: userData.id,
      old_password: oldPassword.value,
      new_password: newPassword.value,
      new_password_confirmation: confirmPassword.value,
    })

    toast.success('Password berhasil diubah. Silakan lanjut.')
    showPasswordResetDialog.value = false
    localStorage.removeItem('needsPasswordReset')
  } catch (err) {
    toast.error('Gagal mengganti password: ' + (err.response?.data?.message || err.message))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VLabel class="d-flex justify-center">
                  <h3>HRMS BY YOSHIO SUDEWA</h3>
                </VLabel>
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <VLabel class="d-flex justify-center">
                  <h5>WEB - HRMS (Human Resource Management System)</h5>
                </VLabel>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Password Reset Dialog -->
    <VDialog v-model="showPasswordResetDialog" persistent max-width="500">
      <VCard>
        <VCardTitle class="text-h6 font-weight-bold">
          Ganti Password
        </VCardTitle>

        <VCardText>
          <p>Anda wajib mengganti password sebelum melanjutkan.</p>
          <VTextField
            v-model="oldPassword"
            label="Password Lama"
            class="mt-3"
            :type="isOldPasswordVisible ? 'text' : 'password'"
            :append-inner-icon="isOldPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
            @click:append-inner="isOldPasswordVisible = !isOldPasswordVisible"
            :rules="[v => !!v || 'Password lama wajib diisi']"
          />

          <VTextField
            v-model="newPassword"
            label="Password Baru"
            class="mt-3"
            :type="isNewPasswordVisible ? 'text' : 'password'"
            :append-inner-icon="isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
            @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
            :rules="[
              v => !!v || 'Password wajib diisi',
              v => v !== 'Lbg@1080*' || 'Password tidak boleh default',
              v => v.length >= 6 || 'Password minimal 6 karakter',
              v => /[A-Z]/.test(v) || 'Harus ada huruf kapital (A-Z)',
              v => /[a-z]/.test(v) || 'Harus ada huruf kecil (a-z)',
            ]"
          />

          <VTextField
            v-model="confirmPassword"
            label="Konfirmasi Password Baru"
            class="mt-3"
            :type="isConfirmPasswordVisible ? 'text' : 'password'"
            :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
            @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
            :rules="[
              v => !!v || 'Konfirmasi wajib diisi',
              v => v === newPassword || 'Password tidak cocok',
            ]"
          />

        </VCardText>

        <VCardActions class="justify-end">
          <VBtn color="primary" :loading="isSubmitting" @click="submitPasswordReset">
            Simpan
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<route lang="yaml">
meta:
  action: Read
  subject: Auth
  redirectIfLoggedIn: false
</route>
