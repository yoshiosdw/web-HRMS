<script setup>

import axiosIns from '@/plugins/axios';
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { onMounted } from 'vue';

const { appContentLayoutNav } = useThemeConfig()

defineOptions({ inheritAttrs: false })
const candidate = ref(null)

</script>

<template>

  <div>
    <VText v-if="candidate">
      <b>
        {{ candidate.candidate.name }}
      </b>
    </VText>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/variables/_vuetify.scss";

.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: vuetify.$card-border-radius;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
