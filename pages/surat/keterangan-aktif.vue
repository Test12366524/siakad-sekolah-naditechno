<script setup lang="ts">
import { VTextField } from 'vuetify/lib/components/index.mjs'

const { confirmDialog } = useCommonStore()

const dialogSave = ref()

const tableRef = ref()

const form = ref({
  penomoran: '',
  siswa_id: '',
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
  getAllStudent()
})
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing, isDetail }"
    ref="dialogSave"
    path="surat-keterangan-aktif"
    title="Tambah Surat Keterangan Aktif"
    edit-title="Edit Surat Keterangan Aktif"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    :request-form="form"
    width="600"
  >
    <VCol cols="12">
      <VTextField
        v-model="formData.penomoran"
        :error-messages="validationErrors.penomoran"
        label="Nomor Surat"
        :readonly="isDetail"
      />
    </VCol>
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
        :readonly="isDetail"
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
              <VBtn
                color="info"
                @click="handleImportData"
              >
                <VIcon
                  end
                  icon="ri-download-2-line"
                  class="mr-1"
                />
                Import Data
              </VBtn>
              <VBtn
                color="info"
                @click="handleExportData"
              >
                <VIcon
                  end
                  icon="ri-upload-2-line"
                  class="mr-1"
                />
                Export Data
              </VBtn>
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Surat Keterangan Aktif"
        path="surat-keterangan-aktif"
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
                  title: 'Hapus Surat Keterangan Aktif',
                  message: `Anda yakin ingin menghapus Surat Keterangan Aktif ${
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
