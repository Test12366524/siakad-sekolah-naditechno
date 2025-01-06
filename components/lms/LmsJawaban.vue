<script setup lang="ts">
import { ref } from "vue";
import { VCol, VTextField, VTextarea } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();
const { user } = useAuthStore();

const taskEditDialog = ref();
const taskEditNilaiDialog = ref();
const taskAssignmentDialog = ref();
const tableRef = ref();
const guru = ref();
const mata_pelajaran = ref();

const role_id = computed(() => user.role_id);

if(user.role_id == 1){
  useApi("master/guru/all").then(({ data }) => {
    guru.value = data;
  });
  useApi("master/mata-pelajaran/all").then(({ data }) => {
    mata_pelajaran.value = data;
  });
}else if(user.role_id == 2){
  useApi("master/guru/all/"+user.id).then(({ data }) => {
    guru.value = data;

    useApi("master/mata-pelajaran/all/" + data[0].id).then(({ data }) => {
      mata_pelajaran.value = data;
    });
  });
  
  
}else{
  useApi("master/guru/all").then(({ data }) => {
    guru.value = data;
  });
  useApi("master/mata-pelajaran/all").then(({ data }) => {
    mata_pelajaran.value = data;
  });
}

const isGuruOrAdmin = computed(
  () => role_id.value === 1 || role_id.value === 2
);

const getHeader = computed(() => {
  if (isGuruOrAdmin.value) {
    return [
      {
        title: "Siswa",
        key: "siswa_name",
        sortable: false,
      },
      {
        title: "Mata Pelajaran",
        key: "mata_pelajaran_name",
        sortable: false,
      },
      {
        title: "Judul",
        key: "lms_title",
        sortable: false,
      },
      {
        title: "Tanggal Mulai",
        key: "lms_start_date",
        sortable: false,
      },
      {
        title: "Tanggal Selesai",
        key: "lms_until_date",
        sortable: false,
      },
      {
        title: "Nilai",
        key: "nilai",
        sortable: false,
      },
    ];
  }

  return [
    {
      title: "Guru",
      key: "guru_name",
      sortable: false,
    },
    {
      title: "Mata Pelajaran",
      key: "mata_pelajaran_name",
      sortable: false,
    },
    {
      title: "Judul",
      key: "lms_title",
      sortable: false,
    },
    {
      title: "Tanggal Mulai",
      key: "lms_start_date",
      sortable: false,
    },
    {
      title: "Tanggal Selesai",
      key: "lms_until_date",
      sortable: false,
    },
    {
      title: "Nilai",
      key: "nilai",
      sortable: false,
    },
  ];
});

const formUploadTugas = ref({
  user_id: user.id,
  lms_id: "",
  description: "",
  file: "",
});

const formNilaiTugas = ref({
  user_id: user.id,
  lms_id: "",
  description: "",
  nilai: "",
});

onMounted(() => {
  tableRef.value.refresh();
});

