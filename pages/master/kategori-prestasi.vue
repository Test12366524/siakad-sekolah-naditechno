<script setup lang="ts">
const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();

const form = ref({
  name: "",
});

const { user } = useAuthStore();

onMounted(() => {
  if (user.role_id !== 1) navigateTo("/not-authorized");
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="prestasi-category"
    title="Tambah Kategori Prestasi"
    edit-title="Edit Kategori Prestasi"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    :request-form="form"
    :width="600"
  >
    <VCol cols="12">
      <VTextField
        v-model="formData.name"
        :error-messages="validationErrors.name"
        label="Nama Kategori"
      />
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol>
              <VBtn color="primary" @click="dialogSave.show()">
                <VIcon end icon="ri-add-fill" />
                Tambah Data
              </VBtn>
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Daftar Kategori Prestasi"
        path="prestasi-category"
        :with-actions="true"
        :headers="[
          {
            title: 'Kategori',
            key: 'name',
            sortable: false,
          },
          {
            title: 'Tanggal dibuat',
            key: 'created_at',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              size="small"
              @click="dialogSave.show({ ...item, status_desc: undefined })"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Kategori Prestasi',
                  message: `Anda yakin ingin menghapus kategori prestasi ${
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
