<script setup lang="ts">
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const banks = ref();
const kategoriPemasukans = ref();

const form = ref({
  kategori_pemasukan_id: undefined,
  bank_id: undefined,
  nominal: "",
  tanggal: "",
  keterangan: "",
  status: 1,
});

onMounted(() => {
  useApi("bank-mitra/all").then(({ data }) => {
    banks.value = data;
  });
  useApi("kategori-pemasukan/all").then(({ data }) => {
    kategoriPemasukans.value = data;
  });
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="pemasukan"
    title="Tambah Pemasukan"
    edit-title="Edit Pemasukan"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    width="1200"
  >
    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.kategori_pemasukan_id"
        label="Kategori"
        density="compact"
        :error-messages="validationErrors.kategori_pemasukan_id"
        placeholder="Pilih Kategori"
        :items="kategoriPemasukans"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.bank_id"
        label="Bank"
        density="compact"
        :error-messages="validationErrors.bank_id"
        placeholder="Pilih Bank"
        :items="banks"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="6">
      <VTextField
        :error-messages="validationErrors.nominal"
        v-model="formData.nominal"
        label="Nominal"
        type="number"
      />
    </VCol>

    <VCol cols="6">
      <VTextField
        type="date"
        :error-messages="validationErrors.tanggal"
        v-model="formData.tanggal"
        label="Tanggal"
      />
    </VCol>

    <VCol cols="12">
      <VTextarea
        :error-messages="validationErrors.keterangan"
        v-model="formData.keterangan"
        label="Keterangan"
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
        title="Data Pemasukan"
        path="pemasukan"
        :with-actions="true"
        :headers="[
          {
            title: 'Tanggal',
            key: 'tanggal',
            sortable: false,
          },
          {
            title: 'Kategori',
            key: 'kategori_name',
            sortable: false,
          },
          {
            title: 'Bank',
            key: 'bank_name',
            sortable: false,
          },
          {
            title: 'Nominal',
            key: 'nominal',
            sortable: false,
          },
          {
            title: 'Keterangan',
            key: 'keterangan',
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
                })
              "
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus Pemasukan',
                  message: `Anda yakin ingin menghapus Pemasukan ${
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
