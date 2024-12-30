<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const jurusans = ref();
const semesters = ref();
const predikatList = ["A", "B", "C", "D", "E"];

const form = {
  jurusan_id: undefined,
  semester_id: undefined,
  name: "",
  code: "",
  description: "",
  minimal: "",
  minimal_predikat: null,
  status: 1,
};

useApi("master/jurusan/all").then(({ data }) => {
  jurusans.value = data;
});

useApi("master/semester/all").then(({ data }) => {
  semesters.value = data;
});

onMounted(() => {
  useApi("auth/me").then(({ data }) => {
    useApi(`master/mata-pelajaran/${data.role_id}`).then(({ data }) => {
      if (data == 0) navigateTo("/not-authorized");
    });
  });
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="master/mata-pelajaran"
    title="Tambah Mata Pelajaran"
    edit-title="Edit Mata Pelajaran"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
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

    <VCol cols="12" md="6">
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
        v-model="formData.code"
        :error-messages="validationErrors.code"
        label="Kode"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        v-model="formData.name"
        :error-messages="validationErrors.name"
        label="Nama"
      />
    </VCol>

    <VCol cols="12">
      <VTextarea
        v-model="formData.description"
        :error-messages="validationErrors.description"
        label="Deskripsi"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.minimal"
        :error-messages="validationErrors.minimal"
        label="Minimal Nilai"
        typr="number"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.minimal_predikat"
        label="Minimal Predikat"
        :error-messages="validationErrors.minimal_predikat"
        placeholder="Pilih Predikat"
        :items="predikatList"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12">
      <VLabel>Status</VLabel>
      <VRadioGroup
        v-model="formData.status"
        inline
        :error-messages="validationErrors.status"
      >
        <VRadio label="Aktif" :value="1" />
        <VRadio label="Nonaktif" :value="0" />
      </VRadioGroup>
    </VCol>
  </SaveDialog>

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
        title="Data Mata Pelajaran"
        path="master/mata-pelajaran"
        :with-actions="true"
        :headers="[
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
              size="small"
              @click="dialogSave.show({ ...item, status_desc: undefined })"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Mata Pelajaran',
                  message: `Anda yakin ingin menghapus Mata Pelajaran ${
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
