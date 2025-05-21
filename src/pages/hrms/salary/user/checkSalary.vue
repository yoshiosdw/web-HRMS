<script setup>
import axiosIns from "@/plugins/axios";
import { betweenValidator, requiredValidator } from '@/@core/utils/validators';
import { VDateInput } from 'vuetify/lib/labs/components.mjs'
import { useToast } from 'vue-toastification'
import { ref } from "vue";

const emit = defineEmits(['close'])
const toast = useToast()
const pin = ref('')
const year = ref(new Date().getFullYear())
const month = ref(new Date().getMonth() + 1)
const dataset = ref([])
const isSalaryKeyVisible = ref(false)
const errors = ref({
  pin: undefined,
})
const payload = reactive({
    pin: pin,
    year_period: year,
    month_period: month
})

const showLoading = ref(false)

const months = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
]

const yearOptions = Array.from({ length: 101 }, (_, i) => 2000 + i);


const downloadMySalary = async () => {
  try {
    const response = await axiosIns.post('/salaries/print', {...payload},
            { responseType: 'blob' }, 
        )
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))

    window.open(url, '_blank')
    console.log(response.data)
    toast.success('File berhasil didownload!')
  } catch (error) {
   if (error.response && error.response.data instanceof Blob) {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const err = JSON.parse(reader.result)
          console.log(err.message)
          toast.error('Error, ' + err.message)
        } catch (e) {
          console.log('Gagal membaca pesan error blob')
          toast.error('Gagal, tidak diketahui')
        }
      }
      reader.readAsText(error.response.data)
    } else {
      console.log(error)
      toast.error('Terjadi kesalahan')
    }
  }
}

const addForm = ref()
const onSubmit = () => {
  addForm.value?.validate()
  .then(({valid: isValid})=>{
    if(isValid) downloadMySalary()
  })
};
</script>

<template>
    <div>
      <VCard>
        <VCardTitle>Cek My Salary</VCardTitle>
        <VForm ref="addForm"
        @submit.prevent="onSubmit"
        >
          <VCardText class="mt-2">
            <VRow class="d-flex flex-wrap align-center">
            <VCol cols="12" sm="4">
                <div class="d-flex gap 2">
                <VTextField
                v-model="pin"
                label="Input Pin"
                density="compact"
                clearable
                :rules="[requiredValidator]"
                :type="isSalaryKeyVisible ? 'text' : 'password'"
                :error-messages="errors.pin"
                :append-inner-icon="isSalaryKeyVisible ? 'tabler-eye-off' : 'tabler-eye' "
                @click:append-inner="
                  isSalaryKeyVisible = !isSalaryKeyVisible"
                />
                </div>
            </VCol>
            <VCol cols="12" sm="4">
              <VSelect
                v-model="month"
                :items="months"
                item-title="label"
                item-value="value"
                label="Input Month"
                density="compact"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12" sm="4">
              <VSelect
                label="Input Year"
                v-model="year"
                :items="yearOptions"
                density="compact"
                :rules="[requiredValidator]"
              />
            </VCol>
            </VRow>
            <VRow>
              <VCol>
                <div class="d-flex justify-end gap-3">
                    <VBtn
                      type="submit"
                      variant="outlined"
                    >
                      Download
                    </VBtn>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VForm>
      </VCard>
    </div>
</template>

<route lang="yaml">
  meta:
    action: Read
    subject: Salary
    redirectIfLoggedIn: false
</route>
