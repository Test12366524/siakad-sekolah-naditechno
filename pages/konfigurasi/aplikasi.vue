<script setup lang="ts">
const formData = ref({
  name: "",
  alamat: "",
  keterangan: "",
  tanggalSimpanan: null,
  durasiTelat: 0,
  jenisSimpanan: null,
  phoneNumber: null,
  apiKey: null,
  favicon: null,
  logo: null,
});

const previewImageFavicon = ref();
const previewImageLogo = ref(formData.value.logo);

const jenisSimpananOptions = ref([
  { id: 1, name: "Simpanan Wajib" },
  { id: 2, name: "Simpanan Pokok" },
  { id: 3, name: "Simpanan Sukarela" },
  { id: 4, name: "Simpanan Sembako" },
]);

const save = () => {};
const reset = () => {};
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Konfigurasi Aplikasi</VCardTitle>
    </VCardItem>
    <VCardText>
      <VRow>
        <VCol cols="6">
          <VTextField
            v-model="formData.name"
            label="Nama Aplikasi"
            placeholder="Silahkan input nama aplikasi"
          />
        </VCol>
        <VCol cols="6">
          <VTextField
            v-model="formData.alamat"
            label="Keterangan"
            placeholder="Silahkan input keterangan"
          />
        </VCol>
        <VCol cols="2.4">
          <VTextField
            v-model="formData.phoneNumber"
            label="No Whatsapp"
            placeholder="Silahkan input no whatsapp"
            type="number"
          />
        </VCol>
        <VCol cols="2.4">
          <VTextField
            v-model="formData.apiKey"
            label="API Key Whatsapp"
            placeholder="Silahkan input api key"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="4">
          <VTextarea
            v-model="formData.apiKey"
            label="Pesan Tagihan"
            placeholder="Silahkan isi pesan tagihan"
          />
        </VCol>
        <VCol cols="4">
          <VTextarea
            v-model="formData.apiKey"
            label="Pesan Pembayaran"
            placeholder="Silahkan isi pesan pembayaran"
          />
        </VCol>
        <VCol cols="4">
          <VTextarea
            v-model="formData.apiKey"
            label="Keterangan"
            placeholder="Silahkan isi keterangan"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="6">
          <div class="d-flex flex-column ga-2 justify-content-center">
            <VImg
              v-if="previewImageLogo"
              class="mx-auto mb-3"
              width="300px"
              height="auto"
              cover
              :src="previewImageLogo"
            ></VImg>
            <FileInput
              @change="({previewImageUrl}: any) => {
                    previewImageLogo = previewImageUrl
                    if(!previewImageUrl) formData.logo
              }"
              v-model="formData.logo"
              accept="image/*"
              label="Upload Logo"
              small-chips
              chips
            />
          </div>
        </VCol>
        <VCol cols="6">
          <div class="d-flex flex-column ga-2 justify-content-center">
            <VImg
              v-if="previewImageFavicon"
              class="mx-auto mb-3"
              width="300px"
              height="auto"
              cover
              :src="previewImageFavicon"
            ></VImg>
            <FileInput
              @change="({previewImageUrl}: any) => {
                    previewImageFavicon = previewImageUrl
                    if(!previewImageUrl) formData.favicon
              }"
              v-model="formData.favicon"
              accept="image/*"
              label="Upload Favicon"
              small-chips
              chips
            />
          </div>
        </VCol>
      </VRow>
      <div class="d-flex mt-7 mb-3 align-items-center justify-end gap-4">
        <VBtn color="secondary" @click="reset"> Reset </VBtn>
        <VBtn color="primary" @click="save"> Save </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>
