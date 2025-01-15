<script setup lang="ts">
import { ref } from 'vue';
import { VCol } from "vuetify/lib/components/index.mjs";

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
  kelas_id: undefined,
  jadwal_id: undefined,
  semester_id: undefined,
};

useApi("jadwal-mata-pelajaran/all").then(({ data }) => {
  jadwal.value = data;
});

useApi("master/semester/all/1").then(({ data }) => {
  semester.value = data;
});

useApi("master/semester/all/0").then(({ data }) => {
  filter_semester.value = data;
});

useApi("master/periode/all/1").then(({ data }) => {
  periode.value = data;
});

useApi("master/periode/all/0").then(({ data }) => {
  filter_periode.value = data;
});

useApi("master/mata-pelajaran/all").then(({ data }) => {
  mata_pelajaran.value = data;
});

useApi("master/guru/all").then(({ data }) => {
  guru.value = data;
});

useApi("master/kelas/all").then(({ data }) => {
  kelas.value = data;
});

const role_id = ref();
const status_action = ref();
const { user } = useAuthStore();

onMounted(() => {
  useApi(`level/kelas-jadwal/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  });
  role_id.value = user.role_id;
  console.log(role_id.value);
  status_action.value = user.role_id === 1 || user.role_id === 6
});

const mata_pelajaran_id = ref<number | null>(null);
const guru_id = ref<number | null>(null);
const kelas_id = ref<number | null>(null);
const semester_id = ref<number | null>(null);
const periode_id = ref<number | null>(null);

const value_kelas_id = ref<number | null>(null);
const value_jadwal_id = ref<number | null>(null);
const value_semester_id = ref<number | null>(null);
const value_periode_id = ref<number | null>(null);

const setKelas = (kelas_id: number) => {
  value_kelas_id.value = kelas_id;
};

const setJadwal = (jadwal_id: number) => {
  value_jadwal_id.value = jadwal_id;
};

const setSemester = (semester_id: number) => {
  value_semester_id.value = semester_id;
};

const setPeriode = (periode_id: number) => {
  value_periode_id.value = periode_id;
  if (value_kelas_id.value && value_jadwal_id.value && value_semester_id.value && value_periode_id.value) {
    checkingData(value_kelas_id.value, value_jadwal_id.value, value_semester_id.value, value_periode_id.value);
  }
};

const checkingData = (kelas_id: number, jadwal_id: number, semester_id: number, periode_id: number) => {
  useApi(`/kelas-jadwal/${kelas_id}/${jadwal_id}/${semester_id}/${periode_id}`)
    .then(({ data }) => {
      if (data && data.length > 0) {
        snackbar.show({
          message: "Kelas Jadwal Mata Pelajaran sudah ada.",
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
        @update:model-value="
          (kelas_id: number) => {
            setKelas(kelas_id);
          }
        "
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

    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.semester_id"
        label="Semester"
        density="compact"
        :error-messages="validationErrors.semester_id"
        placeholder="Pilih Semester"
        :items="semester"
        item-title="text"
        item-value="id"
        @update:model-value="
          (semester_id: number) => {
            setSemester(semester_id);
          }
        "
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.periode_id"
        density="compact"
        label="Periode"
        :error-messages="validationErrors.periode_id"
        placeholder="Pilih Periode"
        :items="periode"
        item-title="text"
        item-value="id"
        @update:model-value="
          (periode_id: number) => {
            setPeriode(periode_id);
          }
        "
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
            <VCol cols="12" md="2">
              <VBtn v-if="role_id === 1 || role_id === 6" @click="dialogSave.show()" color="primary">
                <VIcon end icon="ri-add-fill" />
                Tambah Data
              </VBtn>
            </VCol>
            <VCol cols="12" md="2">
              <VAutocomplete
                v-if="role_id != 3"
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
            <VCol cols="12" md="2">
              <VAutocomplete
                v-model="guru_id"
                label="Guru"
                density="compact"
                placeholder="Pilih Guru"
                :items="guru"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="12" md="2">
              <VAutocomplete
                v-model="mata_pelajaran_id"
                label="Mata Pelajaran"
                density="compact"
                placeholder="Pilih Mata Pelajaran"
                :items="mata_pelajaran"
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
        title="Data Kelas Jadwal"
        path="kelas-jadwal"
        :with-actions="role_id === 1 || role_id === 6"
        :kelas_id="kelas_id"
        :guru_id="guru_id"
        :mata_pelajaran_id="mata_pelajaran_id"
        :semester_id="semester_id"
        :periode_id="periode_id"
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
