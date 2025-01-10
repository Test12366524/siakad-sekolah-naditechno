<script setup lang="ts">
import { VTextField } from 'vuetify/lib/components/index.mjs';

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const form = ref({
  siswa_id: null, // guruid
  tanggal: "",
  score: 0,
  catatan: "",
});

const studentList = ref([]);

const getAllStudent = async () => {
  useApi("siswa/all").then(({ data }) => {
    studentList.value = data;
  });
};

onMounted(() => {
  const { user } = useAuthStore();
//   useApi(`level/score-pelanggaran/${user.role_id}`).then(({ data }) => {
//     if(data == 0){
//       navigateTo(`/not-authorized`);
//     }
//   });
  getAllStudent();
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="score-pelanggaran"
    title="Tambah Score Pelanggaran Siswa"
    edit-title="Edit Score Pelanggaran Siswa"
    :default-form="form"
    :request-form="form"
    :refresh-callback="tableRef.refresh"
    width="600"
  >
    <VCol cols="12">
      <VAutocomplete
        v-model="formData.siswa_id"
        label="Siswa"
        :error-messages="validationErrors.siswa_id"
        placeholder="Pilih Siswa"
        :items="studentList"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        v-model="formData.tanggal"
        type="date"
        :error-messages="validationErrors.tanggal"
        label="Tanggal"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        v-model="formData.score"
        type="number"
        :error-messages="validationErrors.score"
        label="Score"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        v-model="formData.catatan"
        :error-messages="validationErrors.catatan"
        label="Catatan"
      />
    </VCol>
  </SaveDialog>

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
        title="Data Score Pelanggaran Siswa"
        path="score-pelanggaran"
        :with-actions="true"
        :headers="[
          {
            title: 'Siswa',
            key: 'siswa_name',
            sortable: false,
          },
          {
            title: 'Tanggal',
            key: 'tanggal',
            sortable: false,
          },
          {
            title: 'Score',
            key: 'score',
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
              label="Hapus"
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Score Pelanggaran',
                  message: `Anda yakin ingin menghapus Score Pelanggaran ${
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
