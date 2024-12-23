<script setup lang="ts">
import { ref } from "vue";
import { VCol, VTextarea } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const bulkingDialog = ref();
const tableRef = ref();
const mahasiswaTableRef = ref();
const mahasiswa = ref();
const mahasiswaByClass = ref([]);
const jadwal_mata_kuliah = ref();
const kelas = ref();
const mata_kuliah = ref();
const dosen = ref();
const user_id = ref();

const form = ref({
  kelas_id: null,
  jadwal_id: "",
  pertemuan_ke: "",
  mahasiswa_id: "",
  kehadiran: "Hadir",
  description: "",
});

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
    kelas_id: 2,
    jadwal_id: 4,
    mahasiswa_id: 3,
    kehadiran: "Hadir", // Hadir, Izin, Sakit, Alpa
    pertemuan_ke: 5,
    description: "", // optional
  },
]);

const getMahasiswaByClass = (classId: number) => {
  const getParams = {
    ...params,
    kelas_id: form.value.kelas_id || classId,
  };

  useApi(`mahasiswa${objectToParams(getParams)}`).then(({ data }) => {
    pagination.pageTotal = data.pageTotal;
    pagination.page = Number.parseInt(data.currentPage);
    pagination.totalItem = data.total;
    mahasiswaByClass.value = data.items.map((item: any) => {
      return {
        ...item,
        kelas_id: form.value.kelas_id || classId,
        jadwal_id: form.value.jadwal_id,
        mahasiswa_id: item.id,
        kehadiran: "Hadir",
        pertemuan_ke: form.value.pertemuan_ke,
        description: "-",
      };
    });
    bulkData.value = data.items.map((item: any) => {
      return {
        kelas_id: form.value.kelas_id || classId,
        jadwal_id: form.value.jadwal_id,
        mahasiswa_id: item.id,
        kehadiran: 1,
        pertemuan_ke: form.value.pertemuan_ke,
        description: "-",
      };
    });
  });
};

const goToPreviousPage = () => {
  if (pagination.page > 1) {
    params.page = params.page - 1;
    getMahasiswaByClass();
  }
};

const goToNextPage = () => {
  if (pagination.page < pagination.pageTotal) {
    params.page = params.page + 1;
    getMahasiswaByClass();
  }
};

useApi("master/kelas/all").then(({ data }) => {
  kelas.value = data;
});

useApi("mahasiswa/all").then(({ data }) => {
  mahasiswa.value = data;
});

useApi("master/mata-kuliah/all").then(({ data }) => {
  mata_kuliah.value = data;
});

const role_id = ref();
const status_action = ref();

onMounted(() => {
  useApi("auth/me").then(({ data }) => {

    
    role_id.value = data.role_id;
    user_id.value = data.id;
    if (data.role_id == 1){
      status_action.value = true;
      useApi("master/dosen/all").then(({ data }) => {
        dosen.value = data;
      });
      useApi("jadwal-mata-kuliah/all").then(({ data }) => {
        jadwal_mata_kuliah.value = data;
      });
    } else if(data.role_id == 2){
      status_action.value = true;
      useApi("master/dosen/byUserID/" + user_id.value).then(({ data }) => {
        dosen.value = data;
        useApi("jadwal-mata-kuliah/all/" + data.id).then(({ data }) => {
          jadwal_mata_kuliah.value = data;
        });
      });
    } else {
      useApi("master/dosen/all").then(({ data }) => {
        dosen.value = data;
      });
      useApi("jadwal-mata-kuliah/all").then(({ data }) => {
        jadwal_mata_kuliah.value = data;
      });
      status_action.value = false;
    }

    useApi(`absensi/${data.role_id}`).then(({ data }) => {
      if(data == 0){
        navigateTo(`/not-authorized`);
      }
    });
    
  });
});



const mata_kuliah_id = ref<number | null>(null);
const dosen_id = ref<number | null>(null);
const kelas_id = ref<number | null>(null);

const headers = [
  { title: "Nama", key: "name", sortable: false },
  { title: "NIM", key: "nim", sortable: false },
  { title: "Keterangan", key: "keterangan", sortable: false, value: "-" },
  { title: "Kehadiran", key: "kehadiran", sortable: false, value: "Hadir" },
];

