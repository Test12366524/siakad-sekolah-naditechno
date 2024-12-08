<script setup lang="ts">
import { useRouter } from "vue-router";
import { VForm } from "vuetify/components/VForm";

import authV2RegisterIllustrationBorderedDark from "@images/pages/auth-v2-register-illustration-bordered-dark.png";
import authV2RegisterIllustrationBorderedLight from "@images/pages/auth-v2-register-illustration-bordered-light.png";
import authV2RegisterIllustrationDark from "@images/pages/auth-v2-register-illustration-dark.png";
import authV2RegisterIllustrationLight from "@images/pages/auth-v2-register-illustration-light.png";
import authV2RegisterMaskDark from "@images/pages/auth-v2-register-mask-dark.png";
import authV2RegisterMaskLight from "@images/pages/auth-v2-register-mask-light.png";
import { VCheckbox } from "vuetify/lib/components/index.mjs";

const { pageLoader, snackbar } = useCommonStore();
const router = useRouter();
const { login } = useAuthStore();

const authThemeMask = useGenerateImageVariant(
  authV2RegisterMaskLight,
  authV2RegisterMaskDark
);
const authThemeImg = useGenerateImageVariant(
  authV2RegisterIllustrationLight,
  authV2RegisterIllustrationDark,
  authV2RegisterIllustrationBorderedLight,
  authV2RegisterIllustrationBorderedDark,
  true
);

definePageMeta({
  layout: "blank",
  unauthenticatedOnly: true,
});

const validationErrors = ref<Record<string, string | undefined>>({});

const registerError = ref("");

const refVForm = ref<VForm>();

const formData = ref({
  categoryId: "",
  name: "",
  email: "",
  password: "",
  phone_number: "",
  address: "",
  gender: "",
  privacyPolicies: false,
});

const isPasswordVisible = ref(false);

const onSubmit = () => {
  refVForm.value?.validate().then(async ({ valid: isValid }) => {
    if (isValid) {
      try {
        form.value.phone_number = "62" + form.value.phone_number;
        const { success, errors } = await useApi("/auth/register", {
          method: "POST",
          data: form.value,
        });

        validationErrors.value = errors ?? {};

        if (success) {
          pageLoader.show();
          const credentials = ref({
            email: form.value.email,
            password: form.value.password,
          });
          await login(credentials.value);
          pageLoader.show();

          // send wa
          await fetch(`https://api-clinic.tukangbikin.web.id/submission`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone_number: form.value.phone_number,
              message: `Halo Kak ${form.value.name}, terimakasih telah daftar di Event Pospay Run 2024`,
            }),
          });

          await fetch(`https://api-clinic.tukangbikin.web.id/sendemail`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: form.value.email,
              subject: "Pendaftaran Event Pospay Running 2024",
              message: `Halo Kak ${form.value.name}, terimakasih telah daftar di Event Pospay Run 2024`,
            }),
          });

          await navigateTo("/");
          pageLoader.hide();
          // await navigateTo("/login");

          pageLoader.hide();
        }
      } catch (error) {
        snackbar.show({
          message: error,
          color: "error",
        });
      }
    }
  });
};

const phoneNumberValidator = (value: string) => {
  const regex = /^[0-9]{10,13}$/; // Contoh regex untuk nomor telepon
  return regex.test(value) || "Nomor whatsapp harus 10 - 13 digit";
};

const maxLengthValidator = (val: string) => {
  return val.length <= 11 || "Phone number must be at most 13 characters";
};

const onPhoneNumberInput = (event: Event) => {
  // Get the input value from the event object
  const input = (event.target as HTMLInputElement).value;

  // Remove all non-numeric characters from the input
  let numericVal = input.replace(/\D/g, "");

  // Set the updated value to the form
  form.value.phone_number = numericVal;
};

const listCategory = ref([]); // List of services

const fetchListCategory = async () => {
  try {
    // const response = await fetch(`http://localhost:3001/category/all`);
    const response = await useApi("/category/all");
    const data = response.data;
    console.log(data);
    listCategory.value = [
      ...data.map((category: any) => ({
        text: category.name,
        value: category.id,
      })),
    ];
    console.log(listCategory);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchListCategory();
});
</script>

