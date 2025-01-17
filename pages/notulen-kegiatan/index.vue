<script setup lang="ts">
import { VTextarea, VTextField } from 'vuetify/lib/components/index.mjs';
const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const form = ref({
    tanggal: "", // guruid
    title: "", // guruid
    catatan: "", // guruid
    file: null, // guruid
    gambar_1: null, // guruid
    gambar_2: null, // guruid
});


onMounted(() => {
  const { user } = useAuthStore();
  useApi(`level/notulen-kegiatan/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  }); 

});
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="notulen-kegiatan"
    title="Tambah Notulen Kegiatan"
    edit-title="Edit Notulen Kegiatan"
    :default-form="form"
    :request-form="form"
    :refresh-callback="tableRef.refresh"
    width="600"
  >

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
        v-model="formData.title"
        :error-messages="validationErrors.title"
        label="Judul"
      />
    </VCol>

    <VCol cols="12">
      <VTextarea
        v-model="formData.catatan"
        :error-messages="validationErrors.catatan"
        label="Catatan"
      />
    </VCol>
    <VCol cols="12" md="4">
        <FileInput
            v-model="formData.file"
            label="Upload File"
            showPreview
        />
    </VCol>
    <VCol cols="12" md="4">
        <FileInput
            v-model="formData.gambar_1"
            label="Upload Gambar 1"
            showPreview
        />
    </VCol>
    <VCol cols="12" md="4">
        <FileInput
            v-model="formData.gambar_2"
            label="Upload Gambar 2"
            showPreview
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
        title="Data Notulen Kegiatan"
        path="notulen-kegiatan"
        :with-actions="true"
        :headers="[
          {
            title: 'Tanggal',
            key: 'tanggal',
            sortable: false,
          },
          {
            title: 'Judul',
            key: 'title',
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
              label="Tambah Guru"
              size="small"
              @click="
                () => {
                  navigateTo(`/notulen-kegiatan/${item.id}`);
                }
              "
            >
              <VIcon icon="ri-add-box-fill" />
            </IconBtn>
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
                  title: 'Hapus Notulen Kegiatan',
                  message: `Anda yakin ingin menghapus Notulen Kegiatan ${
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
