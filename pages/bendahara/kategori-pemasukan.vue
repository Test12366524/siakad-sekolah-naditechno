<script setup lang="ts">
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const form = {
  name: "",
};

onMounted(() => {
  const { user } = useAuthStore();
  useApi(`level/bendahara-kategori-pemasukan/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  });
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="kategori-pemasukan"
    title="Form Kategori Pemasukan"
    edit-title="Form Kategori Pemasukan"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12">
      <VTextField
        :error-messages="validationErrors.name"
        v-model="formData.name"
        label="Nama"
      />
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VBtn @click="dialogSave.show()" color="primary">
            <VIcon end icon="ri-add-fill" />
            Tambah Data
          </VBtn>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Kategori Pemasukan"
        path="kategori-pemasukan"
        :with-actions="true"
        :headers="[
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn @click="dialogSave.show(item)" size="small">
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus Kategori Pemasukan',
                  message: `Anda yakin ingin menghapus Kategori Pemasukan ${
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
