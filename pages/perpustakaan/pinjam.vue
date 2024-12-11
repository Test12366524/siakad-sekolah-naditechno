<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();

const form = {
  category_book_id: "",
  title: "",
  author: "",
  cover: "",
  slug: "",
  description: "",
  publisher: "",
  publish_date: "",
  bahasa: "",
  halaman: "",
  panjang: "",
  lebar: "",
  berat: "",
  status: "",
};

const category_book = ref();
useApi("master/category-book/all").then(({ data }) => {
    category_book.value = data;
});

</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isDetail }"
    ref="dialogSave"
    width="1200"
    path="ppdb"
    title="Tambah Buku"
    edit-title="Edit Buku"
    detail-title="Detail Buku"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.category_book_id"
        label="Kategori Buku"
        density="compact"
        :error-messages="validationErrors.category_book_id"
        placeholder="Pilih Kategori Buku"
        :items="category_book"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.title"
        :error-messages="validationErrors.title"
        label="Judul"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="12">
      <VTextarea
        v-model="formData.description"
        :error-messages="validationErrors.description"
        label="Deskripsi"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.author"
        :error-messages="validationErrors.author"
        label="Author"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <FileInput
        v-model="formData.cover"
        accept="image/*"
        label="Cover"
        small-chips
        chips
        show-preview
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.slug"
        :error-messages="validationErrors.slug"
        label="Slug"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.publisher"
        :error-messages="validationErrors.publisher"
        label="Publisher"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        type="date"
        v-model="formData.publish_date"
        :error-messages="validationErrors.publish_date"
        label="Publish Date"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.bahasa"
        :error-messages="validationErrors.bahasa"
        label="Bahasa"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.halaman"
        :error-messages="validationErrors.halaman"
        label="Halaman"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.panjang"
        :error-messages="validationErrors.panjang"
        label="Panjang"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.lebar"
        :error-messages="validationErrors.lebar"
        label="Lebar"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.berat"
        :error-messages="validationErrors.berat"
        label="Berat"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
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
        title="Data Buku"
        path="book"
        :with-actions="true"
        :headers="[
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
          {
            title: 'NIK',
            key: 'nik',
            sortable: false,
          },
          {
            title: 'Jenis Kelamin',
            key: 'gender',
            sortable: false,
          },
          {
            title: 'Status Menikah',
            key: 'mariage_desc',
            sortable: false,
          },
          {
            title: 'No. Handphone',
            key: 'phone',
            sortable: false,
          },
          {
            title: 'Pendidikan Terakhir',
            key: 'pendidikan_terakhir',
            sortable: false,
          },
          {
            title: 'Pekerjaan',
            key: 'pekerjaan',
            sortable: false,
          },
          {
            title: 'Alamat',
            key: 'address',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              size="small"
              title="Detail"
              @click="
                () => {
                  dialogSave.show({ ...item }, true);
                }
              "
            >
              <VIcon icon="ri-eye-line" />
            </IconBtn>
            <IconBtn size="small" @click="dialogSave.show({ ...item })">
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Buku',
                  message: `Anda yakin ingin menghapus Buku ${
                    (item as any).name
                  }?`,
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
