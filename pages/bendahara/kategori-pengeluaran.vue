<script setup lang="ts">
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const form = {
  name: "",
};
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="kategori-pengeluaran"
    title="Form Kategori Pengeluaran"
    edit-title="Form Kategori Pengeluaran"
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
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VBtn @click="dialogSave.show()" color="primary">
            <VIcon end icon="ri-add-fill" />
            Tambah Data
          </VBtn>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Kategori Pengeluaran"
        path="kategori-pengeluaran"
        :with-actions="true"
        :headers="[
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn @click="dialogSave.show(item)" size="small">
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus Kategori Pengeluaran',
                  message: `Anda yakin ingin menghapus Kategori Pengeluaran ${
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
