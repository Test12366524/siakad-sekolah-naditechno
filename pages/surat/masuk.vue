<script setup lang="ts">
import { VTextField } from 'vuetify/lib/components/index.mjs'

const { confirmDialog } = useCommonStore()

const dialogSave = ref()

const tableRef = ref()

const form = ref({
  penomoran: '',
  perihal: '',
  lampiran: '',
  tempat: '',
  tanggal: '',
  kepada: '',
  content: '',
  atas_nama: '',
})

const handleExportPdf = item => {
  const payload = { ...item }

  console.log(payload)
}

const handleExportData = () => {
  console.log('Export Data')
}

const handleImportData = () => {
  console.log('Import Data')
}
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="surat-masuk"
    title="Tambah Surat Masuk"
    edit-title="Edit Surat Masuk"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    width="1200"
  >
    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        v-model="formData.penomoran"
        :error-messages="validationErrors.penomoran"
        label="Penomoran"
      />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        v-model="formData.perihal"
        :error-messages="validationErrors.perihal"
        label="Perihal"
      />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        v-model="formData.lampiran"
        :error-messages="validationErrors.lampiran"
        label="Lampiran"
      />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        v-model="formData.tempat"
        :error-messages="validationErrors.tempat"
        label="Tempat"
      />
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <VTextField
        v-model="formData.tanggal"
        type="date"
        :error-messages="validationErrors.tanggal"
        label="Tanggal"
      />
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <VTextField
        v-model="formData.kepada"
        :error-messages="validationErrors.kepada"
        label="Kepada"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
    >
      <VTextField
        v-model="formData.atas_nama"
        :error-messages="validationErrors.atas_nama"
        label="Atas Nama"
      />
    </VCol>
    <VCol cols="12">
      <VTextarea
        v-model="formData.content"
        :error-messages="validationErrors.content"
        label="Deskripsi"
      />
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VBtn
                color="primary"
                @click="dialogSave.show()"
              >
                <VIcon
                  end
                  icon="ri-add-fill"
                  class="mr-1"
                />
                Tambah Data
              </VBtn>
            </VCol>
            <VCol
              cols="12"
              md="6"
              style="display: flex; justify-content: flex-end; gap: 1rem;"
            >
            <ImportFileExcel path="" />
            <ExportFileExcel path="" />
            </VCol>
          </VRow>
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
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              label="Edit"
              size="small"
              @click="
                () => {
                  const payload = { ...item };
                  payload.tanggal = new Date(payload.tanggal)
                    .toISOString()
                    .substring(0, 10);
                  dialogSave.show(payload, false);
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              label="Export PDF"
              size="small"
              @click="
                () => {
                  handleExportPdf(item);
                }
              "
            >
              <VIcon icon="ri-export-fill" />
            </IconBtn>
            <IconBtn
              label="Hapus"
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Surat Masuk',
                  message: `Anda yakin ingin menghapus Surat Masuk ${
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
