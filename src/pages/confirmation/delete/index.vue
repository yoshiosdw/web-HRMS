<script setup>
const prop = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['status'])

const confirm = val => {
  emit('status', {isVisible: false, confirm: true})
}

const cancel = () => {
  emit('status', { isVisible: false, confirm: false })
}

</script>
<template>
  <VDialog v-model="prop.isVisible" width="450" persistent transition="scale">
    <VCard>
      <VCardText>
        <div class="d-flex align-center justify-center mx-auto my-10">
          <VIcon icon="tabler:question-circle" size="150" color="warning"/>
        </div>
        <div class="d-flex align-center justify-center mx-auto">
          <VLabel>
            <h2>DELETE DATA</h2>
          </VLabel>
        </div>
        <div class="d-flex align-center justify-center">
          <VLabel>
            <h4>Data akan terhaus secara permanen, yakin?</h4>
          </VLabel>
        </div>
        <div class="d-flex align-center justify-center mx-auto my-10 gap-6">
          <VBtn @click="cancel">Batal</VBtn>
          <VBtn color="error" @click="confirm">Yakin!</VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>
<route lang="yaml">
  meta:
    action: read
    subject: Auth
    redirectIfLoggedIn: false
</route>