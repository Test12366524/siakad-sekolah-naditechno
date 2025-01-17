<script setup lang="ts">
import { VTextField } from 'vuetify/lib/components/index.mjs'

const { confirmDialog } = useCommonStore()

const dialogSave = ref()

const tableRef = ref()

const form = ref({
  penomoran: '',
  siswa_id: '',
  sekolah: '',
  keterangan: '',
  tanggal: null,
})

const studentList = ref([])

const getAllStudent = async () => {
  useApi('siswa/all').then(({ data }) => {
    studentList.value = data
  })
}

const handleExportPdf = item => {
  const payload = { ...item }

  console.log(payload)
}

const handleExportData = () => {
  console.log('Export Data')
}

const handleImportData = () => {
  console.log('Import Data')
}


onMounted(() => {
  const { user } = useAuthStore();
  useApi(`level/surat-mutasi-keluar/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  });
  getAllStudent();
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing, isDetail }"
    ref="dialogSave"
    path="mutasi-keluar"
    title="Tambah Surat Mutasi Keluar"
    edit-title="Edit Surat Mutasi Keluar"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    :request-form="form"
    width="1200"
  >
    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        v-model="formData.penomoran"
        :error-messages="validationErrors.penomoran"
        label="Nomor Surat"
        :readonly="isDetail"
      />
    </VCol>
    <VCol
      cols="12"
      md="6"
    >
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
    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        v-model="formData.sekolah"
        :error-messages="validationErrors.sekolah"
        label="SMP/MTS"
        :readonly="isDetail"
      />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        v-model="formData.tanggal"
        type="date"
        :error-messages="validationErrors.tanggal"
        label="Tanggal"
        :readonly="isDetail"
      />
    </VCol>
    <VCol cols="12">
      <VTextarea
        v-model="formData.keterangan"
        :error-messages="validationErrors.keterangan"
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
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VBtn
                color="primary"
                @click="dialogSave.show()"
              >
                <VIcon
                  end
                  icon="ri-add-fill"
                  class="mr-1"
                />
                Tambah Data
              </VBtn>
            </VCol>
            <VCol
              cols="12"
              md="6"
              style="display: flex; justify-content: flex-end; gap: 1rem;"
            >
            <ImportFileExcel path="" />
            <ExportFileExcel path="" />
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Surat Mutasi Keluar"
        path="mutasi-keluar"
        :with-actions="true"
        :headers="[
          {
            title: 'No Surat',
            key: 'penomoran',
            sortable: false,
          },
          {
            title: 'Siswa',
            key: 'siswa_name',
            sortable: false,
          },
          {
            title: 'SMP/MTS',
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
              label="Export PDF"
              size="small"
              @click="
                () => {
                  handleExportPdf(item);
                }
              "
            >
              <VIcon icon="ri-export-fill" />
            </IconBtn>
            <IconBtn
              label="Hapus"
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Surat Mutasi Keluar',
                  message: `Anda yakin ingin menghapus Surat Mutasi Keluar ${
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
