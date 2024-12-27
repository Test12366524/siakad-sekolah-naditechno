<script setup lang="ts">
import { ref } from "vue";
import { VCol, VTextField, VTextarea } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const guru = ref();
const mata_kuliah = ref();

const form = {
  mata_kuliah_id: "",
  guru_id: "",
  title: "",
  description: "",
  file: "",
};

useApi("master/guru/all").then(({ data }) => {
  guru.value = data;
});

const getMataKuliahByClass = (guru_id: number) => {
  useApi("master/mata-pelajaran/all/" + guru_id).then(({ data }) => {
    mata_kuliah.value = data;
  });
}

onMounted(() => {
  useApi("auth/me").then(({ data }) => {

    if (data.role_id == 1){
      useApi("master/guru/all").then(({ data }) => {
        guru.value = data;
      });
    } else if (data.role_id == 2){
      useApi("master/guru/all/" + data.id).then(({ data }) => {
        guru.value = data;
      });
    } else {
      useApi("master/guru/all").then(({ data }) => {
        guru.value = data;
      });
    }
    useApi(`silabus/${data.role_id}`).then(({ data }) => {
      if(data == 0){
        navigateTo(`/not-authorized`);
      }
    });
  });
});

const mata_kuliah_id = ref<number | null>(null);
const guru_id = ref<number | null>(null);
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isDetail }"
    ref="dialogSave"
    width="1200"
    path="silabus"
    title="Tambah Silabus"
    edit-title="Edit Silabus"
    detail-title="Detail Silabus"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.guru_id"
        label="Guru"
        density="compact"
        :error-messages="validationErrors.guru_id"
        placeholder="Pilih Guru"
        :items="guru"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :readonly="isDetail"
        @update:model-value="
          (guru_id: number) => {
            getMataKuliahByClass(guru_id);
          }
        "
      />
    </VCol>
    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.mata_kuliah_id"
        label="Mata Pelajaran"
        density="compact"
        :error-messages="validationErrors.mata_kuliah_id"
        placeholder="Pilih Mata Pelajaran"
        :items="mata_kuliah"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :readonly="isDetail"
      />
    </VCol>
    <VCol cols="12" md="12">
      <VTextField
        v-model="formData.title"
        :error-messages="validationErrors.title"
        label="Judul"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="12">
      <VTextarea
        v-model="formData.description"
        label="Deskripsi"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="12">
      <FileInput
        v-model="formData.file"
        accept=".pdf"
        label="File PDF"
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
            <VCol cols="12" md="6">
              <VBtn color="primary" @click="dialogSave.show()">
                <VIcon end icon="ri-add-fill" />
                Tambah Data
              </VBtn>
            </VCol>
            <VCol cols="12" md="3" style="margin-block-start: 5px">
              <VAutocomplete
                v-model="guru_id"
                label="Guru"
                density="compact"
                placeholder="Pilih Guru"
                :items="guru"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="12" md="3" style="margin-block-start: 5px">
              <VAutocomplete
                v-model="mata_kuliah_id"
                label="Mata Pelajaran"
                density="compact"
                placeholder="Pilih Mata Pelajaran"
                :items="mata_kuliah"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Silabus"
        path="silabus"
        :guru_id="guru_id"
        :mata_kuliah_id="mata_kuliah_id"
        :with-actions="true"
        :headers="[
          {
            title: 'Guru',
            key: 'guru_name',
            sortable: false,
          },
          {
            title: 'Mata Pelajaran',
            key: 'mata_pelajaran_name',
            sortable: false,
          },
          {
            title: 'Judul',
            key: 'title',
            sortable: false,
          },

          {
            title: 'File PDF',
            key: 'file',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              size="small"
              title="Detail"
              @click="dialogSave.show({ ...item }, true)"
            >
              <VIcon icon="ri-eye-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                () => {
                  dialogSave.show({ ...item });
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Silabus',
                  message: `Anda yakin ingin menghapus Silabus ${
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
