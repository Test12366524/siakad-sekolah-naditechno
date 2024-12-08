<script setup lang="ts">
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const categoryServices = ref();
const cabangs = ref();

const form = ref({
  code: "",
  name: "",
  price: 0,
  description: "",
  sku: "",
  category_product_id: undefined,
  cabang_id: undefined,
  status: 1,
});

onMounted(() => {
  useApi("category-product/all").then(({ data }) => {
    categoryServices.value = data;
  });

  useApi("cabang/all").then(({ data }) => {
    cabangs.value = data;
  });
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="product"
    title="Tambah Produk"
    edit-title="Edit Produk"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    width="1200"
  >
    <VCol cols="12">
      <VTextField
        :error-messages="validationErrors.name"
        v-model="formData.name"
        label="Nama Produk"
      />
    </VCol>

    <VCol cols="6">
      <VAutocomplete
        v-model="formData.category_product_id"
        label="Kategori Produk"
        density="compact"
        :error-messages="validationErrors.category_product_id"
        placeholder="Pilih Kategori Produk"
        :items="categoryServices"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="6">
      <VAutocomplete
        v-model="formData.cabang_id"
        label="Cabang"
        density="compact"
        :error-messages="validationErrors.cabang_id"
        placeholder="Pilih cabang"
        :items="cabangs"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        type="number"
        :error-messages="validationErrors.price"
        v-model="formData.price"
        label="Harga"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        :error-messages="validationErrors.sku"
        v-model="formData.sku"
        label="SKU"
      />
    </VCol>

    <VCol cols="12">
      <VTextarea
        :error-messages="validationErrors.description"
        v-model="formData.description"
        label="Deskripsi"
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
        title="Data Produk"
        path="product"
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
            title: 'Kategori Produk',
            key: 'category_product_name',
            sortable: false,
          },
          {
            title: 'Cabang',
            key: 'cabang_name',
            sortable: false,
          },
          {
            title: 'Harga',
            key: 'price',
            sortable: false,
          },
          {
            title: 'SKU',
            key: 'sku',
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
                  category_product_name: undefined,
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
                  title: 'Hapus Produk',
                  message: `Anda yakin ingin menghapus produk ${
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
