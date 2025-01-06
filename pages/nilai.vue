<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const siswa = ref();
const guru = ref();
const semester = ref();
const filter_semester = ref();
const periode = ref();
const filter_periode = ref();
const filter_mata_pelajaran = ref();
const mata_pelajaran = ref();
const kelas = ref();
const bulkingDialog = ref();
const siswaTableRef = ref();

const form = ref({
  kelas_id: "",
  guru_id: "",
  mata_pelajaran_id: "",
  semester_id: "",
  periode_id: "",
  siswa_id: "",
  kehadiran: "",
  tugas: "",
  uts: "",
  uas: "",
  total: "",
  predikat: "",
});

useApi("siswa/all").then(({ data }) => {
  siswa.value = data;
});

useApi("master/mata-pelajaran/all").then(({ data }) => {
  filter_mata_pelajaran.value = data;
});

useApi("master/semester/all/1").then(({ data }) => {
  semester.value = data;
});

useApi("master/semester/all/0").then(({ data }) => {
  filter_semester.value = data;
});

useApi("master/kelas/all").then(({ data }) => {
  kelas.value = data;
});

useApi("master/periode/all/1").then(({ data }) => {
  periode.value = data;
});

useApi("master/periode/all/0").then(({ data }) => {
  filter_periode.value = data;
});

const role_id = ref();
const status_action = ref();

