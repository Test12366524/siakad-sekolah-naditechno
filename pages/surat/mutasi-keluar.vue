<script setup lang="ts">
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const siswa = ref();

const form = ref({
  siswa_id: undefined,
  sekolah: "",
  keterangan: "",
  tanggal: "",
  status: 1,
});

onMounted(() => {
  useApi("siswa/all").then(({ data }) => {
    siswa.value = data;
  });
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="surat-mutasi-keluar"
    title="Tambah Surat Mutasi Keluar"
    edit-title="Edit Surat Mutasi Keluar"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    width="1200"
  >
    <VCol cols="12" md="12">
      <VAutocomplete
        v-model="formData.siswa_id"
        label="Siswa"
        density="compact"
        :error-messages="validationErrors.siswa_id"
        placeholder="Pilih Siswa"
        :items="siswa"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.sekolah"
        v-model="formData.sekolah"
        label="Sekolah"
      />
    </VCol>

    <VCol cols="12" md="6">
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
        title="Data Surat Mutasi Keluar"
        path="surat-mutasi-keluar"
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
                  title: 'Hapus Surat Mutasi Keluar',
                  message: `Anda yakin ingin menghapus Surat Mutasi Keluar ${
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