<template>
  <VRow no-gutters class="auth-wrapper" style="margin-top: -30px;">
    <VCol
      cols="12"
      md="12"
      class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface))"
    >
      <VCard flat :max-width="900" class="mt-12 mt-sm-0 pa-5 pa-lg-7">
        <VCardText>
          <h4 class="text-h4 mb-1 text-center">Pendaftaran Senam Partai Golkar dan Jalan Sehat</h4>
          <p class="mb-0 text-center">Isi formulir dengan benar</p>
        </VCardText>
        <VCardText v-if="registerError">
          <v-alert type="error" :text="registerError" />
        </VCardText>
        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <VCol v-if="viewOnly" cols="12">
                <VTextField
                  v-model="formData.code"
                  :error-messages="validationErrors.name"
                  :readonly="viewOnly"
                  label="ID Pelanggan"
                />
              </VCol>

              <!-- data diri -->
              <VCol cols="12">
                <VCard elevation="0" border>
                  <VCardItem>
                    <VRow>
                      <VCol cols="12"> Data Diri </VCol>
                      <VCol cols="6">
                        <VTextField
                          v-model="formData.name"
                          :error-messages="validationErrors.name"
                          :readonly="viewOnly"
                          label="Nama Lengkap"
                        />
                      </VCol>
                      <VCol cols="6">
                        <VTextField
                          v-model="formData.name"
                          :error-messages="validationErrors.name"
                          :readonly="viewOnly"
                          label="NIK KTP"
                        />
                      </VCol>
                      <VCol cols="6">
                        <VTextField
                          v-model="formData.phone_number_1"
                          type="number"
                          :error-messages="validationErrors.phone_number_1"
                          :readonly="viewOnly"
                          label="No. Whatsapp"
                        />
                      </VCol>
                      <VCol cols="6">
                        <VTextField
                          v-model="formData.email"
                          type="email"
                          :error-messages="validationErrors.email"
                          :readonly="viewOnly"
                          label="Email"
                        />
                      </VCol>
                    </VRow>
                  </VCardItem>
                </VCard>
              </VCol>

              <!-- koperasi -->
              <VCol cols="12" style="margin-top: -10px;">
                <VCard elevation="0" border>
                  <VCardItem>
                    <VRow>
                      <VCol cols="12"> Data Alamat</VCol>
                      <VCol cols="6">
                        <VAutocomplete
                          v-model="formData.province_id"
                          label="Provinsi"
                          density="compact"
                          placeholder="Pilih Provinsi"
                          item-title="text"
                          item-value="id"
                          required
                          clearable
                          clear-icon="ri-close-line"
                        />
                      </VCol>

                      <!-- City -->
                      <VCol cols="6">
                        <VAutocomplete
                          v-model="formData.city_id"
                          label="Kabupaten/Kota"
                          density="compact"
                          placeholder="Pilih Kota/Kabupaten"
                          item-title="text"
                          item-value="id"
                          required
                          clearable
                          clear-icon="ri-close-line"
                        />
                      </VCol>

                      <!-- District -->
                      <VCol cols="6">
                        <VAutocomplete
                          v-model="formData.district_id"
                          label="Kecamatan"
                          density="compact"
                          placeholder="Pilih Kecamatan"
                          item-title="text"
                          item-value="id"
                          required
                          clearable
                          clear-icon="ri-close-line"
                        />
                      </VCol>

                      <!-- Subdistrict -->
                      <VCol cols="6">
                        <VAutocomplete
                          v-model="formData.subdistrict_id"
                          label="Kelurahan"
                          density="compact"
                          placeholder="Pilih Kelurahan"
                          item-title="text"
                          item-value="id"
                          required
                          clearable
                          clear-icon="ri-close-line"
                        />
                      </VCol>
                      <VCol cols="12">
                        <VTextField
                          v-model="formData.alamat"
                          :error-messages="validationErrors.alamat"
                          :readonly="viewOnly"
                          label="Alamat Lengkap"
                        />
                      </VCol>
                     
                    </VRow>
                  </VCardItem>
                </VCard>
              </VCol>

              <VCol cols="12" style="margin-top: -10px;">
                <VCard elevation="0" border>
                  <VCardItem>
                    <VRow>
                      <VCol cols="12"> Lembaga Unsur</VCol>
                      <VCol cols="12">
                        <VCheckbox
                          v-model="formData.lembaga_unsur"
                          value="1"
                          type="checkbox"
                          label="DPD Partai Golkar"
                        />
                        <VCheckbox
                          v-model="formData.lembaga_unsur"
                          value="2"
                          type="checkbox"
                          label="MKGR"
                        />
                        <VCheckbox
                          v-model="formData.lembaga_unsur"
                          value="3"
                          type="checkbox"
                          label="SOKSI"
                        />
                      </VCol>
                     
                    </VRow>
                  </VCardItem>
                </VCard>
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
