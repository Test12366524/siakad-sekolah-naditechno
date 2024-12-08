<script setup lang="ts">
import { ref } from 'vue';
import { VCol } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const jadwal = ref();
const kelas = ref();
const dosen = ref();
const mata_kuliah = ref();
const semester = ref();

const days = ref([
  { id: '0', text: "Senin" },
  { id: '1', text: "Selasa" },
  { id: '2', text: "Rabu" },
  { id: '3', text: "Kamis" },
  { id: '4', text: "Jumat" },
  { id: '5', text: "Sabtu" },
  { id: '6', text: "Minggu" },
]);

const form = {
  kelas_id: undefined,
  jadwal_id: undefined,
  semester_id: undefined,
};

useApi("jadwal-mata-kuliah/all").then(({ data }) => {
  jadwal.value = data;
});

useApi("master/semester/all").then(({ data }) => {
  semester.value = data;
});

useApi("master/mata-kuliah/all").then(({ data }) => {
  mata_kuliah.value = data;
});

useApi("master/dosen/all").then(({ data }) => {
  dosen.value = data;
});

useApi("master/kelas/all").then(({ data }) => {
  kelas.value = data;
});

const mata_kuliah_id = ref<number | null>(null);
const dosen_id = ref<number | null>(null);
const kelas_id = ref<number | null>(null);
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="kelas-jadwal"
    title="Tambah Kelas Jadwal"
    edit-title="Edit Kelas Jadwal"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="12">
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
    
    <VCol cols="12" md="12">
      <VAutocomplete
        v-model="formData.jadwal_id"
        label="Jadwal"
        density="compact"
        :error-messages="validationErrors.jadwal_id"
        placeholder="Pilih Jadwal"
        :items="jadwal"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12" md="12">
      <VAutocomplete
        v-model="formData.semester_id"
        label="Semester"
        density="compact"
        :error-messages="validationErrors.semester_id"
        placeholder="Pilih Semester"
        :items="semester"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
  </SaveDialog>

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
        title="Data Kelas Jadwal"
        path="kelas-jadwal"
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
            title: 'Kode Kelas',
            key: 'kelas_code',
            sortable: false,
          },
          {
            title: 'Mata Kuliah',
            key: 'mata_kuliah_name',
            sortable: false,
          },
          {
            title: 'Dosen',
            key: 'dosen_name',
            sortable: false,
          },
          {
            title: 'Semester',
            key: 'semester_name',
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
                  title: 'Hapus Kelas Jadwal',
                  message: `Anda yakin ingin menghapus Kelas Jadwal ${
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
