<script setup lang="ts">
const props = defineProps({
  validationErrors: {
    type: Object,
    required: true,
  },
  formData: {
    type: Object,
    required: true,
  },
  viewOnly: {
    type: Boolean,
  },
});
</script>

<template>
  <VCard elevation="0" border>
    <VCardItem>
      <VRow>
        <VCol cols="12">RT/Tetangga</VCol>
        <VCol cols="6">
          <VTextField
            :error-messages="validationErrors['tetangga.name']"
            v-model="formData.tetangga.name"
            :readonly="viewOnly"
            label="Nama RT/Tetangga"
          />
        </VCol>
        <VCol cols="6">
          <VTextField
            type="number"
            :error-messages="validationErrors['tetangga.phone_number_1']"
            v-model="formData.tetangga.phone_number_1"
            :readonly="viewOnly"
            label="Nomor HP 1"
          />
        </VCol>
        <VCol cols="6">
          <VTextField
            type="number"
            :error-messages="validationErrors['tetangga.phone_number_2']"
            v-model="formData.tetangga.phone_number_2"
            :readonly="viewOnly"
            label="Nomor HP 2"
          />
        </VCol>
      </VRow>
    </VCardItem>
  </VCard>
</template>
