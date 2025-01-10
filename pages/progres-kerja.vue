<script setup lang="ts">
import { VTextField } from 'vuetify/lib/components/index.mjs';

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const form = ref({
    user_id: null, // guruid
    kelas_id: null, // guruid
    mata_pelajaran_id: null, // guruid
    pertemuan_ke: 0, // guruid
    catatan: "", // guruid
    file: null, // guruid
});

const guru = ref([]);
const kelas = ref([]);
const mata_pelajaran = ref([]);


onMounted(() => {
  const { user } = useAuthStore();
//   useApi(`level/progres-kerja/${user.role_id}`).then(({ data }) => {
//     if(data == 0){
//       navigateTo(`/not-authorized`);
//     }
//   });

    useApi("user/all-guru").then(({ data }) => {
        guru.value = data;
    });

    useApi("master/kelas/all").then(({ data }) => {
        kelas.value = data;
    });

    useApi("master/mata-pelajaran/all").then(({ data }) => {
        mata_pelajaran.value = data;
    });
});
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="progres-kerja"
    title="Tambah Progress Kerja"
    edit-title="Edit Progress Kerja"
    :default-form="form"
    :request-form="form"
    :refresh-callback="tableRef.refresh"
    width="600"
  >
    <VCol cols="12">
      <VAutocomplete
        v-model="formData.user_id"
        label="Guru"
        :error-messages="validationErrors.user_id"
        placeholder="Pilih Guru"
        :items="guru"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12">
      <VAutocomplete
        v-model="formData.kelas_id"
        label="Kelas"
        :error-messages="validationErrors.kelas_id"
        placeholder="Pilih Kelas"
        :items="kelas"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12">
      <VAutocomplete
        v-model="formData.mata_pelajaran_id"
        label="Mata Pelajaran"
        :error-messages="validationErrors.mata_pelajaran_id"
        placeholder="Pilih Mata Pelajaran"
        :items="mata_pelajaran"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        v-model="formData.pertemuan_ke"
        type="number"
        :error-messages="validationErrors.pertemuan_ke"
        label="Pertemuan Ke"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        v-model="formData.catatan"
        :error-messages="validationErrors.catatan"
        label="Catatan"
      />
    </VCol>
    <VCol cols="12">
        <FileInput
            v-model="formData.file"
            label="Upload File"
        />
    </VCol>
  </SaveFileDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VBtn
            color="primary" 
            @click="
              () => {
                dialogSave.show();
              }
            "
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
        title="Data Progress Kerja"
        path="progres-kerja"
        :with-actions="true"
        :headers="[
          {
            title: 'Guru',
            key: 'user_name',
            sortable: false,
          },
          {
            title: 'Kelas',
            key: 'kelas_name',
            sortable: false,
          },
          {
            title: 'Mata Pelajaran',
            key: 'mata_pelajaran_name',
            sortable: false,
          },
          {
            title: 'Catatan',
            key: 'catatan',
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
                  dialogSave.show(payload, false);
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              label="Hapus"
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Progress Kerja',
                  message: `Anda yakin ingin menghapus Progress Kerja ${
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
