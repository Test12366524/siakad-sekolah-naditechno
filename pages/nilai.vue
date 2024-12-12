<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const mahasiswa = ref();
const dosen = ref();
const semester = ref();
const mata_kuliah = ref();
const kelas = ref();
const bulkingDialog = ref();
const mahasiswaTableRef = ref();



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

useApi("master/semester/all").then(({ data }) => {
  semester.value = data;
});

useApi("master/kelas/all").then(({ data }) => {
  kelas.value = data;
});

useApi("master/mata-kuliah/all").then(({ data }) => {
  mata_kuliah.value = data;
});

const role_id = ref();
const status_action = ref();
onMounted(() => {
  useApi("auth/me").then(({ data }) => {
    role_id.value = data.role_id;
    if(data.role_id == 1 || data.role_id == 2){
      status_action.value = true;
    }else{
      status_action.value = false;
    }
  });
});

const mata_kuliah_id = ref<number | null>(null);
const dosen_id = ref<number | null>(null);
const kelas_id = ref<number | null>(null);
const semester_id = ref<number | null>(null);
const mahasiswaByClass = ref([]);

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

const bulkData = ref([
  {
    kelas_id: "1",
    dosen_id: "1",
    mata_kuliah_id: "1",
    mahasiswa_id: "1",
    kehadiran: "10",
    tugas: "10",
    uts: "10",
    uas: "10",
    total: "30",
    predikat: "C",
  },
]);

const headers = [
  { title: "Nama", key: "name", sortable: false },
  { title: "NIM", key: "nim", sortable: false },
  { title: "Absensi", key: "kehadiran", sortable: false },
  { title: "Tugas", key: "tugas", sortable: false },
  { title: "UTS", key: "uts", sortable: false },
  { title: "UAS", key: "uas", sortable: false },
  { title: "Total", key: "total", sortable: false },
  { title: "Predikat", key: "predikat", sortable: false },
];

const getMahasiswaByClass = (classId) => {
  const getParams = {
    ...params,
    kelas_id: form.kelas_id || classId,
  };

  useApi(`mahasiswa${objectToParams(getParams)}`).then(({ data }) => {
    console.log(data);
    pagination.pageTotal = data.pageTotal;
    pagination.page = Number.parseInt(data.currentPage);
    pagination.totalItem = data.total;
    mahasiswaByClass.value = data.items;
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
  console.log("handleInsertBulk", mahasiswaByClass.value);

  const data = mahasiswaByClass.value.map((item) => {
    return {
      kelas_id: form.kelas_id,
      dosen_id: form.dosen_id,
      mata_kuliah_id: form.mata_kuliah_id,
      mahasiswa_id: item.id,
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

  console.log("request", request);

  const { errors, success } = await useApi(url, {
    withNotif: true,
    method: "POST",
    data: request,
  });

  if (success) tableRef.value.refresh();
};
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isDetail }"
    ref="dialogSave"
    width="1200"
    path="nilai"
    title="Tambah Nilai"
    edit-title="Edit Nilai"
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
        :disabled="isDetail"
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
        :disabled="isDetail"
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
        :disabled="isDetail"
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
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.kehadiran"
        label="Absensi"
        type="number"
        :disabled="isDetail"
      />
    </VCol>
    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.tugas"
        label="Tugas"
        type="number"
        :disabled="isDetail"
      />
    </VCol>
    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.uts"
        label="UTS"
        type="number"
        :disabled="isDetail"
      />
    </VCol>
    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.uas"
        label="UAS"
        type="number"
        :disabled="isDetail"
      />
    </VCol>
    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.total"
        label="Total"
        type="number"
        :disabled="isDetail"
      />
    </VCol>
    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.predikat"
        label="Predikat"
        :disabled="isDetail"
      />
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
    @saved="
      () => {
        handleInsertBulk();
      }
    "
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
        @update:model-value="
          (kelas_id) => {
            getMahasiswaByClass(kelas_id);
            form.kelas_id = kelas_id;
          }
        "
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
        @update:model-value="
          (dosen_id) => {
            form.dosen_id = dosen_id;
          }
        "
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
        @update:model-value="
          (mata_kuliah_id) => {
            form.mata_kuliah_id = mata_kuliah_id;
          }
        "
      />
    </VCol>
    <VCol cols="12" md="12">
      <VDataTable
        ref="mahasiswaTableRef"
        :headers="headers"
        :items="mahasiswaByClass"
        :items-per-page="10"
        :page-count="pagination.pageTotal"
        class="text-no-wrap"
      >
        <template #[`item.kehadiran`]="{ item }">
          <div class="my-3" style="inline-size: 80px">
            <VTextField
              v-model="item.kehadiran"
              label="Absensi"
              density="compact"
              type="number"
            />
          </div>
        </template>
        <template #[`item.tugas`]="{ item }">
          <div class="my-3" style="inline-size: 80px">
            <VTextField
              v-model="item.tugas"
              label="Tugas"
              density="compact"
              type="number"
            />
          </div>
        </template>
        <template #[`item.uts`]="{ item }">
          <div class="my-3" style="inline-size: 80px">
            <VTextField
              v-model="item.uts"
              label="UTS"
              density="compact"
              type="number"
            />
          </div>
        </template>
        <template #[`item.uas`]="{ item }">
          <div class="my-3" style="inline-size: 80px">
            <VTextField
              v-model="item.uas"
              label="UAS"
              density="compact"
              type="number"
            />
          </div>
        </template>
        <template #[`item.total`]="{ item }">
          <div class="my-3" style="inline-size: 80px">
            <VTextField
              :model-value="getTotal(item)"
              label="Total"
              density="compact"
              disabled
            />
          </div>
        </template>
        <template #[`item.predikat`]="{ item }">
          <div class="my-3">
            <VTextField
              :model-value="getPredikat(item)"
              label="Predikat"
              density="compact"
              disabled
            />
          </div>
        </template>
        <template #bottom>
          <VDivider />
          <div
            v-if="mahasiswaByClass.length > 0"
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
                :disabled="pagination.page === 1"
                @click="goToPreviousPage"
              />
              Halaman: <b>{{ pagination.page }}</b>
              <VBtn
                class="flip-in-rtl"
                icon="ri-arrow-right-s-line"
                density="comfortable"
                variant="text"
                color="high-emphasis"
                :disabled="pagination.page === pagination.totalPages"
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
          <VRow>
            <VCol cols="12" md="4" class="d-flex gap-4" style="margin-top: 5px;">
              <VBtn v-if="role_id == 1 || role_id == 2" color="primary" @click="dialogSave.show()">
                <VIcon end icon="ri-add-fill" />
                Nilai Single
              </VBtn>
              <VBtn v-if="role_id == 1 || role_id == 2" color="primary" @click="bulkingDialog.show()">
                <VIcon end icon="ri-add-fill" />
                Nilai Multiple
              </VBtn>
            </VCol>
            <VCol cols="12" md="2" style="margin-block-start: 5px">
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
            <VCol cols="12" md="2" style="margin-block-start: 5px">
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
            <VCol cols="12" md="2" style="margin-block-start: 5px">
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
            <VCol cols="12" md="2" style="margin-block-start: 5px">
              <VAutocomplete
                v-model="semester_id"
                label="Semester"
                density="compact"
                placeholder="Pilih Semester"
                :items="semester"
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
        :with-actions="status_action"
        :kelas_id="kelas_id"
        :dosen_id="dosen_id"
        :mata_kuliah_id="mata_kuliah_id"
        :semester_id="semester_id"
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
            <IconBtn v-if="role_id == 1 || role_id == 2" size="small" @click="dialogSave.show({ ...item })">
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
