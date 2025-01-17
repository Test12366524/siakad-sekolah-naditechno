<script setup lang="ts">
import { ref } from "vue";
import { VCol, VTextField, VTextarea } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();
const { user } = useAuthStore();

const taskFromGuruDialog = ref();
const taskForSiswaDialog = ref();
const tableRef = ref();
const guru = ref();
const mata_pelajaran = ref();
const filter_mata_pelajaran = ref();

const form = {
  mata_pelajaran_id: "",
  guru_id: "",
  title: "",
  subtitle: "",
  file_pdf: "",
  file_image: "",
  link: "",
  description: "",
  start_date: "",
  until_date: "",
  status: "",
};

const formUploadTugas = ref({
  user_id: user.id,
  lms_id: "",
  description: "",
  file: "",
});



const getMataPelajaranByClass = (guru_id: number) => {
  useApi("master/mata-pelajaran/all/" + guru_id).then(({ data }) => {
    mata_pelajaran.value = data;
  });
}

const role_id = computed(() => user.role_id);

if(user.role_id == 1){
  useApi("master/guru/all").then(({ data }) => {
    guru.value = data;
  });
  useApi("master/mata-pelajaran/all").then(({ data }) => {
    filter_mata_pelajaran.value = data;
  });
}else if(user.role_id == 2){
  useApi("master/guru/all/"+user.id).then(({ data }) => {
    guru.value = data;
  });
}else{
  useApi("master/guru/all").then(({ data }) => {
    guru.value = data;
  });
}

const isGuruOrAdmin = computed(
  () => role_id.value === 1 || role_id.value === 2
);

const isGuru = computed(() => role_id.value === 2);

const isSiswa = computed(() => role_id.value === 3);

const handleUploadTugas = (item) => {
  const payload = { ...item };

  payload.user_id = user.id;
  payload.lms_id = item.id;
  payload.description = "";
  payload.file = null;
  taskForSiswaDialog.value.show(payload);
};

const getGuruDetails = () => {
  const url = `master/guru?search=${user.email}`;
  useApi(url).then(({ data }) => {
    if (data.items){
      form.guru_id = data.items[0].id;
      getMataPelajaranByClass(data.items[0].id)

      useApi("master/mata-pelajaran/all/" + data.items[0].id).then(({ data }) => {
        filter_mata_pelajaran.value = data;
      });
    }  
  });
};

onMounted(() => {
  if (isGuru.value) getGuruDetails();
  if (form.guru_id > 0) getMataPelajaranByClass(form.guru_id)
  tableRef.value.refresh();
});

const mata_pelajaran_id = ref<number | null>(null);
const guru_id = ref<number | null>(null);

