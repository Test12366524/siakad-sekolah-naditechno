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
        <VCol cols="12">Pasangan</VCol>
        <VCol cols="6">
          <VTextField
            :error-messages="validationErrors['pasangan.name']"
            v-model="formData.pasangan.name"
            :readonly="viewOnly"
            label="Nama Lengkap Pasangan"
          />
        </VCol>
        <VCol cols="6">
          <LimitInput
            :maxlength="16"
            :rules="[lengthValidator(formData.pasangan.ktp, 16)]"
            :error-messages="validationErrors['pasangan.ktp']"
            v-model="formData.pasangan.ktp"
            :readonly="viewOnly"
            label="No KTP pasangan"
          />
        </VCol>
        <VCol cols="6">
          <VLabel>Jenis kelamin</VLabel>
          <VRadioGroup
            inline
            v-model="formData.pasangan.gender"
            :readonly="viewOnly"
            :error-messages="validationErrors['pasangan.gender']"
          >
            <VRadio label="Laki Laki" value="M"></VRadio>
            <VRadio label="Perempuan" value="F"></VRadio>
          </VRadioGroup>
        </VCol>
        <VCol cols="6">
          <VTextField
            type="number"
            :error-messages="validationErrors['pasangan.phone_number_1']"
            v-model="formData.pasangan.phone_number_1"
            :readonly="viewOnly"
            label="Nomor HP 1"
          />
        </VCol>
        <VCol cols="6">
          <VTextField
            type="number"
            :error-messages="validationErrors['pasangan.phone_number_2']"
            v-model="formData.pasangan.phone_number_2"
            :readonly="viewOnly"
            label="Nomor HP 2"
          />
        </VCol>

        <!-- alamat ktp -->
        <VCol cols="12">
          <AnggotaAddressPasanganForm
            type="address"
            title="Alamat KTP Pasangan"
            :formData="formData"
            :validationErrors="validationErrors"
          ></AnggotaAddressPasanganForm>
        </VCol>

        <!-- alamat domisili -->
        <VCol cols="12">
          <AnggotaAddressPasanganForm
            type="address_domicile"
            title="Alamat Domisili Pasangan"
            :formData="formData"
            :validationErrors="validationErrors"
          ></AnggotaAddressPasanganForm>
        </VCol>
      </VRow>
    </VCardItem>
  </VCard>
</template>
