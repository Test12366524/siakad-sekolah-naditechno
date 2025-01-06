<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();
const { user } = useAuthStore();

const dialogSave = ref();
const tableRef = ref();
const baseUrl = "gallery";

const headers = [
  {
    title: "Judul",
    key: "title",
    sortable: false,
  },
  {
    title: "Deskripsi",
    key: "description",
    sortable: false,
  },
  {
    title: "Publish Date",
    key: "publish_date",
    sortable: false,
  },
  {
    title: "Status",
    key: "status_desc",
    sortable: false,
  },
];

const form = {
  title: "",
  image: "",
  description: "",
  publish_date: "",
  status: "",
};

const category = ref();
useApi("gallery-category/all").then(({ data }) => {
  category.value = data;
});

onMounted(() => {
  const { user } = useAuthStore();
  useApi(`level/web-galeri/${user.role_id}`).then(({ data }) => {
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
    :path="baseUrl"
    title="Tambah Galeri"
    edit-title="Edit Galeri"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    :width="1000"
  >
    <VCol cols="12">
      <VTextField
        v-model="formData.title"
        :error-messages="validationErrors.title"
        label="Title"
      />
    </VCol>

    <VCol cols="12" md="6">
      <FileInput
        v-model="formData.image"
        accept="image/*"
        label="Cover"
        small-chips
        chips
        show-preview
      />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.publish_date"
        :error-messages="validationErrors.publish_date"
        label="Publish Date"
        type="date"
      />
    </VCol>
    <VCol cols="12" md="3">
      <VAutocomplete
        v-model="formData.status"
        label="Status"
        :error-messages="validationErrors.status"
        placeholder="Pilih Status"
        :items="[
          {
            id: 0,
            text: 'Draft',
          },
          {
            id: 1,
            text: 'Published',
          },
        ]"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
    <VCol cols="12">
      <VTextarea
        v-model="formData.description"
        :error-messages="validationErrors.description"
        label="Deskripsi"
      />
    </VCol>
  </SaveFileDialog>

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
        title="Galeri"
        :path="baseUrl"
        :with-actions="true"
        :headers="headers"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              size="small"
              @click="
                () => {
                  console.log(item);
                  dialogSave.show({
                    ...item,
                    publish_date: new Date(item.publish_date)
                      .toISOString()
                      .split('T')[0],
                  });
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Galeri',
                  message: `Anda yakin ingin menghapus galeri ini?`,
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
