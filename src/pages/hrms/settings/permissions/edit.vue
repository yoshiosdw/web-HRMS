<script setup>
import { requiredValidator } from '@/@core/utils/validators';
import axiosIns from '@/plugins/axios';
import { watch, ref, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { isEmpty } from '@/@core/utils';

const toast = useToast();

const prop = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['status']);

const name = ref('');
const id = ref('');
const showLoading = ref(false);

const initPayload = () => {
  id.value = prop.data?.id || '';
  name.value = prop.data?.name || '';
};

const close = (isVisible = false, isOk = false) => {
  emit('status', { isVisible, isOk });
};

const payload = reactive({
  name,
});

const updateData = async () => {
  showLoading.value = true;
  try {
    await axiosIns.patch(`/permissions/${id.value}`, { ...payload });
    close(false, true);
  } catch (error) {
    console.error(error);
    toast.error('Saving failed! Error: ' + error.message);
  } finally {
    showLoading.value = false;
  }
};

const editForm = ref();
const onSubmit = () => {
  editForm.value?.validate().then(({ valid }) => {
    if (valid) updateData();
  });
};

watch(
  () => prop.data,
  val => {
    if (!isEmpty(val)) initPayload();
  }
);
</script>

<template>
  <VDialog v-model="prop.isVisible" width="500">
    <VForm ref="editForm" @submit.prevent="onSubmit">
      <VCard :loading="showLoading">
        <VCardTitle class="d-flex justify-space-between">
          <VLabel>Edit Permission</VLabel>
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
  action: update
  subject: Auth
  redirectIfLoggedIn: false
</route>
