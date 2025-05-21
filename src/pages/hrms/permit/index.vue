<script setup>
import ListPermit from './permit.vue'
import Summary from './summary/index.vue'

const configTab = ref(null)

const tabs = [
  {
    title: 'List',
    icon: 'tabler-list-details',
  },
  {
    title: 'Summary',
    icon: 'tabler-layout-kanban',

  },
]
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VTabs
        v-model="configTab"
        direction="horizontal"
        class="v-tabs-pill"
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.title"
          :prepend-icon="tab.icon"
        >
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>
      <VDivider class="mt-2" />
      <VWindow
        v-model="configTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <ListPermit />
        </VWindowItem>

        <VWindowItem>
          <Summary />
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
    action: Read
    subject: Permit
    redirectIfLoggedIn: false
  </route>
