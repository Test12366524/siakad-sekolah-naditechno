<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();
const { user } = useAuthStore();

const dialogSave = ref();
const tableRef = ref();
const baseUrl = "article";

const headers = [
  {
    title: "Title",
    key: "title",
    sortable: false,
  },
  {
    title: "Author",
    key: "author_name",
    sortable: false,
  },
  {
    title: "Slug",
    key: "slug",
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
  subtitle: "",
  cover: "",
  content: "",
  publish_date: "",
  author_id: user.id,
  status: "",
};
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :path="baseUrl"
    title="Tambah Berita"
    edit-title="Edit Berita"
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
      <VTextField
        v-model="formData.subtitle"
        :error-messages="validationErrors.subtitle"
        label="Subtitle"
      />
    </VCol>
    <VCol cols="12" md="6">
      <FileInput
        v-model="formData.cover"
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
        v-model="formData.content"
        :error-messages="validationErrors.content"
        label="Content"
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
