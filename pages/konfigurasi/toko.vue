<script setup lang="ts">
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const marketplaces = ref();

const form = ref({
  name: "",
  marketplace_id: undefined,
  description: "",
  status: 1,
});

onMounted(() => {
  useApi("marketplace/all").then(({ data }) => {
    marketplaces.value = data;
  });
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="toko"
    title="Tambah Toko"
    edit-title="Edit Toko"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    width="1200"
  >
    <VCol cols="12">
      <VAutocomplete
        v-model="formData.marketplace_id"
        label="Kategori Marketplace"
        density="compact"
        :error-messages="validationErrors.marketplace_id"
        placeholder="Pilih Kategori Marketplace"
        :items="marketplaces"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        :error-messages="validationErrors.name"
        v-model="formData.name"
        label="Nama Toko"
      />
    </VCol>

    <VCol cols="12">
      <VTextarea
        :error-messages="validationErrors.description"
        v-model="formData.description"
        label="Description"
      />
    </VCol>

    <VCol cols="12">
      <VLabel>Status</VLabel>
      <VRadioGroup
        inline
        v-model="formData.status"
        :error-messages="validationErrors.status"
      >
        <VRadio label="Aktif" :value="1"></VRadio>
        <VRadio label="Nonaktif" :value="0"></VRadio>
      </VRadioGroup>
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
        title="Data Toko"
        path="toko"
        :with-actions="true"
        :headers="[
          {
            title: 'Kategori Toko',
            key: 'marketplace_name',
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
              @click="
                dialogSave.show({
                  ...item,
                  status_desc: undefined,
                  marketplace_name: undefined,
                })
              "
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus Toko',
                  message: `Anda yakin ingin menghapus Toko ${
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
