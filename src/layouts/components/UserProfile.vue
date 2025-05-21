<script setup>
import { initialAbility } from "@/plugins/casl/ability";
import { useAppAbility } from "@/plugins/casl/useAppAbility";

const router = useRouter();
const ability = useAppAbility();
const appUserData = JSON.parse(localStorage.getItem("appUserData") || "null");

const logout = async () => {
  try {
    // Remove data from localStorage
    localStorage.removeItem("appUserData");
    localStorage.removeItem("hrmsToken");
    localStorage.removeItem("abilities");

    // Reset user abilities to initial state
    ability.update(initialAbility);

    // Navigate to login page
    await router.push("/login");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg
        v-if="appUserData && appUserData.avatar"
        :src="appUserData.avatar"
      />
      <VIcon v-else icon="tabler-user" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar color="primary" variant="tonal">
                    <VImg
                      v-if="appUserData && appUserData.avatar"
                      :src="appUserData.avatar"
                    />
                    <VIcon v-else icon="tabler-user" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ appUserData.username }}
            </VListItemTitle>
            <VListItemSubtitle>{{ appUserData.role }}</VListItemSubtitle>
          </VListItem>
<VListItem
              value="user"
              :to="{ name: 'home' }"
            >
              <template #prepend>
                <VIcon
                  size="22"
                  class="me-3"
                  icon="tabler:key"
                />
              </template>
              <VListItemSubtitle>Change Password</VListItemSubtitle>
            </VListItem>
          <!-- 👉 Profile -->
          <!-- <VListItem :to="{ name: 'apps-user-view-id', params: { id: 21 } }">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-user"
                size="22"
              />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem> -->

          <!-- 👉 Settings -->
          <!-- <VListItem :to="{ name: 'pages-account-settings-tab', params: { tab: 'account' } }">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-settings"
                size="22"
              />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem> -->

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem link @click="logout">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
