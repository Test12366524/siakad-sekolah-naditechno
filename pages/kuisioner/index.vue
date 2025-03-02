<script setup lang="ts">
import { ref } from 'vue';
import { VCol, VTextarea } from "vuetify/lib/components/index.mjs";

const { snackbar, confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const jadwal = ref();
const kelas = ref();
const guru = ref();
const mata_pelajaran = ref();
const semester = ref();
const filter_semester = ref();
const filter_periode = ref();
const periode = ref();

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
  jadwal_id: undefined,
  pertemuan_ke: "",
  title: "",
  description: "",
};

useApi("jadwal-mata-pelajaran/all").then(({ data }) => {
  jadwal.value = data;
});

useApi("master/semester/all/0").then(({ data }) => {
  filter_semester.value = data;
});

useApi("master/periode/all/0").then(({ data }) => {
  filter_periode.value = data;
});

const role_id = ref();
const status_action = ref();
const { user } = useAuthStore();

onMounted(() => {
//   useApi(`level/kuisioner/${user.role_id}`).then(({ data }) => {
//     if(data == 0){
//       navigateTo(`/not-authorized`);
//     }
//   });
  role_id.value = user.role_id;
  status_action.value = user.role_id === 1 || user.role_id === 6
});

const jadwal_id = ref<number | null>(null);
const pertemuan_ke = ref<number | null>(null);
const semester_id = ref<number | null>(null);
const periode_id = ref<number | null>(null);

const value_jadwal_id = ref<number | null>(null);
const value_pertemuan_ke = ref<number | null>(null);
const value_semester_id = ref<number | null>(null);
const value_periode_id = ref<number | null>(null);

const setJadwal = (jadwal_id: number) => {
  value_jadwal_id.value = jadwal_id;
};

const setPertemuanKe = (pertemuan_ke: number) => {
    value_pertemuan_ke.value = pertemuan_ke;
    if (value_pertemuan_ke.value && value_jadwal_id.value) {
        checkingData(value_jadwal_id.value, value_pertemuan_ke.value);
    }
};

const checkingData = (jadwal_id: number, pertemuan_ke: number) => {
  useApi(`/kuisioner/${jadwal_id}/${pertemuan_ke}`)
    .then(({ data }) => {
      if (data && data.length > 0) {
        snackbar.show({
          message: "Kuisioner Mata Pelajaran di pertemuan ini sudah ada.",
          color: "error",
        });
        // Process the data
      } else {
        console.log('No data found');
        // Handle no data scenario
      }
    })
    .catch((error) => {
      console.error('Error checking data:', error);
    });
};

</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="kuisioner"
    title="Tambah Kuisioner"
    edit-title="Edit Kuisioner"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >    
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
        @update:model-value="
          (jadwal_id: number) => {
            setJadwal(jadwal_id);
          }
        "
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12" md="12">
        <VTextField
            type="number"
            v-model="formData.pertemuan_ke"
            :error-messages="validationErrors.pertemuan_ke"
            label="Pertemuan Ke"
        />
    </VCol>
    <VCol cols="12" md="12">
        <VTextField
            v-model="formData.title"
            :error-messages="validationErrors.title"
            label="Judul"
        />
    </VCol>
    <VCol cols="12" md="12">
        <VTextarea
            v-model="formData.description"
            :error-messages="validationErrors.description"
            label="Deskripsi"
            rows="2"
        />
    </VCol>

  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol cols="12" md="5">
              <VBtn v-if="role_id === 1 || role_id === 6" @click="dialogSave.show()" color="primary">
                <VIcon end icon="ri-add-fill" />
                Tambah Data
              </VBtn>
            </VCol>
            <VCol cols="12" md="3">
              <VAutocomplete
                v-model="jadwal_id"
                label="Jadwal Mata Pelajaran"
                density="compact"
                placeholder="Pilih Mata Pelajaran"
                :items="jadwal"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="12" md="2">
              <VAutocomplete
                v-model="semester_id"
                density="compact"
                label="Semester"
                placeholder="Pilih Semester"
                :items="filter_semester"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="12" md="2">
              <VAutocomplete
                v-model="periode_id"
                density="compact"
                label="Tahun Ajaran"
                placeholder="Pilih Tahun Ajaran"
                :items="filter_periode"
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
        title="Data Kuisioner"
        path="kuisioner"
        :with-actions="role_id === 1 || role_id === 6"
        :jadwal_id="jadwal_id"
        :semester_id="semester_id"
        :periode_id="periode_id"
        :headers="[
          {
            title: 'Mata Pelajaran',
            key: 'mata_pelajaran_name',
            sortable: false,
          },
          {
            title: 'Guru',
            key: 'guru_name',
            sortable: false,
          },
          {
            title: 'Pertemuan Ke',
            key: 'pertemuan_ke',
            sortable: false,
          },
          {
            title: 'Judul',
            key: 'title',
            sortable: false,
          },
          {
            title: 'Semester',
            key: 'semester_name',
            sortable: false,
          },
          {
            title: 'Tahun Ajar',
            key: 'periode_name',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              label="Detail"
              size="small"
              title="Detail Soal"
              @click="
                () => {
                  navigateTo(`/kuisioner/${item.id}`);
                }
              "
            >
              <VIcon icon="ri-menu-add-fill" />
            </IconBtn>
            <IconBtn
              label="Hasil Siswa"
              size="small"
              title="Hasil Siswa"
              @click="
                () => {
                  navigateTo(`/kuisioner/hasil?id=${item.id}`);
                }
              "
            >
              <VIcon icon="ri-file-list-2-line" />
            </IconBtn>
            <IconBtn
              
              @click="dialogSave.show({ ...item })"
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
             
              @click="
                confirmDialog.show({
                  title: 'Hapus Kuisioner',
                  message: `Anda yakin ingin menghapus Kuisioner ${
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
