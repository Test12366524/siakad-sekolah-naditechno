<script lang="ts" setup>
import { ref } from "vue"; // Tambahkan nextTick dari Vue

const formRef = ref();
const categories = ref();
const marketings = ref([]);
const cabangs = ref([]);

const form = {
  name: "",
  gender: "M",
  birth_date: "",
  phone_number_1: "",
  email: "",
  instagram: "",
  facebook: "",
  cabang_id: "",
  status: "0",
  tensi: "",
  alergi: "",
  keluhan: "",
  lidah: "",
  nadi: "",
};


onMounted(() => {
  useApi("cabang/all").then(({ data }) => {
    cabangs.value = data;
  });
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem class="pb-3">
          <VCardTitle> Form Pelanggan </VCardTitle>
        </VCardItem>

        <VDivider />

        <VCardText>
          <VContainer>
            <SaveForm
              ref="formRef"
              v-slot="{ formData, validationErrors }"
              path="anggota"
              :default-form="form"
              @saved="() => navigateTo('/pelanggan/data')"
            >
              <AnggotaForm
                :form-data="formData"
                :validation-errors="validationErrors"
                @update-cabang="(value) => (formData.cabang_id = value)"
              />
            </SaveForm>
          </VContainer>
          <!-- 👉 Form -->
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
