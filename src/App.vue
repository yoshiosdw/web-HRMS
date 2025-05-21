<script setup>
import { useTheme } from 'vuetify'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { hexToRgb } from '@layouts/utils'
import { onMounted, onBeforeUnmount } from 'vue'
import axiosIns from '@/plugins/axios'

const {
  syncInitialLoaderTheme,
  syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
  isAppRtl,
} = useThemeConfig()

const { global } = useTheme()

syncInitialLoaderTheme()
syncConfigThemeWithVuetifyTheme()

const handleLogout = () => {
  const token = localStorage.getItem('hrmsToken')
  if (token) {
    navigator.sendBeacon('/logout')
  }
  localStorage.clear()
}

// Cek apakah navigasi berupa reload
const handleBeforeUnload = () => {
  const navType = performance.getEntriesByType('navigation')[0]?.type
  if (navType !== 'reload') {
    handleLogout()
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>


<template>
  <VLocaleProvider :rtl="isAppRtl">
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />
    </VApp>
  </VLocaleProvider>
</template>
