<script setup>
import { ref, onMounted } from 'vue'
import axiosIns from '@/plugins/axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

const showPasswordResetDialog = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)

onMounted(() => {
  const shouldReset = localStorage.getItem('needsPasswordReset') === 'true'
  if (shouldReset) {
    showPasswordResetDialog.value = true
  }
})

const submitPasswordReset = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    toast.error("Isi semua field password.")
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    toast.error("Konfirmasi password tidak cocok.")
    return
  }

  isSubmitting.value = true

  try {
    const userData = JSON.parse(localStorage.getItem('appUserData'))
    await axiosIns.post('/users/change-password', {
      user_id: userData.id,
      old_password: 'Lbg@1080*',
      new_password: newPassword.value,
      new_password_confirmation: confirmPassword.value,
    })

    toast.success("Password berhasil diubah. Silakan lanjut.")
    showPasswordResetDialog.value = false
    localStorage.removeItem('needsPasswordReset')
  } catch (err) {
    toast.error("Gagal mengganti password: " + (err.response?.data?.message || err.message))
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
                  <h3>LIDAH BUAYA GROUP</h3>
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
    <VDialog
      v-model="showPasswordResetDialog"
      persistent
      max-width="500"
    >
      <VCard>
        <VCardTitle>Ganti Password</VCardTitle>
        <VCardText>
          <p>Anda wajib mengganti password sebelum melanjutkan.</p>
          <VTextField
            v-model="newPassword"
            label="Password Baru"
            type="password"
          />
          <VTextField
            v-model="confirmPassword"
            label="Konfirmasi Password Baru"
            type="password"
          />
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn
            color="primary"
            :loading="isSubmitting"
            @click="submitPasswordReset"
          >
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
