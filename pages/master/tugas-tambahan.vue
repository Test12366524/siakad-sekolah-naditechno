<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();

const form = {
  name: "",
  status: 1,
};


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
    path="master/tugas-tambahan"
    title="Tambah Tugas Tambahan"
    edit-title="Edit Tugas Tambahan"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    :request-form="form"
    width="500"
  >
    <VCol cols="12">
      <VTextField
        v-model="formData.name"
        :error-messages="validationErrors.name"
        label="Nama Tugas Tambahan"
      />
    </VCol>
    <VCol cols="12">
      <VLabel>Status</VLabel>
      <VRadioGroup
        v-model="formData.status"
        inline
        :error-messages="validationErrors.status"
      >
        <VRadio label="Aktif" :value="1" />
        <VRadio label="Nonaktif" :value="0" />
      </VRadioGroup>
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
        title="Data Tugas Tambahan"
        path="master/tugas-tambahan"
        :with-actions="true"
        :headers="[
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
          {
            title: 'Status',
            key: 'status_desc',
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
                  title: 'Hapus Tugas Tambahan',
                  message: `Anda yakin ingin menghapus Tugas Tambahan ${
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
