<script setup lang="ts">
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const cabangs = ref();

const form = ref({
  name: "",
  email: "",
  phone_number: "",
  address: "",
  cabang_id: undefined,
  status: 1,
});

onMounted(() => {
  useApi("cabang/all").then(({ data }) => {
    cabangs.value = data;
  });
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="supplier"
    title="Tambah Supplier"
    edit-title="Edit Supplier"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    width="1200"
  >
    <VCol cols="6">
      <VAutocomplete
        v-model="formData.cabang_id"
        label="Cabang"
        density="compact"
        :error-messages="validationErrors.cabang_id"
        placeholder="Pilih Cabang"
        :items="cabangs"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="6">
      <VTextField
        :error-messages="validationErrors.name"
        v-model="formData.name"
        label="Nama Supplier"
      />
    </VCol>

    <VCol cols="6">
      <VTextField
        :error-messages="validationErrors.phone_number"
        v-model="formData.phone_number"
        label="No. Whatsapp"
      />
    </VCol>

    <VCol cols="6">
      <VTextField
        :error-messages="validationErrors.email"
        v-model="formData.email"
        label="Email"
      />
    </VCol>

    <VCol cols="12">
      <VTextarea
        :error-messages="validationErrors.address"
        v-model="formData.address"
        label="Alamat"
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
        title="Data Supplier"
        path="supplier"
        :with-actions="true"
        :headers="[
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
          {
            title: 'Cabang',
            key: 'cabang_name',
            sortable: false,
          },
          {
            title: 'No. Whatsapp',
            key: 'phone_number',
            sortable: false,
          },
          {
            title: 'Email',
            key: 'email',
            sortable: false,
          },
          {
            title: 'Alamat',
            key: 'address',
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
                  cabang_name: undefined,
                })
              "
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus Supplier',
                  message: `Anda yakin ingin menghapus supplier ${
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
