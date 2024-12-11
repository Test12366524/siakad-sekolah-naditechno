<script setup lang="ts">
const baseUrl = "configuration/tentang-kami";

const formData = ref({
  content: "",
  rencana_strategis: "",
  visi: null,
  misi: null,
});

const fetchData = () => {
  useApi(baseUrl).then(({ data }) => {
    formData.value = data;
  });
};

const handleUpdate = () => {
  useApi(baseUrl, {
    withNotif: true,
    method: "PUT",
    data: formData.value,
  });
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Tentang Kami</VCardTitle>
    </VCardItem>
    <VCardText>
      <VRow>
        <VCol cols="12">
          <VTextField v-model="formData.visi" label="Visi" />
        </VCol>
        <VCol cols="12">
          <VTextarea v-model="formData.misi" label="Misi" />
        </VCol>
        <VCol cols="12">
          <VTextarea
            v-model="formData.rencana_strategis"
            label="Rencana Strategis"
          />
        </VCol>
        <VCol cols="12">
          <VTextarea v-model="formData.content" label="Konten" />
        </VCol>
      </VRow>
      <div class="d-flex mt-7 mb-3 align-items-center justify-end gap-4">
        <!-- <VBtn color="secondary" @click="reset"> Reset </VBtn> -->
        <VBtn color="primary" @click="handleUpdate"> Save </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>
