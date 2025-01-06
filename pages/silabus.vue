<script setup lang="ts">
import { ref } from "vue";
import { VCol, VTextField, VTextarea } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const guru = ref();
const mata_pelajaran = ref();
const filter_mata_pelajaran = ref();

const form = {
  mata_pelajaran_id: "",
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
    mata_pelajaran.value = data;
  });
}

useApi("master/mata-pelajaran/all").then(({ data }) => {
  filter_mata_pelajaran.value = data;
});

const role_id = ref();
const status_action = ref();

onMounted(() => {
  const { user } = useAuthStore();
  useApi(`level/silabus/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  });
  if (user.role_id == 1){
    status_action.value = user.role_id == 1;
    useApi("master/guru/all").then(({ data }) => {
      guru.value = data;
    });
  } else if (user.role_id == 2){
    status_action.value = user.role_id == 2;
    useApi("master/guru/all/" + user.id).then(({ data }) => {
      guru.value = data;
    });
  } else {
    useApi("master/guru/all").then(({ data }) => {
      guru.value = data;
    });
  }

  role_id.value = user.role_id;
});

const mata_pelajaran_id = ref<number | null>(null);
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
        v-model="formData.mata_pelajaran_id"
        label="Mata Pelajaran"
        density="compact"
        :error-messages="validationErrors.mata_pelajaran_id"
        placeholder="Pilih Mata Pelajaran"
        :items="mata_pelajaran"
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
              <VBtn color="primary" v-if="role_id == 1 || role_id == 2" @click="dialogSave.show()">
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
                v-model="mata_pelajaran_id"
                label="Mata Pelajaran"
                density="compact"
                placeholder="Pilih Mata Pelajaran"
                :items="filter_mata_pelajaran"
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
        :mata_pelajaran_id="mata_pelajaran_id"
        :with-actions="status_action"
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
