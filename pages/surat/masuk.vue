<script setup lang="ts">
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const form = ref({
  penomoran: "",
  perihal: "",
  lampiran: "",
  tempat: "",
  tanggal: "",
  kepada: "",
  deskripsi: "",
  atas_nama: "",
  status: 1,
});

</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="surat-masuk"
    title="Tambah Surat Masuk"
    edit-title="Edit Surat Masuk"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    width="1200"
  >
    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.penomoran"
        v-model="formData.penomoran"
        label="Penomoran"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.perihal"
        v-model="formData.perihal"
        label="Perihal"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.lampiran"
        v-model="formData.lampiran"
        label="Lampiran"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.tempat"
        v-model="formData.tempat"
        label="Tempat"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        type="date"
        :error-messages="validationErrors.tanggal"
        v-model="formData.tanggal"
        label="Tanggal"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.kepada"
        v-model="formData.kepada"
        label="Kepada"
      />
    </VCol>

    <VCol cols="12">
      <VTextarea
        :error-messages="validationErrors.deskripsi"
        v-model="formData.deskripsi"
        label="Deskripsi"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.atas_nama"
        v-model="formData.atas_nama"
        label="Atas Nama"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VLabel>Status</VLabel>
      <VRadioGroup
        inline
        v-model="formData.status"
        :error-messages="validationErrors.status"
      >
        <VRadio label="Aktif" :value="1"></VRadio>
        <VRadio label="Nonaktif" :value="0"></VRadio>
      </VRadioGroup>
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VBtn
            @click="
              () => {
                dialogSave.show();
              }
            "
            color="primary"
          >
            <VIcon end icon="ri-add-fill" />
            Tambah Data
          </VBtn>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Surat Masuk"
        path="surat-masuk"
        :with-actions="true"
        :headers="[
          {
            title: 'Penomoran',
            key: 'penomoran',
            sortable: false,
          },
          {
            title: 'Perihal',
            key: 'perihal',
            sortable: false,
          },
          {
            title: 'Lampiran',
            key: 'lampiran',
            sortable: false,
          },
          {
            title: 'Tempat',
            key: 'tempat',
            sortable: false,
          },
          {
            title: 'Tanggal',
            key: 'tanggal',
            sortable: false,
          },
          {
            title: 'Kepada',
            key: 'kepada',
            sortable: false,
          },
          {
            title: 'Status',
            key: 'status_desc',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
            @click="
                () => {
                  const payload = { ...item };
                  payload.tanggal = new Date(payload.tanggal)
                    .toISOString()
                    .substring(0, 10);
                  dialogSave.show(payload, true);
                }
              "
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus Surat Masuk',
                  message: `Anda yakin ingin menghapus Surat Masuk ${
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
