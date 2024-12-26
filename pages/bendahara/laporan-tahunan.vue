<script setup lang="ts">
const selectedCabang = ref(null);
const selectedBank = ref(null);
const selectedType = ref();

const tableRef = ref();
const cabangList = ref([]);
const bankList = ref([]);
const contentData = ref([]);
const filter_range = ref();
const saldoHistoryDialog = ref(null);

const typeList = [
  { text: "Debit", id: 1 },
  { text: "Kredit", id: 2 },
];

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

  // gudang_id: 0,
  // type_id: 0,
  cabang_id: 0,
});

const saldos = ref();

// Headers for the table Produk, Saldo, Cabang, Gudang, Rak sama action
const headers = [
  { title: "Saldo", key: "nominal", sortable: false },
  { title: "Bank", key: "bank_name", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

const test = [
  {
    id: 1,
    nominal: 1000010,
    bank_id: 1,
    status: 1,
    cabang_id: 1,
    bank_name: "PT. Zam Zam Group",
    cabang_name: "Yogyakarta",
    status_desc: "AKTIF",
  },
];

const getCabangList = () => {
  useApi("/cabang/all").then(({ data }) => {
    cabangList.value = data;
  });
};

const getBanks = () => {
  useApi("/bank-mitra/all").then(({ data }) => {
    bankList.value = data;
  });
};

const fetchData = async (params) => {
  const baseUrl = `/saldo${objectToParams(params)}`;

  useApi(baseUrl).then(({ data }) => {
    if (data) {
      pagination.totalPages = data.pageTotal;
      pagination.page = Number.parseInt(data.currentPage);
      pagination.totalItem = data.total;
      contentData.value = data.items;
    }
  });
};

// Pagination functions
const goToNextPage = () => {
  if (pagination.page < pagination.totalPages) {
    pagination.page = pagination.page + 1;
    params.page = pagination.page;

    fetchData(params);
  }
};

watch([selectedCabang], ([selectedCabangParams]) => {
  const getCategoryId =
    cabangList.value.find((cabang) => {
      return cabang.text === selectedCabangParams;
    })?.id || 0;

  params.cabang_id = getCategoryId;

  fetchData(params);
});

const goToPreviousPage = () => {
  if (pagination.page > 1) {
    pagination.page = pagination.page - 1;
    params.page = pagination.page;

    fetchData(params);
  }
};

onMounted(() => {
  getCabangList();
  getBanks();

  // useApi("saldo/all-saldo").then(({ data }) => {
  //   saldos.value = data;
  // });
  fetchData(params);
});

const card_color = "info";
const card_icon = "ri-money-dollar-box-line";

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};
</script>

<template>
  <SaldoHistoryDialog ref="saldoHistoryDialog" />
  <VRow>
    <VCol cols="12">
      <!-- Data Table -->
      <VDataTable
        v-model:page="pagination.page"
        :headers="headers"
        :items="contentData"
        :items-per-page="pagination.itemsPerPage"
        :page-count="pagination.totalPages"
        class="text-no-wrap"
      >
        <template #[`item.cabang_name`]="{ item }">
          <div class="d-flex gap-1">
            {{ item.cabang_name || "-" }}
          </div>
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="d-flex gap-1">
            <div
              style="cursor: pointer"
              @click="() => saldoHistoryDialog.show(item)"
            >
              <VIcon icon="ri-file-list-3-line" /> History
            </div>
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
      </VDataTable>
    </VCol>
  </VRow>
</template>
