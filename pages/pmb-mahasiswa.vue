<script setup lang="ts">
import { VCol, VTextarea, VTextField } from "vuetify/lib/components/index.mjs";

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
    width="1200"
    v-if="tableRef"
    path="ppdb"
    title="Tambah PMB Mahasiswa"
    edit-title="Edit PMB Mahasiswa"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >

    <VCol cols="12" md="4">
      <VTextField
        :error-messages="validationErrors.name"
        v-model="formData.name"
        label="Nama"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        :error-messages="validationErrors.nik"
        v-model="formData.nik"
        label="NIK"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VLabel>Jenis Kelamin</VLabel>
      <VRadioGroup
        inline
        v-model="formData.gender"
        :error-messages="validationErrors.gender"
      >
        <VRadio label="Laki-laki" value="L"></VRadio>
        <VRadio label="Perempuan" value="P"></VRadio>
      </VRadioGroup>
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        :error-messages="validationErrors.phone"
        v-model="formData.phone"
        label="No. Handphone"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        :error-messages="validationErrors.pekerjaan"
        v-model="formData.pekerjaan"
        label="Pekerjaan"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VLabel>Status Nikah</VLabel>
      <VRadioGroup
        inline
        v-model="formData.mariage_status"
        :error-messages="validationErrors.mariage_status"
      >
        <VRadio label="Belum Kawin" value="1"></VRadio>
        <VRadio label="Menikah" value="2"></VRadio>
        <VRadio label="Janda / Duda" value="3"></VRadio>
      </VRadioGroup>
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        type="email"
        :error-messages="validationErrors.email"
        v-model="formData.email"
        label="Email"
      />
    </VCol>

    <VCol cols="12" md="2">
      <VTextField
        :error-messages="validationErrors.pendidikan_terakhir"
        v-model="formData.pendidikan_terakhir"
        label="Pendidikan Terakhir"
      />
    </VCol>

    <VCol cols="12" md="2">
      <VTextField
        :error-messages="validationErrors.pengalaman_kursus"
        v-model="formData.pengalaman_kursus"
        label="Pengalaman Kursus"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        :error-messages="validationErrors.pengalaman_organisasi"
        v-model="formData.pengalaman_organisasi"
        label="Pengalaman Organisasi"
      />
    </VCol>

    <VCol cols="12" md="12">
      <VTextarea
        :error-messages="validationErrors.address"
        v-model="formData.address"
        label="Alamat"
      />
    </VCol>

    <VCol cols="12" md="3">
      <FileInput
        v-model="formData.foto_1"
        accept="image/*"
        label="Upload Foto 1"
        small-chips
        chips
      />
    </VCol>

    <VCol cols="12" md="3">
      <FileInput
        v-model="formData.foto_2"
        accept="image/*"
        label="Upload Foto 2"
        small-chips
        chips
      />
    </VCol>

    <VCol cols="12" md="3">
      <FileInput
        v-model="formData.foto_3"
        accept="image/*"
        label="Upload Foto 3"
        small-chips
        chips
      />
    </VCol>

    <VCol cols="12" md="3">
      <FileInput
        v-model="formData.foto_copy_ijazah"
        accept="pdf/*"
        label="Foto Copy Ijazah"
        small-chips
        chips
      />
    </VCol>

    <VCol cols="12" md="3">
      <FileInput
        v-model="formData.surat_rekomendasi"
        accept="pdf/*"
        label="Surat Rekomendasi"
        small-chips
        chips
      />
    </VCol>

    <VCol cols="12" md="3">
      <FileInput
        v-model="formData.bukti_infaq_pendaftaran"
        accept="image/*"
        label="Upload Bukti Infaq Pendaftaran"
        small-chips
        chips
      />
    </VCol>

    <VCol cols="12" md="3">
      <FileInput
        v-model="formData.foto_copy_ktp"
        accept="image/*"
        label="Foto Copy KTP"
        small-chips
        chips
      />
    </VCol>
  </SaveFileDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol>
              <VBtn @click="dialogSave.show()" color="primary">
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
              @click="dialogSave.show({ ...item })"
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus PMB Mahasiswa',
                  message: `Anda yakin ingin menghapus PMB Mahasiswa ${
                    (item as any).name
                  }?`,
                  onConfirm: () => remove((item as any).id),
                })
              "
              size="small"
            >
              <VIcon icon="ri-delete-bin-line" />
            </IconBtn>
          </div>
        </template>
      </AppTable>
    </VCol>
  </VRow>
</template>