const handleInsertBulk = async () => {
  const payload = mahasiswaByClass.value.map((item) => {
    return {
      kelas_id: Number(form.value.kelas_id),
      jadwal_id: form.value.jadwal_id,
      mahasiswa_id: item.id,
      kehadiran: item.kehadiran,
      pertemuan_ke: form.value.pertemuan_ke,
      description: item.description,
    };
  });

  const request = {
    data: payload,
  };

  const url = "absensi/bulk-insert";

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

const handleShowBulkDialog = () => {
  form.value = {
    kelas_id: "",
    jadwal_id: "",
    pertemuan_ke: "",
    mahasiswa_id: "",
    kehadiran: "Hadir",
    description: "",
  };
  mahasiswaByClass.value = [];
  bulkingDialog.value.show();
};

const isDataNotValid = computed(() => {
  return (
    !form.value.kelas_id || !form.value.jadwal_id || !form.value.pertemuan_ke
  );
});
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isDetail }"
    ref="dialogSave"
    width="1200"
    path="absensi"
    title="Tambah Absensi"
    edit-title="Edit Absensi"
    detail-title="Detail Absensi"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    :width="900"
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
        :readonly="isDetail"
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
        :readonly="isDetail"
      />
    </VCol>
    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.pertemuan_ke"
        type="number"
        :error-messages="validationErrors.pertemuan_ke"
        label="Pertemuan Ke"
        density="compact"
        :readonly="isDetail"
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
        :readonly="isDetail"
      />
    </VCol>
    <VCol cols="12" md="12">
      <VLabel>Kehadiran</VLabel>
      <VRadioGroup
        v-model="formData.kehadiran"
        inline
        :error-messages="validationErrors.kehadiran"
        :readonly="isDetail"
      >
        <VRadio label="Hadir" value="Hadir" />
        <VRadio label="Izin" value="Izin" />
        <VRadio label="Sakit" value="Sakit" />
        <VRadio label="Alpa" value="Alpa" />
      </VRadioGroup>
    </VCol>
    <VCol cols="12" md="12">
      <VTextarea
        v-model="formData.description"
        :readonly="isDetail"
        label="Deskripsi"
      />
    </VCol>
  </SaveFileDialog>

  <SaveBulkDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="bulkingDialog"
    width="1200"
    path="absensi/bulk-insert"
    title="Tambah Data Absensi"
    edit-title="Edit Data Absensi"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    :width="900"
    :is-data-not-valid="isDataNotValid"
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
          (kelas_id: number) => {
            if (kelas_id) {
              getMahasiswaByClass(kelas_id);
            }
            else {
              mahasiswaByClass = [];
            }
            form.kelas_id = Number(kelas_id);
          }
        "
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
        @update:model-value="
          (jadwal_id) => {
            form.jadwal_id = jadwal_id;
          }
        "
      />
    </VCol>
    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.pertemuan_ke"
        type="number"
        :error-messages="validationErrors.pertemuan_ke"
        label="Pertemuan Ke"
        density="compact"
        @update:model-value="
          (pertemuan_ke) => {
            form.pertemuan_ke = pertemuan_ke;
          }
        "
      />
    </VCol>
    <VCol cols="12" md="12">
      <VDataTable
        ref="mahasiswaTableRef"
        :headers="headers"
        :items="mahasiswaByClass"
        :items-per-page="pagination.itemsPerPage"
        :page-count="pagination.pageTotal"
        class="text-no-wrap"
      >
        <template #[`item.keterangan`]="{ item }">
          <div class="my-3">
            <VTextField
              v-model="item.description"
              label="Keterangan"
              density="compact"
              :value="item.description || '-'"
              @update:model-value="(value) => {}"
            />
          </div>
        </template>
        <template #[`item.kehadiran`]="{ item }">
          <VAutocomplete
            v-model="item.kehadiran"
            label="Kehadiran"
            density="compact"
            placeholder="Pilih Kehadiran"
            :items="['Hadir', 'Izin', 'Sakit', 'Alpa']"
            required
            clearable
            clear-icon="ri-close-line"
            :value="item.kehadiran || 'Hadir'"
            @update:model-value="(value) => {}"
          />
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
              Total Data: <b>{{ pagination.totalItems }}</b>
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
            <VCol cols="12" md="6" class="d-flex gap-4">
              <!--
                <VBtn
                v-if="role_id == 1 || role_id == 2"
                color="primary"
                @click="dialogSave.show()"
                >
                <VIcon end icon="ri-add-fill" />
                Tambah Data Single
                </VBtn>
              -->
              <VBtn
                v-if="role_id == 1 || role_id == 2"
                color="primary"
                @click="handleShowBulkDialog"
              >
                <VIcon end icon="ri-add-fill" />
                Tambah Absensi
              </VBtn>
              <ExportFileExcel path="absensi/export-excel" />
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
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Absensi"
        path="absensi"
        :with-actions="status_action"
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
              v-if="role_id == 1 || role_id == 2"
              size="small"
              title="Detail"
              @click="
                () => {
                  const payload = { ...item };
                  dialogSave.show(payload, true);
                }
              "
            >
              <VIcon icon="ri-eye-line" />
            </IconBtn>
            <IconBtn size="small" @click="dialogSave.show({ ...item })">
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              v-if="role_id == 1 || role_id == 2"
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Absensi',
                  message: `Anda yakin ingin menghapus Absensi ${
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
