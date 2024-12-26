<script setup lang="ts">
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const form = ref({
  siswa_id: "",
  sekolah: "",
  keterangan: "",
  tanggal: null,
});

const studentList = ref([]);

const getAllStudent = async () => {
  useApi("siswa/all").then(({ data }) => {
    studentList.value = data;
  });
};

const handleExportPdf = (item) => {
  const payload = { ...item };
  console.log(payload);
};

onMounted(() => {
  getAllStudent();
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="mutasi-masuk"
    title="Tambah Surat Mutasi Masuk"
    edit-title="Edit Surat Mutasi Masuk"
    v-slot="{ formData, validationErrors, isEditing, isDetail }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    :requestForm="form"
    width="1200"
  >
    <VCol cols="12" md="4">
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
        :readonly="isDetail"
      />
    </VCol>
    <VCol cols="12" md="4">
      <VTextField
        :error-messages="validationErrors.sekolah"
        v-model="formData.sekolah"
        label="Sekolah"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        type="date"
        :error-messages="validationErrors.tanggal"
        v-model="formData.tanggal"
        label="Tanggal"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12">
      <VTextarea
        :error-messages="validationErrors.keterangan"
        v-model="formData.keterangan"
        label="Keterangan"
        :readonly="isDetail"
        rows="2"
      />
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VBtn
            @click="
              () => {
                dialogSave.show();
              }
            "
            color="primary"
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
        title="Data Surat Mutasi Masuk"
        path="mutasi-masuk"
        :with-actions="true"
        :headers="[
          {
            title: 'Siswa',
            key: 'siswa_name',
            sortable: false,
          },
          {
            title: 'Sekolah',
            key: 'sekolah',
            sortable: false,
          },
          {
            title: 'Keterangan',
            key: 'keterangan',
            sortable: false,
          },

          {
            title: 'Tanggal',
            key: 'tanggal',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              label="Edit"
              @click="
                () => {
                  const payload = { ...item };
                  payload.tanggal = new Date(payload.tanggal)
                    .toISOString()
                    .substring(0, 10);
                  dialogSave.show(payload, false);
                }
              "
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              label="Export PDF"
              @click="
                () => {
                  handleExportPdf(item);
                }
              "
              size="small"
            >
              <VIcon icon="ri-export-fill" />
            </IconBtn>
            <IconBtn
              label="Hapus"
              @click="
                confirmDialog.show({
                  title: 'Hapus Surat Masuk',
                  message: `Anda yakin ingin menghapus Surat Masuk ${
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
