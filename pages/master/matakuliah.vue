<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const fakultas = ref();
const jurusans = ref();
const semesters = ref();

const form = {
  fakultas_id: undefined,
  jurusan_id: undefined,
  semester_id: undefined,
  name: "",
  code: "",
  description: "",
  status: 1,
};

useApi("master/fakultas/all").then(({ data }) => {
    fakultas.value = data;
});

useApi("master/jurusan/all").then(({ data }) => {
    jurusans.value = data;
});

useApi("master/semester/all").then(({ data }) => {
    semesters.value = data;
});

onMounted(() => {
  useApi("auth/me").then(({ data }) => {
    useApi(`master/matakuliah/${data.role_id}`).then(({ data }) => {
      if(data == 0){
        navigateTo(`/not-authorized`);
      }
    });
  });
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="master/mata-kuliah"
    title="Tambah Mata Kuliah"
    edit-title="Edit Mata Kuliah"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="4">
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
    <VCol cols="12" md="4">
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

    <VCol cols="12" md="4">
      <VAutocomplete
        v-model="formData.semester_id"
        label="Semester"
        density="compact"
        :error-messages="validationErrors.semester_id"
        placeholder="Pilih Semester"
        :items="semesters"
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

    <VCol cols="12">
      <VTextarea
        :error-messages="validationErrors.description"
        v-model="formData.description"
        label="Deskripsi"
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
        title="Data Mata Kuliah"
        path="master/mata-kuliah"
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
            title: 'Semester',
            key: 'semester_name',
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
          {
            title: 'Deskripsi',
            key: 'description',
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
                  title: 'Hapus Mata Kuliah',
                  message: `Anda yakin ingin menghapus Mata Kuliah ${
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
