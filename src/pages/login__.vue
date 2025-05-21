<script setup>
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import authV2LoginIllustrationBorderedDark from "@images/pages/auth-v2-login-illustration-bordered-dark.png";
import authV2LoginIllustrationBorderedLight from "@images/pages/auth-v2-login-illustration-bordered-light.png";
import authV2LoginIllustrationDark from "@images/pages/auth-v2-login-illustration-dark.png";
import authV2LoginIllustrationLight from "@images/pages/auth-v2-login-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import { VForm } from "vuetify/components";
import logo from "@images/logo.png";

import axiosIns from "@/plugins/axios";
import { useAppAbility } from "@/plugins/casl/useAppAbility";
import authV1BottomShape from "@images/svg/auth-v1-bottom-shape.svg";
import authV1TopShape from "@images/svg/auth-v1-top-shape.svg";
import { themeConfig } from "@themeConfig";
import Swal from "sweetalert2";
import { useRoute, useRouter } from "vue-router";
import { requiredValidator } from "@/@core/utils/validators";
import { showOnHover } from "@/views/demos/components/badge/demoCodeBadge";

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);
const isPasswordVisible = ref(false);
const route = useRoute();
const router = useRouter();
const ability = useAppAbility();

const errors = ref({
  username: undefined,
  password: undefined,
});

const refVForm = ref("");
const showLoading = ref(false);
const username = ref("admin");
const password = ref("password");
const rememberMe = ref(false);
const email = ref("admin@demo.com");
const defaultRegion = ref();

const login = async () => {
  showLoading.value = true;
  try {
    const ret = await axiosIns.post("/login", {
      username: username.value,
      password: password.value,
    });
    showLoading.value = false;
    const abilities = ret.data.data.ability;
    const userData = ret.data.data;
    const hrmsToken = ret.data.meta.token;

    localStorage.setItem("abilities", JSON.stringify(abilities));
    ability.update(abilities);
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("hrmsToken", hrmsToken);
    router.replace(route.query.to ? String(route.query.to) : "/");
  } catch (error) {
    console.log(error);
  } finally {
    showLoading.value = false;
  }
};

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) login();
  });
};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div class="auth-wrapper d-flex align-center justify-center pa-4">
        <div class="position-relative my-sm-16">
          <VImg
            :src="authV1TopShape"
            class="auth-v1-top-shape d-none d-sm-block"
          />
          <VImg
            :src="authV1BottomShape"
            class="auth-v1-bottom-shape d-none d-sm-block"
          />

          <VCard class="auth-card pa-4" max-width="448" :loading="showLoading">
            <VCardItem class="justify-center">
              <VImg :src="logo" />
              <VCardTitle class="font-weight-bold text-h5 py-2 text-center">
                {{ themeConfig.app.title }}
              </VCardTitle>
            </VCardItem>
            <VCardText class="pt-1">
              <h6 class="text-h6 font-weight-semibold mb-1">
                Where Your Assets Find Their Home
              </h6>
            </VCardText>
            <VCardText>
              <VForm ref="refVForm" @submit.prevent="onSubmit">
                <VRow>
                  <VCol cols="12">
                    <VTextField v-model="username" label="Email" type="email" />
                  </VCol>

                  <VCol cols="12">
                    <VTextField
                      v-model="password"
                      label="Password"
                      :rules="[requiredValidator]"
                      :type="isPasswordVisible ? 'text' : 'password'"
                      :error-messages="errors.password"
                      :append-inner-icon="
                        isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                      "
                      @click:append-inner="
                        isPasswordVisible = !isPasswordVisible
                      "
                    />

                    <div
                      class="d-flex align-center flex-wrap justify-space-between mt-4 mb-2"
                    >
                      <VBtn block type="submit" :loading="showLoading">
                        Login
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VForm>
            </VCardText>
          </VCard>
        </div>
      </div>
    </VCol>
  </VRow>
</template>

<!-- <template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          :src="authThemeMask"
          class="auth-footer-mask"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <VNodeRenderer
            :nodes="themeConfig.app.logo"
            class="mb-6"
          />

          <h5 class="text-h5 font-weight-semibold mb-1">
            Welcome to {{ themeConfig.app.title }}! 👋🏻
          </h5>
          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>
        <VCardText>
          <VAlert
            color="primary"
            variant="tonal"
          >
            <p class="text-caption mb-2">
              Admin Email: <strong>admin@demo.com</strong> / Pass: <strong>admin</strong>
            </p>
            <p class="text-caption mb-0">
              Client Email: <strong>client@demo.com</strong> / Pass: <strong>client</strong>
            </p>
          </VAlert>
        </VCardText>
        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  label="Email"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="errors.email"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="password"
                  label="Password"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Remember me"
                  />
                  <RouterLink
                    class="text-primary ms-2 mb-1"
                    :to="{ name: 'forgot-password' }"
                  >
                    Forgot Password?
                  </RouterLink>
                </div>

                <VBtn
                  block
                  type="submit"
                >
                  Login
                </VBtn>
              </VCol>

              <VCol
                cols="12"
                class="text-center"
              >
                <span>New on our platform?</span>
                <RouterLink
                  class="text-primary ms-2"
                  :to="{ name: 'register' }"
                >
                  Create an account
                </RouterLink>
              </VCol>
              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol>

              <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template> -->

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: Read
  subject: Auth
  redirectIfLoggedIn: true
</route>
