<script setup lang="ts">
import { VCol, VTextField, VTextarea } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();

const form = {
  email: "",
  name: "",
  nik: "",
  gender: "",
  mariage_status: "",
  pekerjaan: "",
  address: "",
  phone: "",
  pendidikan_terakhir: "",
  foto_1: "",
  foto_2: "",
  foto_3: "",
  foto_copy_ijazah: "",
  surat_rekomendasi: "",
  bukti_infaq_pendaftaran: "",
  foto_copy_ktp: "",
  pengalaman_kursus: "",
  pengalaman_organisasi: "",
};
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isDetail }"
    ref="dialogSave"
    width="1200"
    path="ppdb"
    title="Tambah PMB Mahasiswa"
    edit-title="Edit PMB Mahasiswa"
    detail-title="Detail PMB Mahasiswa"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.name"
        :error-messages="validationErrors.name"
        label="Nama"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.nik"
        :error-messages="validationErrors.nik"
        label="NIK"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VLabel>Jenis Kelamin</VLabel>
      <VRadioGroup
        v-model="formData.gender"
        inline
        :error-messages="validationErrors.gender"
        :readonly="isDetail"
      >
        <VRadio label="Laki-laki" value="L" />
        <VRadio label="Perempuan" value="P" />
      </VRadioGroup>
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.phone"
        :error-messages="validationErrors.phone"
        label="No. Handphone"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.pekerjaan"
        :error-messages="validationErrors.pekerjaan"
        label="Pekerjaan"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VLabel>Status Nikah</VLabel>
      <VRadioGroup
        v-model="formData.mariage_status"
        inline
        :error-messages="validationErrors.mariage_status"
        :readonly="isDetail"
      >
        <VRadio label="Belum Kawin" value="1" />
        <VRadio label="Menikah" value="2" />
        <VRadio label="Janda / Duda" value="3" />
      </VRadioGroup>
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.email"
        type="email"
        :error-messages="validationErrors.email"
        label="Email"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.pendidikan_terakhir"
        :error-messages="validationErrors.pendidikan_terakhir"
        label="Pendidikan Terakhir"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.pengalaman_kursus"
        :error-messages="validationErrors.pengalaman_kursus"
        label="Pengalaman Kursus"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.pengalaman_organisasi"
        :error-messages="validationErrors.pengalaman_organisasi"
        label="Pengalaman Organisasi"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="12">
      <VTextarea
        v-model="formData.address"
        :error-messages="validationErrors.address"
        label="Alamat"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="3" class="grid grid-cols-2">
      <FileInput
        v-model="formData.foto_1"
        accept="image/*"
        label="Upload Foto 1"
        small-chips
        chips
        show-preview
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="3">
      <FileInput
        v-model="formData.foto_2"
        accept="image/*"
        label="Upload Foto 2"
        small-chips
        chips
        show-preview
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="3">
      <FileInput
        v-model="formData.foto_3"
        accept="image/*"
        label="Upload Foto 3"
        small-chips
        chips
        show-preview
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="3">
      <FileInput
        v-model="formData.foto_copy_ijazah"
        accept="pdf/*"
        label="Foto Copy Ijazah"
        small-chips
        chips
        show-preview
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="3">
      <FileInput
        v-model="formData.surat_rekomendasi"
        accept="pdf/*"
        label="Surat Rekomendasi"
        small-chips
        chips
        show-preview
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="3">
      <FileInput
        v-model="formData.bukti_infaq_pendaftaran"
        accept="image/*"
        label="Upload Bukti Infaq Pendaftaran"
        small-chips
        chips
        show-preview
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="3">
      <FileInput
        v-model="formData.foto_copy_ktp"
        accept="image/*"
        label="Foto Copy KTP"
        small-chips
        chips
        show-preview
        :readonly="isDetail"
      />
    </VCol>
  </SaveFileDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol>
              <VBtn color="primary" @click="dialogSave.show()">
                <VIcon end icon="ri-add-fill" />
                Tambah Data
              </VBtn>
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data PMB Mahasiswa"
        path="ppdb"
        :with-actions="true"
        :headers="[
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
          {
            title: 'NIK',
            key: 'nik',
            sortable: false,
          },
          {
            title: 'Jenis Kelamin',
            key: 'gender',
            sortable: false,
          },
          {
            title: 'Status Menikah',
            key: 'mariage_desc',
            sortable: false,
          },
          {
            title: 'No. Handphone',
            key: 'phone',
            sortable: false,
          },
          {
            title: 'Pendidikan Terakhir',
            key: 'pendidikan_terakhir',
            sortable: false,
          },
          {
            title: 'Pekerjaan',
            key: 'pekerjaan',
            sortable: false,
          },
          {
            title: 'Alamat',
            key: 'address',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              size="small"
              title="Detail"
              @click="
                () => {
                  dialogSave.show({ ...item }, true);
                }
              "
            >
              <VIcon icon="ri-eye-line" />
            </IconBtn>
            <IconBtn size="small" @click="dialogSave.show({ ...item })">
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus PMB Mahasiswa',
                  message: `Anda yakin ingin menghapus PMB Mahasiswa ${
                    (item as any).name
                  }?`,
                  onConfirm: () => remove((item as any).id),
                })
              "
            >
              <VIcon icon="ri-delete-bin-line" />
            </IconBtn>
          </div>
        </template>
      </AppTable>
    </VCol>
  </VRow>
</template>
