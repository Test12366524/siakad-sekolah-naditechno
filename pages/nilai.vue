<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const mahasiswa = ref();
const dosen = ref();
const mata_kuliah = ref();
const kelas = ref();

const form = {
  kelas_id: "",
  dosen_id: "",
  mata_kuliah_id: "",
  mahasiswa_id: "",
  kehadiran: "",
  tugas: "",
  uts: "",
  uas: "",
  total: "",
  predikat: "",
};

useApi("mahasiswa/all").then(({ data }) => {
    mahasiswa.value = data;
});

useApi("master/dosen/all").then(({ data }) => {
    dosen.value = data;
});

useApi("master/kelas/all").then(({ data }) => {
  kelas.value = data;
});

useApi("master/mata-kuliah/all").then(({ data }) => {
    mata_kuliah.value = data;
});

onMounted(() => {
  useApi("auth/me").then(({ data }) => {
    
  });
});

const mata_kuliah_id = ref<number | null>(null);
const dosen_id = ref<number | null>(null);
const kelas_id = ref<number | null>(null);

</script>

<template>
  <SaveFileDialog
    width="1200"
    v-if="tableRef"
    path="nilai"
    title="Tambah Nilai"
    edit-title="Edit Nilai"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="4">
      <VAutocomplete
        v-model="formData.kelas_id"
        label="Kelas"
        density="compact"
        :error-messages="validationErrors.kelas_id"
        placeholder="Pilih Kelas"
        :items="kelas"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
    <VCol cols="12" md="4">
      <VAutocomplete
        v-model="formData.dosen_id"
        label="Dosen"
        density="compact"
        :error-messages="validationErrors.dosen_id"
        placeholder="Pilih Dosen"
        :items="dosen"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
    <VCol cols="12" md="4">
      <VAutocomplete
        v-model="formData.mata_kuliah_id"
        label="Mata Kuliah"
        density="compact"
        :error-messages="validationErrors.mata_kuliah_id"
        placeholder="Pilih Mata Kuliah"
        :items="mata_kuliah"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12" md="12">
      <VAutocomplete
        v-model="formData.mahasiswa_id"
        label="Mahasiswa"
        density="compact"
        :error-messages="validationErrors.mahasiswa_id"
        placeholder="Pilih Mahasiswa"
        :items="mahasiswa"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.kehadiran"
        label="Absensi"
        type="number"
      />
    </VCol>
    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.tugas"
        label="Tugas"
        type="number"
      />
    </VCol>
    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.uts"
        label="UTS"
        type="number"
      />
    </VCol>
    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.uas"
        label="UAS"
        type="number"
      />
    </VCol>
    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.total"
        label="Total"
        type="number"
      />
    </VCol>
    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.predikat"
        label="Predikat"
      />
    </VCol>
  </SaveFileDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol cols="12" md="6">
              <VBtn @click="dialogSave.show()" color="primary">
                <VIcon end icon="ri-add-fill" />
                Tambah Data
              </VBtn>
            </VCol>
            <VCol cols="12" md="2" style="margin-top: 5px;">
              <VAutocomplete
                v-model="kelas_id"
                label="Kelas"
                density="compact"
                placeholder="Pilih Kelas"
                :items="kelas"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="12" md="2" style="margin-top: 5px;">
              <VAutocomplete
                v-model="dosen_id"
                label="Dosen"
                density="compact"
                placeholder="Pilih Dosen"
                :items="dosen"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="12" md="2" style="margin-top: 5px;">
              <VAutocomplete
                v-model="mata_kuliah_id"
                label="Mata Kuliah"
                density="compact"
                placeholder="Pilih Mata Kuliah"
                :items="mata_kuliah"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Nilai"
        path="nilai"
        :with-actions="true"
        :kelas_id="kelas_id"
        :dosen_id="dosen_id"
        :mata_kuliah_id="mata_kuliah_id"
        :headers="[
          {
            title: 'Kelas',
            key: 'kelas_name',
            sortable: false,
          },
          {
            title: 'Dosen',
            key: 'dosen_name',
            sortable: false,
          },
          {
            title: 'Mata Kuliah',
            key: 'mata_kuliah_name',
            sortable: false,
          },
          {
            title: 'NIM',
            key: 'mahasiswa_nim',
            sortable: false,
          },
          {
            title: 'Nama',
            key: 'mahasiswa_name',
            sortable: false,
          },
          {
            title: 'Absensi',
            key: 'kehadiran',
            sortable: false,
          },
          {
            title: 'Tugas',
            key: 'tugas',
            sortable: false,
          },
          {
            title: 'UTS',
            key: 'uts',
            sortable: false,
          },
          {
            title: 'UAS',
            key: 'uas',
            sortable: false,
          },
          {
            title: 'Total',
            key: 'total',
            sortable: false,
          },
          {
            title: 'Predikat',
            key: 'predikat',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              @click="dialogSave.show({ ...item })"
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus Nilai',
                  message: `Anda yakin ingin menghapus Nilai ${
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
