<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();
const { user } = useAuthStore();

const dialogSave = ref();
const tableRef = ref();
const baseUrl = "info";

const headers = [
  {
    title: "Judul",
    key: "title",
    sortable: false,
  },
  {
    title: "Tanggal dibuat",
    key: "created_at",
    sortable: false,
  },
  {
    title: "Status",
    key: "status_desc",
    sortable: false,
  },
];

const form = ref({
  title: "",
  image: "",
  description: "",
  status: 1,
});

const previewPhoto = ref(null);

onMounted(() => {
  if (user.role_id !== 1) return navigateTo("/not-authorized");
});
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :path="baseUrl"
    title="Tambah Info"
    edit-title="Edit Info"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    :width="1000"
  >
    <VCol cols="12">
      <VImg
        class="mb-3"
        rounded
        border
        max-height="300"
        :src="
          previewPhoto ||
          'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
        "
      />
      <FileInput
        v-model="formData.image"
        accept="image/*"
        label="Upload Foto (Optional)"
        @change="
          (data) => {
            previewPhoto = data.previewImageUrl;
          }
        "
      />
    </VCol>
    <VCol cols="12">
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
      <VTextField
        v-model="formData.title"
        :error-messages="validationErrors.title"
        label="Judul"
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
              <VBtn
                color="primary"
                @click="
                  () => {
                    previewPhoto = null;
                    dialogSave.show();
                  }
                "
              >
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
        title="Prestasi"
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
                  previewPhoto = item.image ? getFileUrl(item.image) : null;
                  dialogSave.show(item);
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Prestasi',
                  message: `Anda yakin ingin menghapus info ini?`,
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
