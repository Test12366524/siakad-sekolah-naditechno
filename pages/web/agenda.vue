<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const baseUrl = "agenda";

const headers = [
  {
    title: "Judul",
    key: "title",
    sortable: false,
  },
  {
    title: "Tanggal",
    key: "created_at",
    sortable: false,
  },
];

const form = {
  title: "",
  cover: "",
  content: "",
  status: "",
};

const category = ref();
useApi("agenda-category/all").then(({ data }) => {
  category.value = data;
});

onMounted(() => {
  const { user } = useAuthStore();
  useApi(`level/web-agenda/${user.role_id}`).then(({ data }) => {
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
    title="Tambah Agenda"
    edit-title="Edit Agenda"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    :width="1000"
  >
    <VCol cols="12">
      <VTextField
        v-model="formData.title"
        :error-messages="validationErrors.title"
        label="Judul"
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
    
    <VCol cols="12" md="6">
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
        title="Agenda"
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
                  title: 'Hapus Agenda',
                  message: `Anda yakin ingin menghapus agenda ini?`,
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
