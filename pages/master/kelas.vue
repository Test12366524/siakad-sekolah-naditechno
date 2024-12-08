<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const fakultas = ref();
const jurusans = ref();

const form = {
  fakultas_id: undefined,
  jurusan_id: undefined,
  name: "",
  code: "",
};

useApi("master/fakultas/all").then(({ data }) => {
    fakultas.value = data;
});

useApi("master/jurusan/all").then(({ data }) => {
    jurusans.value = data;
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="master/kelas"
    title="Tambah Kelas"
    edit-title="Edit Kelas"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.fakultas_id"
        label="Fakultas"
        density="compact"
        :error-messages="validationErrors.fakultas_id"
        placeholder="Pilih Fakultas"
        :items="fakultas"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.jurusan_id"
        label="Jurusan"
        density="compact"
        :error-messages="validationErrors.jurusan_id"
        placeholder="Pilih Jurusan"
        :items="jurusans"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
    <VCol cols="12">
      <VTextField
        :error-messages="validationErrors.code"
        v-model="formData.code"
        label="Kode"
      />
    </VCol>

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
        title="Data Kelas"
        path="master/kelas"
        :with-actions="true"
        :headers="[
          {
            title: 'Fakultas',
            key: 'fakultas_name',
            sortable: false,
          },
          {
            title: 'Jurusan',
            key: 'jurusan_name',
            sortable: false,
          },
          {
            title: 'Kode',
            key: 'code',
            sortable: false,
          },
          {
            title: 'Nama',
            key: 'name',
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
                  title: 'Hapus Kelas',
                  message: `Anda yakin ingin menghapus Kelas ${
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
