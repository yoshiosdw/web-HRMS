<template>
  <VRow>
    <VCol
      cols="12"
      md="6"
    >
      <VCard title="Common">
        <VCardText>No ability is required to view this card</VCardText>
        <VCardText>
          This card is visible to both 'user' and 'admin'
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      v-if="$can('read', 'Admin')"
      cols="12"
      md="6"
    >
      <VCard title="Analytics">
        <VCardText>User with 'Analytics' subject's 'Read' ability can view this card</VCardText>
        <VCardText class="text-danger">
          This card is visible to 'admin' only
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<route lang="yaml">
meta:
  action: Read
  subject: AclDemo
</route>
