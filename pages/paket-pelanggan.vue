<script setup lang="ts">
import { VCardItem, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const cabangs = ref();
const packages = ref();
const anggotas = ref();
const cabangList = ref([]);

const qty_quota = ref();
const duration = ref();
const total_price = ref();

const contentData = ref([]);

const pagination = reactive({
  page: 1,
  itemsPerPage: 10,
  totalPages: 0,
  totalItem: 0,
});

const params = reactive({
  itemsPerPage: 10,
  limit: 10,
  page: 1,
  search: "",
  cabang_id: 0,
});

const headers = [
  {
    title: "Nama Pelanggan",
    key: "anggota_name",
    sortable: false,
  },
  {
    title: "Paket",
    key: "package_name",
    sortable: false,
  },
  {
    title: "Kuota",
    key: "qty_quota",
    sortable: false,
  },
  {
    title: "Digunakan",
    key: "qty_use",
    sortable: false,
  },
  {
    title: "Tanggal Order",
    key: "date_order",
    sortable: false,
  },
  {
    title: "Tanggal Selesai",
    key: "date_finish",
    sortable: false,
  },
  {
    title: "Cabang",
    key: "cabang_name",
    sortable: false,
  },
  { title: "Actions", key: "actions", sortable: false },
];

const historyHeaders = ref([
  {
    title: "Tanggal",
    key: "date_history",
    sortable: false,
  },
  {
    title: "Catatan",
    key: "note",
    sortable: false,
  },
]);

const fetchData = async (params) => {
  const baseUrl = `/package-anggota${objectToParams(params)}`;

  useApi(baseUrl).then(({ data }) => {
    if (data) {
      pagination.totalPages = data.pageTotal;
      pagination.page = Number.parseInt(data.currentPage);
      pagination.totalItem = data.total;
      contentData.value = data.items;
    }
  });
};

const handleDelete = async (item) => {
  const { success } = await useApi(`/package-anggota/${item.id}`, {
    withNotif: true,
    method: "DELETE",
  });

  if (success) fetchData(params);
};

const goToNextPage = () => {
  if (pagination.page < pagination.totalPages) {
    pagination.page = pagination.page + 1;
    params.page = pagination.page;

    fetchData(params);
  }
};

const goToPreviousPage = () => {
  if (pagination.page > 1) {
    pagination.page = pagination.page - 1;
    params.page = pagination.page;

    fetchData(params);
  }
};

const form = ref({
  date_order: "",
  date_finish: "",
  total_price: 0,
  payment: 0,
  cabang_id: undefined,
  package_id: undefined,
  anggota_id: undefined,
  status: 1,
});

const selectedCabang = ref(null);

const history = ref([]);

const getCabangList = () => {
  useApi("/cabang/all").then(({ data }) => {
    cabangList.value = data;
  });
};

watch([selectedCabang], ([selectedCabangParams]) => {
  params.cabang_id = selectedCabangParams;
  fetchData(params);
});

onMounted(() => {
  getCabangList();

  useApi("package/all").then(({ data }) => {
    packages.value = data;
  });

  useApi("anggota/list-data").then(({ data }) => {
    anggotas.value = data;
  });
  fetchData(params);
});

const changePackage = (id: number) => {
  dataPackage(id);
};

const dataPackage = async (id: number) => {
  const { data } = await useApi(`package/${id}`);

  // Update form values dengan data yang diambil dari API
  qty_quota.value = data.package_data.qty;
  duration.value = data.package_data.duration;
  total_price.value = data.package_data.price;

  // Update nilai total_price di form
  form.value.total_price = data.price;
};
</script>

<template>
  <ServicePackageDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors }"
    ref="dialogSave"
    path="package-anggota"
    title="Tambah Paket Pelanggan"
    edit-title="Edit Paket Pelanggan"
    :default-form="form"
    :refresh-callback="() => fetchData(params)"
    width="1000"
  >
    <VCol cols="4">
      <VTextField
        v-model="formData.date_order"
        type="date"
        :error-messages="validationErrors.date_order"
        label="Tanggal Order"
        :disabled="formData.showHistory"
      />
    </VCol>
    <VCol cols="4">
      <VAutocomplete
        v-model="formData.cabang_id"
        label="Cabang"
        :error-messages="validationErrors.cabang_id"
        placeholder="Pilih Cabang"
        :items="cabangList"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :disabled="formData.showHistory"
      />
    </VCol>

    <VCol cols="4">
      <VAutocomplete
        v-model="formData.package_id"
        label="Paket"
        :error-messages="validationErrors.package_id"
        placeholder="Pilih Paket"
        :items="packages"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :disabled="formData.showHistory"
        @update:model-value="changePackage"
      />
    </VCol>
    <VCol cols="6">
      <VAutocomplete
        v-model="formData.anggota_id"
        label="Pelanggan"
        :error-messages="validationErrors.anggota_id"
        placeholder="Pilih Pelanggan"
        :items="anggotas"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :disabled="formData.showHistory"
      />
    </VCol>

    <VCol cols="3">
      <VTextField v-model="qty_quota" disabled label="Kuota" />
    </VCol>

    <VCol cols="3">
      <VTextField v-model="duration" disabled label="Durasi (Hari)" />
    </VCol>

    <VCol cols="6">
      <VTextField v-model="total_price" disabled label="Total Harga" />
    </VCol>

    <VCol cols="6">
      <VTextField
        v-model="formData.payment"
        :error-messages="validationErrors.payment"
        label="Total Pembayaran"
        :disabled="formData.showHistory"
      />
    </VCol>

    <VCol v-if="formData.showHistory" cols="6">
      <VTextField v-model="formData.date_history" type="date" label="Tanggal" />
    </VCol>

    <VCol v-if="formData.showHistory" cols="6">
      <VTextField v-model="formData.note" label="Catatan" />
    </VCol>

    <VCol v-if="history.length > 0 && formData.showHistory" cols="12">
      <VDivider />
      <VRow>
        <h4 class="mb-4 mt-8 mx-2">Histori Paket Pelanggan</h4>
        <!-- Data Table -->
        <VDataTable
          v-model:page="pagination.page"
          :headers="historyHeaders"
          :items="history"
          :items-per-page="pagination.itemsPerPage"
          :page-count="pagination.totalPages"
          class="text-no-wrap"
        >
          <template #[`item.note`]="{ item }">
            <div class="d-flex gap-1">
              {{ item.note || "-" }}
            </div>
          </template>

          <!-- Pagination -->
          <!--
            <template #bottom>
            <VDivider />
            <div class="d-flex justify-end flex-wrap gap-x-6 px-2 py-1">
            <div
            class="d-flex align-center gap-x-2 text-medium-emphasis text-base"
            >
            Total Data: <b>{{ pagination.totalItem }}</b> - Baris /
            Halaman:
            <VSelect
            v-model="pagination.itemsPerPage"
            class="per-page-select"
            variant="plain"
            :items="[10, 20, 25, 50, 100]"
            />
            </div>
            <div class="d-flex gap-x-2 align-center me-2">
            <VBtn
            class="flip-in-rtl"
            icon="ri-arrow-left-s-line"
            variant="text"
            density="comfortable"
            color="high-emphasis"
            @click="goToPreviousPage"
            />
            Halaman: <b>{{ pagination.page }}</b>
            <VBtn
            class="flip-in-rtl"
            icon="ri-arrow-right-s-line"
            density="comfortable"
            variant="text"
            color="high-emphasis"
            @click="goToNextPage"
            />
            </div>
            </div>
            </template>
          -->
        </VDataTable>
      </VRow>
    </VCol>
  </ServicePackageDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow class="mt-n1">
            <VCol cols="6" class="d-flex align-center">
              <VBtn color="primary" @click="dialogSave.show()">
                <VIcon end icon="ri-add-fill" />
                Tambah Data
              </VBtn>
            </VCol>
            <VCol cols="3">
              <VAutocomplete
                v-model="selectedCabang"
                label="Cabang"
                placeholder="Pilih Cabang"
                :items="cabangList"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="3">
              <VTextField
                v-model="search"
                label="Search"
                placeholder="Search ..."
                append-inner-icon="ri-search-line"
                single-line
                hide-details
                dense
                outlined
              />
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VDataTable
        ref="tableRef"
        v-model:page="pagination.page"
        :headers="headers"
        :items="contentData"
        :items-per-page="pagination.itemsPerPage"
        :page-count="pagination.totalPages"
        class="text-no-wrap"
      >
        <template #[`item.gender`]="{ item }">
          <div class="d-flex gap-1">
            {{ item.gender === "M" ? "L" : "P" }}
          </div>
        </template>
        <template #[`item.cabang_name`]="{ item }">
          <div class="d-flex gap-1">
            {{ item.cabang_name || "-" }}
          </div>
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="d-flex gap-1">
            <IconBtn
              size="small"
              :disabled="item.qty_quota === item.qty_use"
              @click="
                async () => {
                  const { data } = await useApi(`package-anggota/${item.id}`);

                  history = data.packageAnggotaHistory_data;

                  const updateForm = {
                    ...item,
                    showHistory: true,
                    date_history: null,
                    notes: '',
                  };
                  qty_quota = item.qty_quota;
                  duration = item.qty_use;
                  total_price = item.total_price;
                  dialogSave.show(updateForm, true);
                }
              "
            >
              <VIcon icon="ri-calendar-check-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                () => {
                  const updateForm = {
                    ...item,
                  };
                  qty_quota = item.qty_quota;
                  duration = item.qty_use;
                  total_price = item.total_price;
                  dialogSave.show(updateForm);
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Paket Pelanggan',
                  message: `Anda yakin ingin menghapus paket dari ${item.anggota_name}?`,
                  onConfirm: () => handleDelete(item),
                })
              "
            >
              <VIcon icon="ri-delete-bin-line" />
            </IconBtn>
          </div>
        </template>

        <!-- Pagination -->
        <template #bottom>
          <VDivider />
          <div class="d-flex justify-end flex-wrap gap-x-6 px-2 py-1">
            <div
              class="d-flex align-center gap-x-2 text-medium-emphasis text-base"
            >
              Total Data: <b>{{ pagination.totalItem }}</b> - Baris / Halaman:
              <VSelect
                v-model="pagination.itemsPerPage"
                class="per-page-select"
                variant="plain"
                :items="[10, 20, 25, 50, 100]"
              />
            </div>
            <div class="d-flex gap-x-2 align-center me-2">
              <VBtn
                class="flip-in-rtl"
                icon="ri-arrow-left-s-line"
                variant="text"
                color="high-emphasis"
                @click="goToPreviousPage"
              />
              Halaman: <b>{{ pagination.page }}</b>
              <VBtn
                class="flip-in-rtl"
                icon="ri-arrow-right-s-line"
                variant="text"
                color="high-emphasis"
                @click="goToNextPage"
              />
            </div>
          </div>
        </template>
      </VDataTable>
    </VCol>
  </VRow>
</template>
