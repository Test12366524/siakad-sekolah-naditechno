<script setup lang="ts">
const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const baseUrl = "slider";

const headers = [
  {
    title: "Title",
    key: "title",
    sortable: false,
  },
  {
    title: "Description",
    key: "description",
    sortable: false,
  },
  {
    title: "Order",
    key: "order",
    sortable: false,
  },
  {
    title: "Status",
    key: "status",
    sortable: false,
  },
];

const form = {
  title: "",
  image: "",
  description: "",
  content: "",
  status: "",
  order: "",
};

onMounted(() => {
  useApi("auth/me").then(({ data }) => {
    useApi(`web/slider/${data.role_id}`).then(({ data }) => {
      if(data == 0){
        navigateTo(`/not-authorized`);
      }
    });
  });
});
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors }"
    ref="dialogSave"
    :path="baseUrl"
    title="Tambah Ekstrakulikuler"
    edit-title="Edit Ekstrakulikuler"
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
    <VCol cols="12">
      <VTextarea
        v-model="formData.description"
        :error-messages="validationErrors.description"
        label="Description"
      />
    </VCol>
    <VCol cols="12">
      <VTextarea
        v-model="formData.content"
        :error-messages="validationErrors.content"
        label="Content"
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
        v-model="formData.order"
        :error-messages="validationErrors.order"
        label="Order"
        type="number"
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
        title="Berita"
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
                  title: 'Hapus Berita',
                  message: `Anda yakin ingin menghapus berita ini?`,
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
