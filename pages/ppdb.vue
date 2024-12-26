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
  foto: "",
  foto_copy_ktp: "",
  foto_copy_ijazah: "",
  surat_rekomendasi: "",
  pengalaman_kursus: "",
  pengalaman_organisasi: "",
};

const handleAction = async (status, type, data) => {
  const url = `ppdb/change-status/${type}/${status}/${data.id}`;

  const { errors, success } = await useApi(url, {
    withNotif: true,
    method: "PUT",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (success) tableRef.value.refresh();
};

onMounted(() => {
  useApi("auth/me").then(({ data }) => {
    useApi(`pmb-mahasiswa/${data.role_id}`).then(({ data }) => {
      if(data == 0){
        navigateTo(`/not-authorized`);
      }
    });
  });
});
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isDetail }"
    ref="dialogSave"
    width="1200"
    path="ppdb"
    title="Tambah PPDB"
    edit-title="Edit PPDB"
    detail-title="Detail PPDB"
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
        label="Upload Foto"
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
        title="Data PPDB"
        path="ppdb"
        :with-actions="true"
        :headers="[
          {
            title: 'Kode',
            key: 'registration_code',
            sortable: false,
          },
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
            title: 'No. Handphone',
            key: 'phone',
            sortable: false,
          },
          // {
          //   title: 'Pendidikan Terakhir',
          //   key: 'pendidikan_terakhir',
          //   sortable: false,
          // },
          {
            title: 'Status',
            key: 'status_all',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <VBtn
              v-if="item.tripay_status_transaction == 0"
              size="x-small"
              style="border-radius: 0.375rem !important"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Approve Payment',
                    message: `Anda yakin ingin mengubah status jadi approve?`,
                    onConfirm: () => handleAction('payment', 'approved', item),
                  });
                }
              "
            >
              <VIcon start icon="ri-checkbox-circle-line" />
              Payment Diterima
            </VBtn>
            <VBtn
              v-if="item.tripay_status_transaction == 0"
              size="x-small"
              style="border-radius: 0.375rem !important"
              color="secondary"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Reject Payment',
                    message: `Anda yakin ingin mengubah status jadi reject?`,
                    onConfirm: () => handleAction('payment', 'rejected', item),
                  });
                }
              "
            >
              <VIcon start icon="ri-subtract-line" />
              Payment Ditolak
            </VBtn>
            <VBtn
              v-if="item.status == 0 && item.tripay_status_transaction == 1"
              size="x-small"
              style="border-radius: 0.375rem !important"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Approve Verification',
                    message: `Anda yakin ingin mengubah status jadi approve?`,
                    onConfirm: () => handleAction('data', 'approved', item),
                  });
                }
              "
            >
              <VIcon start icon="ri-checkbox-circle-line" />
              Verifikasi Data Diterima
            </VBtn>
            <VBtn
              v-if="item.status == 0 && item.tripay_status_transaction == 1"
              size="x-small"
              style="border-radius: 0.375rem !important"
              color="secondary"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Reject Verification',
                    message: `Anda yakin ingin mengubah status jadi reject?`,
                    onConfirm: () => handleAction('data', 'rejected', item),
                  });
                }
              "
            >
              <VIcon start icon="ri-subtract-line" />
              Verifikasi Data Ditolak
            </VBtn>
            <VBtn
              v-if="item.status_test == 0 && item.status == 1"
              size="x-small"
              style="border-radius: 0.375rem !important"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Status Lulus',
                    message: `Anda yakin ingin mengubah status jadi lulus?`,
                    onConfirm: () => handleAction('test', 'approved', item),
                  });
                }
              "
            >
              >
              <VIcon start icon="ri-checkbox-circle-line" />
              Lulus
            </VBtn>
            <VBtn
              v-if="item.status_test == 0 && item.status == 1"
              size="x-small"
              style="border-radius: 0.375rem !important"
              color="secondary"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Status Tidak Lulus',
                    message: `Anda yakin ingin mengubah status jadi tidak lulus?`,
                    onConfirm: () => handleAction('test', 'rejected', item),
                  });
                }
              "
            >
              >
              <VIcon start icon="ri-subtract-line" />
              Tidak Lulus
            </VBtn>
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
                  title: 'Hapus PPDB',
                  message: `Anda yakin ingin menghapus PPDB ${
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
