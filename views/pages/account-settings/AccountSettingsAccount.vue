<script lang="ts" setup>
import { ref } from 'vue'; // Tambahkan nextTick dari Vue
import { VTextField } from "vuetify/lib/components/index.mjs";

const formRef = ref();
const { user, validateLogin } = useAuthStore();

const listCategory = ref([]);

const fetchListCategory = async () => {
  try {
    const response = await useApi("/category/all");
    const data = response.data;
    listCategory.value = [
      ...data.map((category: any) => ({
        text: category.name,
        value: category.id
      }))
    ];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};



onMounted(async () => {
  await fetchListCategory(); // Tunggu sampai daftar provinsi diambil

});


watchEffect(() => {
  if (formRef.value) {
    formRef.value.init(user);
  }
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText>
          <VContainer>
            <SaveForm
              custom-path="/auth"
              ref="formRef"
              :default-form="user"
              v-slot="{ formData, validationErrors }"
              @saved="validateLogin"
            >
              <VRow>
                <VCol cols="12">
                  <VTextField
                    :error-messages="validationErrors.name"
                    v-model="formData.name"
                    label="Nama"
                  />
                </VCol>

                <VCol cols="12">
                  <VTextField
                    :rules="[requiredValidator, emailValidator]"
                    :error-messages="validationErrors.email"
                    v-model="formData.email"
                    label="Email"
                  />
                </VCol>

                <VCol cols="12">
                  <VTextField
                    :error-messages="validationErrors.phone_number"
                    v-model="formData.phone_number"
                    type="number"
                    label="No. HP / Whatsapp"
                  />
                </VCol>

                <VCol cols="3">
                  <VLabel>Jenis Kelamin</VLabel>
                  <v-radio-group v-model="formData.gender" inline>
                    <v-radio label="Laki-laki" value="M"></v-radio>
                    <v-radio label="Perempuan" value="F"></v-radio>
                  </v-radio-group>
                </VCol>
                
                <VCol cols="12">
                  <VTextarea
                    :error-messages="validationErrors.address"
                    v-model="formData.address"
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
