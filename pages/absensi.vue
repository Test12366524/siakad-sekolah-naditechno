<script setup lang="ts">
import { ref } from 'vue';
import { VCol, VTextarea } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const mahasiswa = ref();
const jadwal_mata_kuliah = ref();
const kelas = ref();
const mata_kuliah = ref();
const dosen = ref();

const form = {
  kelas_id: "",
  jadwal_id: "",
  pertemuan_ke: "",
  mahasiswa_id: "",
  kehadiran: "Hadir",
  description: "",
};

useApi("master/kelas/all").then(({ data }) => {
    kelas.value = data;
});

useApi("mahasiswa/all").then(({ data }) => {
    mahasiswa.value = data;
});

useApi("jadwal-mata-kuliah/all").then(({ data }) => {
    jadwal_mata_kuliah.value = data;
});

useApi("master/dosen/all").then(({ data }) => {
  dosen.value = data;
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
    path="absensi"
    title="Tambah Absensi"
    edit-title="Edit Absensi"
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
        v-model="formData.jadwal_id"
        label="Jadwal Mata Kuliah"
        density="compact"
        :error-messages="validationErrors.jadwal_id"
        placeholder="Pilih Jadwal Mata Kuliah"
        :items="jadwal_mata_kuliah"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
    <VCol cols="12" md="4">
      <VTextField
        type="number"
        :error-messages="validationErrors.pertemuan_ke"
        v-model="formData.pertemuan_ke"
        label="Pertemuan Ke"
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
    <VCol cols="12" md="12">
      <VLabel>Kehadiran</VLabel>
      <VRadioGroup
        inline
        v-model="formData.kehadiran"
        :error-messages="validationErrors.kehadiran"
      >
        <VRadio label="Hadir" value="Hadir"></VRadio>
        <VRadio label="Izin" value="Izin"></VRadio>
        <VRadio label="Sakit" value="Sakit"></VRadio>
        <VRadio label="Alpa" value="Alpa"></VRadio>
      </VRadioGroup>
    </VCol>
    <VCol cols="12" md="12">
      <VTextarea
        v-model="formData.description"
        label="Deskripsi"
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
        title="Data Absensi"
        path="absensi"
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
            title: 'Jadwal',
            key: 'hari_desc',
            sortable: false,
          },
          {
            title: 'Jam',
            key: 'jam_desc',
            sortable: false,
          },
          {
            title: 'Pertemuan Ke',
            key: 'pertemuan_ke',
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
            title: 'Kehadiran',
            key: 'kehadiran',
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
                  title: 'Hapus Absensi',
                  message: `Anda yakin ingin menghapus Absensi ${
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
