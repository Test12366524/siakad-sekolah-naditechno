<script setup lang="ts">
const formData = ref({
  id: 1,
  mail_email_show: "keren@sinarartha.cloud",
  mail_driver: "smtp",
  mail_host: "mail.sinarartha.cloud",
  mail_port: 465,
  mail_encryption: "tls",
  mail_username: "testnodemailer@sinarartha.cloud",
  mail_password: "=,ZRgaE@E?.*",
  mail_from_address: "testnodemailer@sinarartha.cloud",
  mail_from_name: "Universitas KOmputer Indonesia",
  title: "Application",
  description: "Application Description",
  api_key_whatsapp: "w7e6RNisgoLcBUcTXyTp",
  tripay_api_key: "DEV-wVFPL1rUsY3lkrarIj7xJzLzwRwnvKqH7bpHTLaM",
  created_at: "2024-11-27T05:10:18.019Z",
  updated_at: "2024-12-06T09:20:00.000Z",
  tripay_private_key: "v366H-Y8RDX-sU4YH-sLZrd-lP7Yd",
  tripay_merchant_code: "T1063",
  tripay_url: "https://tripay.co.id/api-sandbox",
  ppdb_cost: 100000,
  ppdb_sku: "PMB-2024",
  ppdb_name: "PMB 2024 Universitas London Bandung",
});

const url = "configuration/application";

const getConfig = () => {
  useApi(url).then(({ data }) => {
    formData.value = data;
  });
};

onMounted(() => {
  getConfig();
});

const save = () => {
  useApi(url, {
    withNotif: true,
    method: "PUT",
    data: formData.value,
  });
};

const reset = () => {};
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Konfigurasi Aplikasi</VCardTitle>
    </VCardItem>
    <VCardText>
      <VRow>
        <VCol cols="12" md="6">
          <VTextField
            v-model="formData.title"
            label="Nama Aplikasi"
            placeholder="Silahkan input nama aplikasi"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="formData.description"
            label="Keterangan"
            placeholder="Silahkan input keterangan"
          />
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="formData.ppdb_name"
            label="Nama PPDB"
            placeholder="Silahkan input nama PPDB"
          />
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="formData.ppdb_sku"
            label="SKU PPDB"
            placeholder="Silahkan input SKU PPDB"
          />
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="formData.ppdb_cost"
            label="Cost PPDB"
            placeholder="Silahkan input Cost PPDB"
          />
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="formData.mail_email_show"
            label="Email Show"
            placeholder="Silahkan input Mail Email Show"
          />
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="formData.mail_from_name"
            label="Email From Name"
            placeholder="Silahkan input Mail Email From Name"
          />
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="formData.mail_from_address"
            label="Email From Address"
            placeholder="Silahkan input Mail Email From Address"
          />
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="formData.mail_username"
            label="Email Username"
            placeholder="Silahkan input Mail Email Username"
          />
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="formData.mail_password"
            label="Email Password"
            placeholder="Silahkan input Mail Email Password"
          />
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="formData.mail_driver"
            label="Email Driver"
            placeholder="Silahkan input Email Driver"
          />
        </VCol>
        <VCol cols="12" md="3">
          <VTextField
            v-model="formData.mail_host"
            label="Email Host"
            placeholder="Silahkan input Email Host"
          />
        </VCol>
        <VCol cols="12" md="3">
          <VTextField
            v-model="formData.mail_encryption"
            label="Email Enkripsi"
            placeholder="Silahkan input Email Enkripsi"
          />
        </VCol>
        <VCol cols="12" md="3">
          <VTextField
            v-model="formData.mail_port"
            label="Email Port"
            placeholder="Silahkan input Email Port"
          />
        </VCol>
        <VCol cols="12" md="3">
          <VTextField
            v-model="formData.mail_port"
            label="Email Port"
            placeholder="Silahkan input Email Port"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="formData.api_key_whatsapp"
            label="Whatsapp API KEY"
            placeholder="Silahkan input Whatsapp API KEY"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="formData.tripay_api_key"
            label="Tripay API KEY"
            placeholder="Silahkan input Tripay API KEY"
          />
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="formData.tripay_private_key"
            label="Tripay Private KEY"
            placeholder="Silahkan input Tripay Private KEY"
          />
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="formData.tripay_merchant_code"
            label="Tripay Merchant Code"
            placeholder="Silahkan input Tripay Merchant Code"
          />
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="formData.tripay_url"
            label="Tripay URL"
            placeholder="Silahkan input Tripay URL"
          />
        </VCol>
      </VRow>
      <div class="d-flex mt-7 mb-3 align-items-center justify-end gap-4">
        <!-- <VBtn color="secondary" @click="reset"> Reset </VBtn> -->
        <VBtn color="primary" @click="save"> Save </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>
