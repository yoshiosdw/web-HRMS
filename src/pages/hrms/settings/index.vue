<script setup>
import EmployeStatus from './employeStatus/index.vue'
import JobLevel from './jobLevel/index.vue'
import JobPosition from './jobPosition/index.vue'
import PermitType from './permitType/index.vue'
import Organization from '../organization/index.vue'
import Attendance from './attendance/index.vue'

const configTab = ref(null)

const tabs = [
  {
    title: 'Job Position',
  },
  {
    title: 'Organization',
  },
  {
    title: 'Attendance Loc',
  },
];
</script>

<template>
  <VRow>
    <VCol
      cols="3"
      class="mt-5"
    >
      <VTabs
        v-model="configTab"
        direction="vertical"
        class="v-tabs-pill"
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.title"
        >
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>
    </VCol>
    <VCol cols="9">
      <VWindow
        v-model="configTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
        
        <VWindowItem>
          <JobPosition />
        </VWindowItem>
        <VWindowItem>
          <Organization />
        </VWindowItem>
        <VWindowItem>
          <Attendance />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>

<style scoped>
.v-tabs-vertical {
  height: 100%;
  border-right: 1px solid #e0e0e0;
}

.v-tabs-vertical .v-tab {
  align-items: start;
  justify-content: start;
}
</style>

<route lang="yaml">
    meta:
      action: Manage
      subject: Auth
      redirectIfLoggedIn: false
</route>

