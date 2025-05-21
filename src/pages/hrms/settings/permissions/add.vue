<script setup>
import { requiredValidator } from '@/@core/utils/validators';
import axiosIns from '@/plugins/axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

const prop = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['status']);

const name = ref('');

const resetForm = () => {
  name.value = '';
};

const close = (isVisible = false, isOk = false) => {
  resetForm();
  emit('status', { isVisible, isOk });
};

const payload = reactive({
  name
});

const showLoading = ref(false);

const createData = async () => {
  showLoading.value = true;
  try {
    await axiosIns.post('/permissions', { ...payload });
    close(false, true);
  } catch (error) {
    console.error(error);
    toast.error('Saving failed! Error: ' + error.message);
  } finally {
    showLoading.value = false;
  }
};

const addForm = ref();

const onSubmit = () => {
  addForm.value?.validate().then(({ valid }) => {
    if (valid) createData();
  });
};
</script>

<template>
  <VDialog v-model="prop.isVisible" width="500">
    <VForm ref="addForm" @submit.prevent="onSubmit">
      <VCard :loading="showLoading">
        <VCardTitle class="d-flex justify-space-between">
          <VLabel>Add Permission</VLabel>
          <VBtn icon="tabler-x" variant="text" size="x-small" @click="close()" color="error" />
        </VCardTitle>
        <VDivider />

        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                label="Name"
                v-model="name"
                :rules="[requiredValidator]"
                placeholder="contoh: Auth - Manage"
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
  action: create
  subject: Auth
  redirectIfLoggedIn: false
</route>
