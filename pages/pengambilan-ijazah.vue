<script setup lang="ts">
import { VTextField } from 'vuetify/lib/components/index.mjs';

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const bulkingDialog = ref();
const tableRef = ref();
const siswaTableRef = ref();
const siswaByClass = ref([]);
const selectedSiswas = ref([]);
const kelas_id = ref();

const form = {
  siswa_id: "",
};

const formUpdate = {
  tanggal: "",
  status: "",
};

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

const goToPreviousPage = () => {
  if (pagination.page > 1) {
    params.page = params.page - 1;
    getSiswaByClass();
  }
};

const goToNextPage = () => {
  if (pagination.page < pagination.pageTotal) {
    params.page = params.page + 1;
    getSiswaByClass();
  }
};

const semesterToId = ref<number | null>(null);
const periodeToId = ref<number | null>(null);
const kelasFromId = ref<number | null>(null);
const kelasToId = ref<number | null>(null);
const periodeList = ref([]);
const semesterList = ref([]);
const kelasId = ref<number | null>(null);
const kelasList = ref([]);

const isDataNotValid = computed(
  () =>
    !kelasFromId.value ||
    selectedSiswas.value.length === 0
);

const headers = [
  { title: "Nama", key: "name", sortable: false },
  { title: "NISN", key: "nisn", sortable: false },
  { title: "Kelas", key: "kelas_name", sortable: false },
  { title: "Periode saat ini", key: "periode_name", sortable: false },
  { title: "Semester saat ini", key: "semester_name", sortable: false },
];

const handleInsertData = async (siswaId: any) => {
  const url = `siswa/naik-kelas/${siswaId}`;

  const payload = {
    kelas_id: kelasToId.value,
    periode_id: periodeToId.value,
    semester_id: semesterToId.value,
  };

  const { errors, success } = await useApi(url, {
    withNotif: true,
    method: "PUT",
    data: payload,
  });

  if (success) {
    tableRef.value.refresh();
    bulkingDialog.value.hide();
  }
};

const handleInsertBulk = async () => {
  const payload = siswaByClass.value
    .filter((siswa) => selectedSiswas.value.includes(siswa.id))
    .map((item: any) => {
      return {
        siswa_id: item.id
      };
    });
 
  const request = {
    data: payload,
  };

  const url = "pengambilan-ijazah";

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

const getSiswaByClass = (selectedClassId: any) => {
  const getParams = {
    ...params,
    kelas_id: kelasId.value || selectedClassId,
  };

  useApi(`siswa${objectToParams(getParams)}`).then(({ data }) => {
    pagination.pageTotal = data.pageTotal;
    pagination.page = Number.parseInt(data.currentPage);
    pagination.totalItem = data.total;
    siswaByClass.value = data.items;
  });
};

const fetchRequirementDatas = () => {
  useApi("master/kelas/all").then(({ data }) => {
    kelasList.value = data;
  });
};

onMounted(() => {
  const { user } = useAuthStore();
  useApi(`level/kenaikan-kelas/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  });
  fetchRequirementDatas();
});
</script>

<template>
  <SaveBulkDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="bulkingDialog"
    width="900"
    path="absensi/bulk-insert"
    title="Form Pengambilan Ijazah"
    edit-title="Form Pengambilan Ijazah"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    :is-data-not-valid="isDataNotValid"
    @saved="
      () => {
        handleInsertBulk();
      }
    "
    @save-single="
      (siswaId) => {
        handleInsertData(siswaId);
      }
    "
  >
    <VCol cols="12" md="12">
      <VAutocomplete
        v-model="formData.kelas_from_id"
        label="Kelas"
        density="compact"
        placeholder="Pilih Kelas"
        :items="kelasList"
        item-title="text"
        item-value="id"
        required
        :clearable="!isEditing"
        clear-icon="ri-close-line"
        :readonly="isEditing"
        @update:model-value="
          (kelas_id) => {
            kelasFromId = kelas_id;
            getSiswaByClass(kelas_id);
          }
        "
      />
    </VCol>
    <VCol cols="12" md="12">
      <VDataTable
        ref="siswaTableRef"
        v-model="selectedSiswas"
        :headers="headers"
        :items="siswaByClass"
        :items-per-page="pagination.itemsPerPage"
        :page-count="pagination.pageTotal"
        class="text-no-wrap"
        show-select
      >
        <template #bottom>
          <VDivider />
          <div
            v-if="siswaByClass.length > 0"
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

  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="pengambilan-ijazah"
    title="Tambah Pengambilan Ijazah"
    edit-title="Pengambilan Ijazah"
    :default-form="formUpdate"
    :request-form="formUpdate"
    :refresh-callback="tableRef.refresh"
    action-btn-text="Submit"
    width="600"
  >
    <VCol cols="12">
      <VTextField
        v-model="formData.siswa_name"
        label="Siswa"
        readonly
      />
    </VCol>
    <VCol cols="12">
      <VTextField
        type="date"
        v-model="formData.tanggal"
        :error-messages="validationErrors.tanggal"
        label="Tanggal"
      />
    </VCol>

    <VCol cols="12" md="12">
      <VLabel>Status</VLabel>
      <VRadioGroup
        v-model="formData.status"
        inline
        :error-messages="validationErrors.status"
      >
        <VRadio label="Belum" value="0" />
        <VRadio label="Sudah" value="1" />
      </VRadioGroup>
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow justify="space-between" align="center">
            <VCol cols="12" md="6" class="d-flex gap-4">
              <VBtn
                color="primary"
                @click="
                  () => {
                    bulkingDialog.show();
                    siswaByClass = [];
                  }
                "
              >
                <VIcon end icon="ri-add-fill" />
                Tambah Data Pengambilan Ijazah
              </VBtn>
            </VCol>

            <VCol cols="12" md="4" class="d-flex gap-4 justify-end mt-1">
              <VAutocomplete
                v-model="kelasId"
                label="Kelas"
                density="compact"
                placeholder="Pilih Kelas"
                class="w-1/2"
                :items="kelasList"
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
        title="Data Pengambilan Ijazah"
        path="pengambilan-ijazah"
        :with-actions="true"
        :kelas_id="kelasId"
        :headers="[
          {
            title: 'Nama',
            key: 'siswa_name',
            sortable: false,
          },
          {
            title: 'NISN',
            key: 'siswa_nisn',
            sortable: false,
          },
          {
            title: 'Semester',
            key: 'semester_name',
            sortable: false,
          },
          {
            title: 'Status',
            key: 'status_desc',
            sortable: false,
          },
          {
            title: 'Tanggal',
            key: 'tanggal',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              label="Edit"
              size="small"
              @click="
                () => {
                  const payload = { ...item };
                  payload.status = item.status.toString();
                  dialogSave.show(payload, false);
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              label="Hapus"
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Pengambilan Ijazah',
                  message: `Anda yakin ingin menghapus Pengambilan Ijazah ${
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