const resetTime = (date: any) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="taskForSiswaDialog"
    width="1200"
    path="lms-tugas"
    title="Upload Tugas"
    edit-title="Upload Tugas"
    :refresh-callback="tableRef.refresh"
    :request-form="formUploadTugas"
    custom-button-text="Upload"
    custom-method-api="POST"
  >
    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.mata_pelajaran_name"
        label="Mata Pelajaran"
        readonly
      />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField v-model="formData.start_date" label="Dari Tanggal" readonly />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.until_date"
        label="Sampai Tanggal"
        readonly
      />
    </VCol>
    <VCol cols="12" md="6">
      <VTextField v-model="formData.title" label="Judul" readonly />
    </VCol>
    <VCol cols="12" md="6">
      <VTextField v-model="formData.subtitle" label="Sub Judul" readonly />
    </VCol>
    <VCol cols="12">
      <VTextarea v-model="formData.description" label="Deskripsi" readonly />
    </VCol>
    <VCol cols="12" md="7">
      <div class="d-flex justify-between items-center gap-4">
        <VBtn
          :disabled="!formData.file_pdf"
          class="d-flex justify-center items-center"
          @click="
            () => {
              openFileHandler(formData.file_pdf);
            }
          "
        >
          <VIcon icon="ri-eye-line" class="mr-2" />{{
            formData.file_pdf ? "Soal 1 (PDF)" : "Soal 1 (Kosong)"
          }}
        </VBtn>
        <VBtn
          :disabled="!formData.file_image"
          class="d-flex justify-center items-center"
          @click="
            () => {
              openFileHandler(formData.file_image);
            }
          "
        >
          <VIcon icon="ri-eye-line" class="mr-2" />{{
            formData.file_image ? "Soal 2 (Image)" : "Soal 2 (Kosong)"
          }}
        </VBtn>
        <VBtn
          :disabled="!formData.link"
          class="d-flex justify-center items-center"
          :href="formData.link"
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
        label="Upload Jawaban"
        small-chips
        show-preview
        chips
      />
    </VCol>
  </SaveFileDialog>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="taskFromGuruDialog"
    width="1200"
    path="lms"
    title="Tambah Tugas"
    edit-title="Edit Tugas"
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
        :readonly="isGuru"
        required
        :clearable="!isGuru"
        clear-icon="ri-close-line"
        @update:model-value="
          (guru_id: number) => {
            getMataPelajaranByClass(guru_id);
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
      />
    </VCol>
    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.title"
        :error-messages="validationErrors.title"
        label="Judul"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.subtitle"
        :error-messages="validationErrors.subtitle"
        label="Sub Judul"
      />
    </VCol>

    <VCol cols="12" md="6">
      <FileInput
        v-model="formData.file_image"
        accept="image/*"
        label="Soal 1 (Image)"
        small-chips
        show-preview
        chips
      />
    </VCol>

    <VCol cols="12" md="6">
      <FileInput
        v-model="formData.file_pdf"
        accept="pdf/*"
        label="Soal 2 (PDF)"
        small-chips
        show-preview
        chips
      />
    </VCol>

    <VCol cols="12" md="12">
      <VTextField
        v-model="formData.link"
        :error-messages="validationErrors.link"
        label="Link"
      />
    </VCol>
    <VCol cols="12" md="12">
      <VTextarea v-model="formData.description" label="Deskripsi" />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.start_date"
        type="date"
        :error-messages="validationErrors.start_date"
        label="Tanggal Mulai"
      />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.until_date"
        type="date"
        :error-messages="validationErrors.until_date"
        label="Tanggal Akhir"
      />
    </VCol>
    <VCol cols="12" md="3">
      <VLabel>Status</VLabel>
      <VRadioGroup
        v-model="formData.status"
        inline
        :error-messages="validationErrors.status"
      >
        <VRadio label="Draft" :value="0" />
        <VRadio label="Publish" :value="1" />
        <VRadio label="Unpublish" :value="2" />
      </VRadioGroup>
    </VCol>
  </SaveFileDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol cols="12" md="6">
              <VBtn
                v-if="isGuruOrAdmin"
                color="primary"
                @click="taskFromGuruDialog.show()"
              >
                <VIcon end icon="ri-add-fill" />
                Tambah Tugas
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
        title="Daftar Tugas"
        path="lms"
        :guru_id="guru_id"
        :mata_pelajaran_id="mata_pelajaran_id"
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
            title: 'Tanggal Mulai',
            key: 'start_date',
            sortable: false,
          },
          {
            title: 'Tanggal Selesai',
            key: 'until_date',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              v-if="isGuruOrAdmin"
              size="small"
              @click="
                () => {
                  const payload = { ...item };
                  payload.start_date = new Date(payload.start_date)
                    .toISOString()
                    .substring(0, 10);
                  payload.until_date = new Date(payload.until_date)
                    .toISOString()
                    .substring(0, 10);
                  taskFromGuruDialog.show(payload);
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
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
            <IconBtn
              v-if="isSiswa && resetTime(new Date(item.until_date)) >= resetTime(new Date())"
              label="Upload Jawaban"
              size="small"
              @click="handleUploadTugas(item)"
            >
              <VIcon icon="ri-git-repository-commits-line" />
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
