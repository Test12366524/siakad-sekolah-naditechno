<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const form = {
  name: "",
  code: "",
  description: "",
};

onMounted(() => {
  const { user } = useAuthStore();
  useApi(`level/master-fakultas/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  });
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="master/fakultas"
    title="Tambah Fakultas"
    edit-title="Edit Fakultas"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12">
      <VTextField
        :error-messages="validationErrors.code"
        v-model="formData.code"
        label="Kode"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        :error-messages="validationErrors.name"
        v-model="formData.name"
        label="Nama"
      />
    </VCol>
    
    <VCol cols="12">
      <VTextarea
        :error-messages="validationErrors.description"
        v-model="formData.description"
        label="Deskripsi"
      />
    </VCol>

  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol>
              <VBtn @click="dialogSave.show()" color="primary">
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
        title="Data Fakultas"
        path="master/fakultas"
        :with-actions="true"
        :headers="[
          {
            title: 'Kode',
            key: 'code',
            sortable: false,
          },
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
          {
            title: 'Deskripsi',
            key: 'description',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              @click="dialogSave.show({ ...item, status_desc: undefined })"
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus Fakultas',
                  message: `Anda yakin ingin menghapus Fakultas ${
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
