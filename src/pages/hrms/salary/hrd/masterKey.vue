<script setup>
import axiosIns from "@/plugins/axios";
import { betweenValidator, requiredValidator } from '@/@core/utils/validators';
import { VDateInput } from 'vuetify/lib/labs/components.mjs'
import { useToast } from 'vue-toastification'
import { useDialogStore } from "./useDialogStore";
import { computed, ref, watchEffect } from "vue";

const props = defineProps({
    saved: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['close'])

const dialogStore = useDialogStore()
const masterKey = ref()
const year = ref(new Date().getFullYear())
const month = ref(new Date().getMonth() + 1)
const isDialogVisible = ref(true)
const toast = useToast()
const dataset = ref([])
const isMasterKeyVisible = ref(false)
const errors = ref({
  masterKey: undefined,
})
const total = ref(0)

const payload = reactive({
    master_key: dialogStore.masterKey ? dialogStore.masterKey : masterKey,
    year: year,
    month: month
})

const meta = reactive({
    total: 0,
    from: 0,
    to: 0,
    last: 0,
    per_page: 10,
    current_page: 1
})

const showLoading = ref(false)
const submitMasterkey = async () => {
  showLoading.value = true;
  try {
    const response = await axiosIns.post('/salaries/by/hrd', {...payload})

    dataset.value = response.data.data
    meta.total = response.data.meta.total
    meta.last = response.data.meta.last
    meta.from = response.data.meta.from
    meta.to = response.data.meta.to
    meta.per_page = response.data.meta.per_page
    meta.current_page = response.data.meta.current_page
    dialogStore.setMasterKey(masterKey.value)
    emit('close', {success: true, masterKey: masterKey.value, dataset: dataset.value, meta:{ ...meta }}) 
    isDialogVisible.value = false
  } catch (error) {
    toast.error('Gagal Submit! Error: ' + error.response.data.message)
  } finally {
    showLoading.value = false
  }
}

const addForm = ref()
const onSubmit = () => {
  addForm.value?.validate()
  .then(({valid: isValid})=>{
    if(isValid) submitMasterkey()
  })
};

</script>

<template>
  <VDialog
  v-model="isDialogVisible"
  width="800"
  persistent
  z-index="800"
  >
  <VCard>
        <VCardTitle>Submit Master Key!</VCardTitle>
        <VForm ref="addForm"
        @submit.prevent="onSubmit"
        >
          <VCardText class="mt-2">
            <VRow>
            <VCol cols="12">
                <div class="d-flex gap 2">
                <VTextField
                v-model="masterKey"
                label="Input Master Key"
                density="compact"
                :rules="[requiredValidator]"
                :type="isMasterKeyVisible ? 'text' : 'password'"
                :error-messages="errors.masterKey"
                :append-inner-icon="
                  isMasterKeyVisible ? 'tabler-eye-off' : 'tabler-eye'
                "
                @click:append-inner="
                  isMasterKeyVisible = !isMasterKeyVisible
                "
                />
                </div>
            </VCol>
            </VRow>
            <VRow>
              <VCol>
                <div class="d-flex justify-end gap-3">
                    <VBtn
                      type="submit"
                      variant="outlined"
                    >
                      Submit
                    </VBtn>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VForm>
      </VCard>
  </VDialog>
</template>

<route lang="yaml">
    meta:
      action: Manage
      subject: Salary
      redirectIfLoggedIn: false
</route>
  