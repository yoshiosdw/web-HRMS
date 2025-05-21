<script setup>
const prop = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  headerTitle: {
    type: String,
    required: true
  },
  contentText: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['isVisible', 'confirm'])

const confirm = val => {
  emits('confirm', val)
  emits('isVisible', false)
}

const cancel = () => {
  emits('isVisible', false)
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
            <h2>{{ prop.headerTitle }}</h2>
          </VLabel>
        </div>
        <div class="d-flex align-center justify-center">
          <VLabel>
            <h4>{{ prop.contentText }}</h4>
          </VLabel>
        </div>
        <div class="d-flex align-center justify-center mx-auto my-10 gap-6">
          <VBtn @click="cancel">Batal</VBtn>
          <VBtn color="error" @click="confirm(prop.data)">Yakin!</VBtn>
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