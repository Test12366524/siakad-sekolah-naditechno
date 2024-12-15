<script setup lang="ts">
import { ref } from "vue";
import { VCol, VTextField, VTextarea } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();
const { user } = useAuthStore();

const taskEditDialog = ref();
const taskAssignmentDialog = ref();
const tableRef = ref();
const dosen = ref();
const mata_kuliah = ref();

useApi("master/dosen/all").then(({ data }) => {
  dosen.value = data;
});

useApi("master/mata-kuliah/all").then(({ data }) => {
  mata_kuliah.value = data;
});

const role_id = computed(() => user.role_id);

const isDosenOrAdmin = computed(
  () => role_id.value === 1 || role_id.value === 3
);

const getHeader = computed(() => {
  if (isDosenOrAdmin.value) {
    return [
      {
        title: "Mahasiswa",
        key: "mahasiswa_name",
        sortable: false,
      },
      {
        title: "Mata Kuliah",
        key: "mata_kuliah_name",
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
      title: "Dosen",
      key: "dosen_name",
      sortable: false,
    },
    {
      title: "Mata Kuliah",
      key: "mata_kuliah_name",
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
  console.log(user.role_id);
});

const mata_kuliah_id = ref<number | null>(null);
const dosen_id = ref<number | null>(null);
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
          @click="
            () => {
              window.open(formData.lms_link, '_blank');
            }
          "
        >
          <VIcon icon="ri-eye-line" class="mr-2" />Open Link
        </VBtn>
        <VBtn
          :disabled="!formData.file"
          class="d-flex justify-center items-center"
          @click="
            () => {
              window.open(formData.file, '_blank');
            }
          "
        >
          <VIcon icon="ri-eye-line" class="mr-2" />Tugas Mahasiswa
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
        v-model="formData.notes"
        rows="3"
        label="Catatan dari mahasiswa"
      />
    </VCol>
    <VCol cols="12">
      <VTextarea
        v-model="formData.description"
        rows="3"
        label="Catatan untuk mahasiswa"
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
        v-model="formData.mata_kuliah_name"
        label="Mata Kuliah"
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
      <VTextarea v-model="formData.lms_description" label="Deskripsi Soal" />
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
          @click="
            () => {
              window.open(formData.lms_link, '_blank');
            }
          "
        >
          <VIcon icon="ri-eye-line" class="mr-2" />Open Link
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
    <VCol cols="12">
      <VTextarea v-model="formData.description" rows="3" label="Keterangan" />
    </VCol>
  </SaveFileDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <!--
              <VCol cols="12" md="6">
              <VBtn
              v-if="isDosenOrAdmin"
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
                v-model="dosen_id"
                label="Dosen"
                density="compact"
                placeholder="Pilih Dosen"
                :items="dosen"
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
                label="Mata Kuliah"
                density="compact"
                placeholder="Pilih Mata Kuliah"
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
        title="Daftar Jawaban"
        path="lms-tugas"
        :dosen_id="dosen_id"
        :mata_kuliah_id="mata_kuliah_id"
        with-actions
        :headers="getHeader"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              v-if="!isDosenOrAdmin"
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
              v-if="isDosenOrAdmin"
              size="small"
              @click="
                () => {
                  const payload = { ...item };
                  payload.notes = item.description;
                  payload.description = '';
                  taskAssignmentDialog.show(payload);
                }
              "
            >
              <VIcon icon="ri-ball-pen-fill" />
            </IconBtn>
            <IconBtn
              v-if="isDosenOrAdmin"
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