onMounted(() => {
  const { user } = useAuthStore();
  useApi(`level/nilai/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  });

  role_id.value = user.role_id;

  if (user.role_id == 1){
    status_action.value = true;
    useApi("master/guru/all").then(({ data }) => {
      guru.value = data;
    });
  } else if (user.role_id == 2){
    status_action.value = true;
    useApi("master/guru/all/" + user.id).then(({ data }) => {
      guru.value = data;
    });
  } else {
    status_action.value = false;
  }
});

const mata_pelajaran_id = ref<number | null>(null);
const guru_id = ref<number | null>(null);
const kelas_id = ref<number | null>(null);
const semester_id = ref<number | null>(null);
const periode_id = ref<number | null>(null);
const siswaByClass = ref([]);

const pagination = reactive({
  totalItem: 1,
  pageTotal: 1,
  page: 1,
});

const params = reactive({
  page: 1,
  limit: 10,
  search: "",
});

const singleDataForm = ref({
  kelas_id: "",
  guru_id: "",
  mata_pelajaran_id: "",
  semester_id: "",
  periode_id: "",
  siswa_id: "",
  kehadiran: "",
  tugas: "",
  uts: "",
  uas: "",
  total: "",
  predikat: "",
});

const headers = [
  { title: "Nama", key: "name", sortable: false },
  { title: "NISN", key: "nisn", sortable: false },
  { title: "Absensi", key: "kehadiran", sortable: false },
  { title: "Tugas", key: "tugas", sortable: false },
  { title: "UTS", key: "uts", sortable: false },
  { title: "UAS", key: "uas", sortable: false },
  { title: "Total", key: "total", sortable: false },
  { title: "Predikat", key: "predikat", sortable: false },
];



const getMataKuliahByClass = (guru_id: number) => {
  useApi("master/mata-pelajaran/all/" + guru_id).then(({ data }) => {
    mata_pelajaran.value = data;
  });
}


const getSiswaByClass = (classId) => {
  const getParams = {
    ...params,
    kelas_id: form.kelas_id || classId,
  };

  useApi(`siswa${objectToParams(getParams)}`).then(({ data }) => {
    console.log(data);
    pagination.pageTotal = data.pageTotal;
    pagination.page = Number.parseInt(data.currentPage);
    pagination.totalItem = data.total;
    siswaByClass.value = data.items.map((item) => {
      return {
        ...item,
        kelas_id: form.kelas_id,
        guru_id: form.guru_id,
        mata_pelajaran_id: form.mata_pelajaran_id,
        semester_id: form.semester_id,
        siswa_id: item.id,
        kehadiran: "0",
        tugas: "0",
        uts: "0",
        uas: "0",
        total: "0",
        predikat: "E",
      };
    });
  });
};

const getTotal = (item) => {
  if (!item) return 0;
  if (item.id == 1) console.log("getTotal", item);

  return (
    Math.round(
      (Number.parseInt(item.kehadiran || 0) +
        Number.parseInt(item.tugas || 0) +
        Number.parseInt(item.uts || 0) +
        Number.parseInt(item.uas || 0)) /
        4
    ) || 0
  );
};

const getPredikat = (item) => {
  const total = getTotal(item);
  if (total >= 85) return "A";
  if (total >= 75) return "B";
  if (total >= 69) return "C";
  if (total >= 59) return "D";

  return "E";
};

const handleInsertBulk = async () => {
  console.log("handleInsertBulk", siswaByClass.value);

  const data = siswaByClass.value.map((item) => {
    return {
      kelas_id: form.value.kelas_id,
      guru_id: form.value.guru_id,
      mata_pelajaran_id: form.value.mata_pelajaran_id,
      semester_id: form.value.semester_id,
      siswa_id: item.id,
      kehadiran: item.kehadiran,
      tugas: item.tugas,
      uts: item.uts,
      uas: item.uas,
      total: getTotal(item),
      predikat: getPredikat(item),
    };
  });

  const request = {
    data,
  };

  const url = "nilai/bulk-insert";

  const { errors, success } = await useApi(url, {
    withNotif: true,
    method: "POST",
    data: request,
  });

  if (success) {
    tableRef.value.refresh();
    bulkingDialog.value.hide();
  }
};

const isDataNotValid = computed(() => {
  return (
    !form.value.kelas_id || !form.value.guru_id || !form.value.mata_pelajaran_id
  );
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    width="1200"
    path="nilai"
    title="Tambah Nilai"
    edit-title="Edit Nilai"
    :request-form="singleDataForm"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="3">
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
        :readonly="isEditing"
      />
    </VCol>
    <VCol cols="12" md="3">
      <VAutocomplete
        v-model="formData.guru_id"
        label="Guru"
        density="compact"
        :error-messages="validationErrors.guru_id"
        placeholder="Pilih Guru"
        :items="guru"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :readonly="isEditing"
      />
    </VCol>
    <VCol cols="12" md="2">
      <VAutocomplete
        v-model="formData.mata_pelajaran_id"
        label="Mata Pelajaran"
        density="compact"
        :error-messages="validationErrors.mata_pelajaran_id"
        placeholder="Pilih Mata Pelajaran"
        :items="mata_pelajaran"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :readonly="isEditing"
      />
    </VCol>

    <VCol cols="12" md="2">
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
        :readonly="isEditing"
      />
    </VCol>

    <VCol cols="12" md="2">
      <VAutocomplete
        v-model="formData.periode_id"
        label="Tahun Ajar"
        density="compact"
        :error-messages="validationErrors.periode_id_id"
        placeholder="Pilih Tahun Ajar"
        :items="periode"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :readonly="isEditing"
      />
    </VCol>

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
        :readonly="isEditing"
      />
    </VCol>

    <VCol cols="12" md="2">
      <VTextField v-model="formData.kehadiran" label="Absensi" type="number" />
    </VCol>
    <VCol cols="12" md="2">
      <VTextField v-model="formData.tugas" label="Tugas" type="number" />
    </VCol>
    <VCol cols="12" md="2">
      <VTextField v-model="formData.uts" label="UTS" type="number" />
    </VCol>
    <VCol cols="12" md="2">
      <VTextField v-model="formData.uas" label="UAS" type="number" />
    </VCol>
    <VCol cols="12" md="2">
      <VTextField v-model="formData.total" label="Total" type="number" />
    </VCol>
    <VCol cols="12" md="2">
      <VTextField v-model="formData.predikat" label="Predikat" />
    </VCol>
  </SaveDialog>
  <SaveBulkDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="bulkingDialog"
    width="1200"
    path="nilai/bulk-insert"
    title="Tambah Data Nilai"
    edit-title="Edit Data Nilai"
    :default-form="form"
    :is-data-not-valid="isDataNotValid"
    @saved="
      () => {
        handleInsertBulk();
      }
    "
  >
    <VCol cols="12" md="3">
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
        @update:model-value="
          (kelas_id) => {
            getSiswaByClass(kelas_id);
            form.kelas_id = kelas_id;
          }
        "
      />
    </VCol>
    <VCol cols="12" md="3">
      <VAutocomplete
        v-model="formData.guru_id"
        label="Guru"
        density="compact"
        :error-messages="validationErrors.guru_id"
        placeholder="Pilih Guru"
        :items="guru"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        @update:model-value="
          (guru_id) => {
            form.guru_id = guru_id;
            getMataKuliahByClass(guru_id);
          }
        "
      />
    </VCol>
    <VCol cols="12" md="2">
      <VAutocomplete
        v-model="formData.mata_pelajaran_id"
        label="Mata Pelajaran"
        density="compact"
        :error-messages="validationErrors.mata_pelajaran_id"
        placeholder="Pilih Mata Pelajaran"
        :items="mata_pelajaran"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        @update:model-value="
          (mata_pelajaran_id) => {
            form.mata_pelajaran_id = mata_pelajaran_id;
          }
        "
      />
    </VCol>
    <VCol cols="12" md="2">
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
        @update:model-value="
          (semester_id) => {
            form.semester_id = semester_id;
          }
        "
      />
    </VCol>
    <VCol cols="12" md="2">
      <VAutocomplete
        v-model="formData.periode_id"
        label="Tahun Ajar"
        density="compact"
        :error-messages="validationErrors.periode_id"
        placeholder="Pilih Tahun Ajar"
        :items="periode"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        @update:model-value="
          (periode_id) => {
            form.periode_id = periode_id;
          }
        "
      />
    </VCol>
    <VCol cols="12" md="12">
      <VDataTable
        ref="siswaTableRef"
        :headers="headers"
        :items="siswaByClass"
        :items-per-page="10"
        :page-count="pagination.pageTotal"
        class="text-no-wrap"
      >
        <template #[`item.kehadiran`]="{ item }">
          <div class="my-3" style="inline-size: 80px">
            <VTextField
              v-model="item.kehadiran"
              density="compact"
              type="number"
            />
          </div>
        </template>
        <template #[`item.tugas`]="{ item }">
          <div class="my-3" style="inline-size: 80px">
            <VTextField v-model="item.tugas" density="compact" type="number" />
          </div>
        </template>
        <template #[`item.uts`]="{ item }">
          <div class="my-3" style="inline-size: 80px">
            <VTextField v-model="item.uts" density="compact" type="number" />
          </div>
        </template>
        <template #[`item.uas`]="{ item }">
          <div class="my-3" style="inline-size: 80px">
            <VTextField v-model="item.uas" density="compact" type="number" />
          </div>
        </template>
        <template #[`item.total`]="{ item }">
          <div class="my-3" style="inline-size: 80px">
            <VTextField
              :model-value="getTotal(item)"
              density="compact"
              readonly
            />
          </div>
        </template>
        <template #[`item.predikat`]="{ item }">
          <div class="my-3">
            <VTextField
              :model-value="getPredikat(item)"
              density="compact"
              readonly
            />
          </div>
        </template>
        <template #bottom>
          <VDivider />
          <div
            v-if="siswaByClass.length > 0"
            class="d-flex justify-end flex-wrap gap-x-6 px-2 py-1"
          >
            <div
              class="d-flex align-center gap-x-2 text-medium-emphasis text-base"
            >
              Total Data: <b>{{ pagination.totalItem }}</b>
            </div>
            <div class="d-flex gap-x-2 align-center me-2">
              <VBtn
                class="flip-in-rtl"
                icon="ri-arrow-left-s-line"
                variant="text"
                density="comfortable"
                color="high-emphasis"
                :readonly="pagination.page === 1"
                @click="goToPreviousPage"
              />
              Halaman: <b>{{ pagination.page }}</b>
              <VBtn
                class="flip-in-rtl"
                icon="ri-arrow-right-s-line"
                density="comfortable"
                variant="text"
                color="high-emphasis"
                :readonly="pagination.page === pagination.totalPages"
                @click="goToNextPage"
              />
            </div>
          </div>
        </template>
      </VDataTable>
    </VCol>
  </SaveBulkDialog>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow align="center" class="d-flex flex-wrap gap-2">
            <!-- Action Buttons -->
            <VCol cols="auto">
              <div class="d-flex gap-2">
                <VBtn
                  v-if="role_id == 1 || role_id == 2"
                  color="primary"
                  @click="() => {
                    bulkingDialog.show();
                    siswaByClass = [];
                  }"
                >
                  <VIcon end icon="ri-add-fill" />
                  Tambah Nilai
                </VBtn>
                <ExportFileExcel path="nilai/export-excel" />
              </div>
            </VCol>

            <!-- Filter Fields -->
            <VCol>
              <VRow>
                <VCol cols="12" sm="6" md="2">
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
                <VCol cols="12" sm="6" md="3">
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
                <VCol cols="12" sm="6" md="3">
                  <VAutocomplete
                    v-model="mata_pelajaran_id"
                    label="Mata Pelajaran"
                    density="compact"
                    placeholder="Pilih Mata Pelajaran"
                    :items="filter_mata_pelajaran"
                    item-title="text"
                    item-value="id"
                    required
                    clearable
                    clear-icon="ri-close-line"
                  />
                </VCol>
                <VCol cols="12" sm="6" md="2">
                  <VAutocomplete
                    v-model="semester_id"
                    label="Semester"
                    density="compact"
                    placeholder="Pilih Semester"
                    :items="filter_semester"
                    item-title="text"
                    item-value="id"
                    required
                    clearable
                    clear-icon="ri-close-line"
                  />
                </VCol>
                <VCol cols="12" sm="6" md="2">
                  <VAutocomplete
                    v-model="periode_id"
                    label="Tahun Ajar"
                    density="compact"
                    placeholder="Pilih Tahun Ajar"
                    :items="filter_periode"
                    item-title="text"
                    item-value="id"
                    required
                    clearable
                    clear-icon="ri-close-line"
                  />
                </VCol>
              </VRow>
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
        :with-actions="status_action"
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
            title: 'Guru',
            key: 'guru_name',
            sortable: false,
          },
          {
            title: 'Mata Pelajaran',
            key: 'mata_pelajaran_name',
            sortable: false,
          },
          {
            title: 'NISN',
            key: 'siswa_nisn',
            sortable: false,
          },
          {
            title: 'Nama',
            key: 'siswa_name',
            sortable: false,
          },
          {
            title: 'Semester',
            key: 'semester_name',
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
              v-if="role_id == 1 || role_id == 2"
              size="small"
              @click="dialogSave.show({ ...item })"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              v-if="role_id == 1 || role_id == 2"
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Nilai',
                  message: `Anda yakin ingin menghapus Nilai ${
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
