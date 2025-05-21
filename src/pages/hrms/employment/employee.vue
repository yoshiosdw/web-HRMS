<script setup>
import axiosIns from '@/plugins/axios'
import Swal from 'sweetalert2'
import { ref, watchEffect, computed } from 'vue'

const emits = defineEmits(['employee'])

const isVisible = ref(false)
const employees = ref([])
const totalEmployees = ref(0)
const perPage = ref(10)
const page = ref(1)
const last = ref(0)
const find = ref('')
const findText = ref('')

const sendData = employee => {
  emits('employee', employee)
  isVisible.value = false
}

const fetchEmployees = async () => {
  try {
    const response = await axiosIns.get('/employees', {
      params: {
        page: page.value,
        perPage: perPage.value,
        find: find.value,
      },
    })

    employees.value = response.data.data
    totalEmployees.value = response.data.meta.total
    last.value = response.data.meta.last
  } catch (error) {
    Swal.fire({
      title: 'LBG',
      text: 'Failed to load Employees',
      icon: 'error',
    })
    console.log(error)
  }
}

const findEmployees = () => {
  page.value = 1
  find.value = findText.value
}

watchEffect(() => {
  fetchEmployees()
})

const paginationData = computed(() => {
  const firstIndex = (page.value - 1) * perPage.value + 1
  const lastIndex = Math.min(page.value * perPage.value, totalEmployees.value)
  return `Showing ${firstIndex} to ${lastIndex} of ${totalEmployees.value}`
})
</script>


<template>
  <VDialog
    v-model="isVisible"
    width="1024"
    transition="dialog-bottom-transition"
    persistent
  >
    <template #activator="{ props }">
      <VBtn v-bind="props">
        Find
      </VBtn>
    </template>

    <DialogCloseBtn @click="isVisible = false" />

    <VCard title="Find Employee">
      <VCardText>
        <VRow>
          <VCol cols="12">
            <div class="d-flex gap-3">
              <div style="min-width: 80px;">
                <VSelect v-model="perPage" :items="[10, 20, 30, 50]" />
              </div>
              <VTextField
                v-model="findText"
                placeholder="Search Employee"
                @keydown.enter="findEmployees"
              />
              <VBtn
                icon="tabler-search"
                :size="40"
                variant="outlined"
                color="warning"
                @click="findEmployees"
              />
            </div>
          </VCol>
        </VRow>
      </VCardText>

      <VCardText>
        <VTable>
          <thead class="text-uppercase">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.id">
              <td>{{ employee.name || '-' }}</td>
              <td>{{ employee.email || '-' }}</td>
              <td>
                <VBtn
                  variant="text"
                  color="success"
                  icon
                  size="small"
                  @click="sendData(employee)"
                >
                  <VIcon size="24" icon="tabler-check" />
                </VBtn>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>

      <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5">
        <span class="text-sm text-disabled">{{ paginationData }}</span>
        <VPagination
          v-model="page"
          size="small"
          :total-visible="5"
          :length="last"
        />
      </VCardText>
    </VCard>
  </VDialog>
</template>


<route lang="yaml">
meta:
  action: Read
  subject: Person
  redirectIfLoggedIn: false
</route>
