<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const form = {
  name: "",
  start_date: "",
  until_date: "",
  status: 1,
};
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="master/periode"
    title="Tambah Periode"
    edit-title="Edit Periode"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >

    <VCol cols="12">
      <VTextField
        :error-messages="validationErrors.name"
        v-model="formData.name"
        label="Nama"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        type="date"
        :error-messages="validationErrors.start_date"
        v-model="formData.start_date"
        label="Tanggal Mulai"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        type="date"
        :error-messages="validationErrors.until_date"
        v-model="formData.until_date"
        label="Tanggal Akhir"
      />
    </VCol>

    <VCol cols="12">
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
        title="Data Periode"
        path="master/periode"
        :with-actions="true"
        :headers="[
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
          {
            title: 'Tanggal Mulai',
            key: 'start_date',
            sortable: false,
          },
          {
            title: 'Tanggal Akhir',
            key: 'until_date',
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
              @click="dialogSave.show({ ...item, status_desc: undefined })"
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus Periode',
                  message: `Anda yakin ingin menghapus Periode ${
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
