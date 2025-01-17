<script setup lang="ts">
import { VForm } from "vuetify/components/VForm";

import authV2LoginIllustrationBorderedDark from "@images/pages/auth-v2-login-illustration-bordered-dark.png";
import authV2LoginIllustrationBorderedLight from "@images/pages/auth-v2-login-illustration-bordered-light.png";
import authV2LoginIllustrationDark from "@images/pages/auth-v2-login-illustration-dark.png";
import authV2LoginIllustrationLight from "@images/pages/auth-v2-login-illustration-light.png";
import authV2LoginMaskDark from "@images/pages/auth-v2-login-mask-dark.png";
import authV2LoginMaskLight from "@images/pages/auth-v2-login-mask-light.png";

const { pageLoader } = useCommonStore();
const { login } = useAuthStore();

import img from "@images/background-login-smk.jpg";
import imgLogo from "@images/logo-smk-tunaskasih.png";

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);

const authThemeMask = useGenerateImageVariant(
  authV2LoginMaskLight,
  authV2LoginMaskDark
);

definePageMeta({
  layout: "blank",
  unauthenticatedOnly: true,
});

const isPasswordVisible = ref(false);

const route = useRoute();

const ability = useAbility();

const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
});

const loginError = ref("");

const refVForm = ref<VForm>();

const credentials = ref({
  email: "",
  password: "",
});

const rememberMe = ref(false);

const onSubmit = () => {
  refVForm.value?.validate().then(async ({ valid: isValid }) => {
    console.log(isValid);
    if (isValid) {
      try {
        await login(credentials.value);
        pageLoader.show();
        await navigateTo("/");
        pageLoader.hide();
      } catch (error) {
        loginError.value = error as string;
      }
    }
  });
};
</script>

<template>
  <VRow no-gutters class="auth-wrapper">
    <VCol
      md="7"
      class="d-none d-md-flex align-center justify-center position-relative"
      :style="{
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }"
    >
    </VCol>

    <VCol
      cols="12"
      md="5"
      class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface))"
    >
      <VCard flat :width="500" class="mt-12 mt-sm-0 pa-5 pa-lg-7">
        <VCardText class="text-center">
          <img :src="imgLogo" style="width: 30%" />
        </VCardText>
        <VCardText style="margin-top: -30px;">
          <h4 class="text-h4 mb-1 text-center">SMK TUNAS KASIH</h4>
          <p class="mb-0 text-center">Silahkan login menggunakan akun anda</p>
        </VCardText>

        <VCardText v-if="loginError">
          <v-alert type="error" :text="loginError" />
        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="credentials.email"
                  label="Email"
                  placeholder="johndoe@email.com"
                  type="email"
                  autofocus
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="errors.email"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="credentials.password"
                  label="Password"
                  placeholder="············"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="
                    isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'
                  "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div
                  class="d-flex align-center flex-wrap justify-space-between my-6 gap-x-2"
                >
                  <!-- <NuxtLink
                    class="text-primary"
                    :to="{ name: 'forgot-password' }"
                  >
                    Lupa password?
                  </NuxtLink> -->
                </div>

                <VBtn block type="submit"> Login </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
