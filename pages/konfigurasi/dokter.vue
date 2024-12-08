<script setup lang="ts">
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const jenisDokters = ref();
const cabangs = ref();

const form = ref({
  code: "",
  name: "",
  jenis_marketing_id: undefined,
  address: "",
  phone_number: "",
  cabang_id: undefined,
  target_per_month: 0,
  status: 1,
});

onMounted(() => {
  useApi("jenis-marketing/all").then(({ data }) => {
    jenisDokters.value = data;
  });

  useApi("cabang/all").then(({ data }) => {
    cabangs.value = data;
  });
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="marketing"
    title="Tambah Dokter"
    edit-title="Edit Dokter"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    width="1200"
  >
    <VCol cols="12">
      <VTextField
        :error-messages="validationErrors.name"
        v-model="formData.name"
        label="Nama Dokter"
      />
    </VCol>

    <VCol cols="6">
      <VAutocomplete
        v-model="formData.jenis_marketing_id"
        label="Spesialis"
        density="compact"
        :error-messages="validationErrors.jenis_marketing_id"
        placeholder="Pilih Spesialis"
        :items="jenisDokters"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="6">
      <VAutocomplete
        v-model="formData.cabang_id"
        label="Cabang"
        density="compact"
        :error-messages="validationErrors.cabang_id"
        placeholder="Pilih cabang"
        :items="cabangs"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        type="number"
        :error-messages="validationErrors.phone_number"
        v-model="formData.phone_number"
        label="No HP"
      />
    </VCol>

    <VCol cols="12">
      <VTextarea
        :error-messages="validationErrors.address"
        v-model="formData.address"
        label="Alamat"
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
            <VCol>
              <div class="d-flex gap-3 items-center justify-end">
                <ExportFileExcel
                  path="marketing/export_excel"
                ></ExportFileExcel>
                <ImportFileExcel
                  @done="tableRef.refresh()"
                  path="marketing/import_excel"
                ></ImportFileExcel>
              </div>
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Dokter"
        path="marketing"
        :with-actions="true"
        :headers="[
          {
            title: 'Kode marketing',
            key: 'code',
            sortable: false,
          },
          {
            title: 'Nama Dokter',
            key: 'name',
            sortable: false,
          },
          {
            title: 'Jenis Dokter',
            key: 'jenis_marketing_name',
            sortable: false,
          },
          {
            title: 'Cabang',
            key: 'cabang_name',
            sortable: false,
          },
          {
            title: 'No HP',
            key: 'phone_number',
            sortable: false,
          },
          {
            title: 'Alamat',
            key: 'address',
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
                dialogSave.show({
                  ...item,
                  status_desc: undefined,
                  jenis_marketing_name: undefined,
                  cabang_name: undefined,
                })
              "
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus Dokter',
                  message: `Anda yakin ingin menghapus marketing ${
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
