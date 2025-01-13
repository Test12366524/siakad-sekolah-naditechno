<script lang="ts" setup>
import { ref } from "vue"; // Tambahkan nextTick dari Vue
import { VTextField } from "vuetify/lib/components/index.mjs";

const formRef = ref();
const { user, validateLogin } = useAuthStore();

const isStudent = computed(() => user.role_id === 3);
const isTeacher = computed(() => user.role_id === 2);

const listCategory = ref([]);

const fetchListCategory = async () => {
  try {
    const response = await useApi("/category/all");
    const data = response.data;

    listCategory.value = [
      ...data.map((category: any) => ({
        text: category.name,
        value: category.id,
      })),
    ];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(async () => {
  await fetchListCategory(); // Tunggu sampai daftar provinsi diambil
});

watchEffect(() => {
  if (formRef.value) formRef.value.init(user);
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText>
          <VContainer>
            <SaveForm
              ref="formRef"
              v-slot="{ formData, validationErrors }"
              custom-path="/auth"
              :default-form="user"
              @saved="validateLogin"
            >
              <VRow>
                <VCol cols="12">
                  <VTextField
                    v-model="formData.name"
                    :error-messages="validationErrors.name"
                    label="Nama"
                  />
                </VCol>

                <VCol cols="12">
                  <VTextField
                    v-model="formData.email"
                    :rules="[requiredValidator, emailValidator]"
                    :error-messages="validationErrors.email"
                    label="Email"
                  />
                </VCol>

                <VCol cols="12">
                  <VTextField
                    v-model="formData.phone_number"
                    :error-messages="validationErrors.phone_number"
                    type="number"
                    label="No. HP / Whatsapp"
                  />
                </VCol>

                <VCol cols="3">
                  <VLabel>Jenis Kelamin</VLabel>
                  <VRadioGroup v-model="formData.gender" inline>
                    <VRadio label="Laki-laki" value="M" />
                    <VRadio label="Perempuan" value="F" />
                  </VRadioGroup>
                </VCol>

                <VCol cols="12">
                  <VTextarea
                    v-model="formData.address"
                    :error-messages="validationErrors.address"
                    label="Alamat"
                  />
                </VCol>
              </VRow>
            </SaveForm>
          </VContainer>
          <!-- 👉 Form -->
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
