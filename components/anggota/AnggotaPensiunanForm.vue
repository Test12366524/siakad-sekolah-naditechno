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
        <VCol cols="12">Pensiunan</VCol>
        <VCol cols="12">
          <VLabel>Kategori Pensiunan</VLabel>
          <VRadioGroup
            inline
            v-model="formData.pensiunan.category"
            :readonly="viewOnly"
            :error-messages="validationErrors['pensiunan.category']"
          >
            <VRadio label="Taspen" value="Taspen"></VRadio>
            <VRadio label="Asabri" value="Asabri"></VRadio>
          </VRadioGroup>
        </VCol>
        <VCol cols="6">
          <VTextField
            :error-messages="validationErrors['pensiunan.jenis_pensiunan']"
            v-model="formData.pensiunan.jenis_pensiunan"
            :readonly="viewOnly"
            label="Jenis Pensiunan"
          />
        </VCol>
        <VCol cols="6">
          <VTextField
            :error-messages="validationErrors['pensiunan.nopen']"
            v-model="formData.pensiunan.nopen"
            :readonly="viewOnly"
            label="Nopen"
          />
        </VCol>
        <VCol cols="6">
          <VTextField
            :error-messages="validationErrors['pensiunan.no_buku_karip']"
            v-model="formData.pensiunan.no_buku_karip"
            :readonly="viewOnly"
            label="No Buku Karip"
          />
        </VCol>
        <VCol cols="6">
          <VTextField
            :error-messages="validationErrors['pensiunan.no_skep']"
            v-model="formData.pensiunan.no_skep"
            :readonly="viewOnly"
            label="No SKEP"
          />
        </VCol>
        <VCol cols="6">
          <AppDateTimePicker
            :config="{ dateFormat: 'd-m-Y' }"
            :error-messages="validationErrors['pensiunan.skep_date']"
            v-model="formData.pensiunan.skep_date"
            :readonly="viewOnly"
            label="Tanggal SKEP"
          />
        </VCol>
        <VCol cols="6">
          <VTextField
            :error-messages="validationErrors['pensiunan.sk_owner']"
            v-model="formData.pensiunan.sk_owner"
            :readonly="viewOnly"
            label="Atas Nama SK"
          />
        </VCol>
        <VCol cols="6">
          <VTextField
            :error-messages="validationErrors['pensiunan.sk_keberadaan']"
            v-model="formData.pensiunan.sk_keberadaan"
            :readonly="viewOnly"
            label="Keberadaan SKEP"
          />
        </VCol>
        <VCol cols="6">
          <VTextField
            :error-messages="validationErrors['pensiunan.bank_pembayar']"
            v-model="formData.pensiunan.bank_pembayar"
            :readonly="viewOnly"
            label="Bank Pembayar"
          />
        </VCol>
        <VCol cols="6">
          <VTextField
            type="number"
            :error-messages="validationErrors['pensiunan.norek_pensiun']"
            v-model="formData.pensiunan.norek_pensiun"
            :readonly="viewOnly"
            label="Norek Pensiun"
          />
        </VCol>
        <VCol cols="6">
          <CurrencyInput
            :error-messages="validationErrors['pensiunan.gaji_pensiun']"
            v-model="formData.pensiunan.gaji_pensiun"
            :readonly="viewOnly"
            label="Gaji Pensiun"
          >
          </CurrencyInput>
        </VCol>
      </VRow>
    </VCardItem>
  </VCard>
</template>