const mata_pelajaran_id = ref<number | null>(null);
const guru_id = ref<number | null>(null);
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="taskAssignmentDialog"
    width="800"
    path="lms-tugas"
    title="Form Penilaian"
    edit-title="Form Penilaian"
    :refresh-callback="tableRef.refresh"
    :request-form="formNilaiTugas"
    custom-button-text="Submit"
  >
    <VCol cols="12">
      <div class="d-flex justify-between items-center gap-4">
        <VBtn
          :disabled="!formData.lms_file_pdf"
          class="d-flex justify-center items-center"
          @click="
            () => {
              openFileHandler(formData.lms_file_pdf);
            }
          "
        >
          <VIcon icon="ri-eye-line" class="mr-2" />{{
            formData.lms_file_pdf ? "Soal 1" : "Soal 1 (Kosong)"
          }}
        </VBtn>
        <VBtn
          :disabled="!formData.lms_file_image"
          class="d-flex justify-center items-center"
          @click="
            () => {
              openFileHandler(formData.lms_file_image);
            }
          "
        >
          <VIcon icon="ri-eye-line" class="mr-2" />{{
            formData.lms_file_image ? "Soal 2" : "Soal 2 (Kosong)"
          }}
        </VBtn>
        <VBtn
          :disabled="!formData.lms_link"
          class="d-flex justify-center items-center"
          :href="formData.lms_link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <VIcon icon="ri-eye-line" class="mr-2" />
          Open Link
        </VBtn>
        <VBtn
          :disabled="!formData.file"
          class="d-flex justify-center items-center"
          @click="
            () => {
              openFileHandler(formData.file);
            }
          "
        >
          <VIcon icon="ri-eye-line" class="mr-2" />Tugas Siswa
        </VBtn>
        <VTextField
          v-model="formData.nilai"
          density="compact"
          label="Nilai"
          type="number"
        />
      </div>
    </VCol>
    <VCol cols="12">
      <VTextarea
        v-model="formData.description"
        rows="3"
        label="Catatan untuk siswa"
      />
    </VCol>
  </SaveFileDialog>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="taskEditDialog"
    width="1000"
    path="lms-tugas"
    title="Edit Tugas"
    edit-title="Edit Tugas"
    :refresh-callback="tableRef.refresh"
    :request-form="formUploadTugas"
    custom-button-text="Upload"
  >
    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.mata_pelajaran_name"
        label="Mata Pelajaran"
        readonly
      />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.lms_start_date"
        label="Dari Tanggal"
        readonly
      />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.lms_until_date"
        label="Sampai Tanggal"
        readonly
      />
    </VCol>
    <VCol cols="12" md="6">
      <VTextField v-model="formData.lms_title" label="Judul" readonly />
    </VCol>
    <VCol cols="12" md="6">
      <VTextField v-model="formData.lms_subtitle" label="Sub Judul" readonly />
    </VCol>
    <VCol cols="12">
      <VTextarea v-model="formData.description" label="Deskripsi Guru" disabled/>
    </VCol>
    <VCol cols="12" md="7">
      <div class="d-flex justify-between items-center gap-4">
        <VBtn
          :disabled="!formData.lms_file_pdf"
          class="d-flex justify-center items-center"
          @click="
            () => {
              openFileHandler(formData.lms_file_pdf);
            }
          "
        >
          <VIcon icon="ri-eye-line" class="mr-2" />{{
            formData.lms_file_pdf ? "Soal 1 (PDF)" : "Soal 1 (Kosong)"
          }}
        </VBtn>
        <VBtn
          :disabled="!formData.lms_file_image"
          class="d-flex justify-center items-center"
          @click="
            () => {
              openFileHandler(formData.lms_file_image);
            }
          "
        >
          <VIcon icon="ri-eye-line" class="mr-2" />{{
            formData.lms_file_image ? "Soal 2 (Image)" : "Soal 2 (Kosong)"
          }}
        </VBtn>
        <VBtn
          :disabled="!formData.lms_link"
          class="d-flex justify-center items-center"
          :href="formData.lms_link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <VIcon icon="ri-eye-line" class="mr-2" />
          Open Link
        </VBtn>
      </div>
    </VCol>
    <VCol cols="12" md="5">
      <FileInput
        v-model="formData.file"
        :label="
          typeof formData.file === 'string' ? formData.file : 'Upload Jawaban'
        "
        small-chips
        show-preview
        chips
      />
    </VCol>
  </SaveFileDialog>
  <SaveFileDetailDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="taskEditNilaiDialog"
    width="1000"
    path="lms-tugas"
    title="Edit Tugas"
    edit-title="Edit Tugas"
    :refresh-callback="tableRef.refresh"
    :request-form="formUploadTugas"
    custom-button-text="Upload"
  >
    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.mata_pelajaran_name"
        label="Mata Pelajaran"
        readonly
      />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.lms_start_date"
        label="Dari Tanggal"
        readonly
      />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.lms_until_date"
        label="Sampai Tanggal"
        readonly
      />
    </VCol>
    <VCol cols="12" md="6">
      <VTextField v-model="formData.lms_title" label="Judul" readonly />
    </VCol>
    <VCol cols="12" md="6">
      <VTextField v-model="formData.lms_subtitle" label="Sub Judul" readonly />
    </VCol>
    <VCol cols="12">
      <VTextarea v-model="formData.description" label="Deskripsi Guru" disabled/>
    </VCol>
    <VCol cols="12" md="7">
      <div class="d-flex justify-between items-center gap-4">
        <VBtn
          :disabled="!formData.lms_file_pdf"
          class="d-flex justify-center items-center"
          @click="
            () => {
              openFileHandler(formData.lms_file_pdf);
            }
          "
        >
          <VIcon icon="ri-eye-line" class="mr-2" />{{
            formData.lms_file_pdf ? "Soal 1 (PDF)" : "Soal 1 (Kosong)"
          }}
        </VBtn>
        <VBtn
          :disabled="!formData.lms_file_image"
          class="d-flex justify-center items-center"
          @click="
            () => {
              openFileHandler(formData.lms_file_image);
            }
          "
        >
          <VIcon icon="ri-eye-line" class="mr-2" />{{
            formData.lms_file_image ? "Soal 2 (Image)" : "Soal 2 (Kosong)"
          }}
        </VBtn>
        <VBtn
          :disabled="!formData.lms_link"
          class="d-flex justify-center items-center"
          :href="formData.lms_link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <VIcon icon="ri-eye-line" class="mr-2" />
          Open Link
        </VBtn>
      </div>
    </VCol>
    <VCol cols="12" md="5">
      <FileInput
        v-model="formData.file"
        :label="
          typeof formData.file === 'string' ? formData.file : 'Upload Jawaban'
        "
        small-chips
        show-preview
        chips
      />
    </VCol>
  </SaveFileDetailDialog>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <!--
              <VCol cols="12" md="6">
              <VBtn
              v-if="isGuruOrAdmin"
              color="primary"
              @click="taskEditDialog.show()"
              >
              <VIcon end icon="ri-add-fill" />
              Tambah Data
              </VBtn>
              </VCol>
            -->
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
                :items="mata_pelajaran"
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
        title="Daftar Jawaban"
        path="lms-tugas"
        :guru_id="guru_id"
        :mata_pelajaran_id="mata_pelajaran_id"
        with-actions
        :headers="getHeader"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              v-if="!isGuruOrAdmin && item.nilai >= 0 && item.nilai != undefined"
              size="small"
              @click="
                () => {
                  taskEditNilaiDialog.show(item);
                }
              "
            >
              <VIcon icon="ri-eye-line" />
            </IconBtn>

            <IconBtn
              v-if="!isGuruOrAdmin && item.nilai == undefined"
              size="small"
              @click="
                () => {
                  taskEditDialog.show(item);
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            
            <IconBtn
              v-if="isGuruOrAdmin"
              size="small"
              @click="
                () => {
                  const payload = { ...item };
                  taskAssignmentDialog.show(payload);
                }
              "
            >
              <VIcon icon="ri-ball-pen-fill" />
            </IconBtn>
            <IconBtn
              v-if="isGuruOrAdmin"
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus LMS',
                  message: `Anda yakin ingin menghapus LMS ${
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

<style scoped>
  :deep(.v-field__input) {
    color-scheme: none;
  }
</style>
