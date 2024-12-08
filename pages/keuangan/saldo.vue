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
  { title: "Cabang", key: "cabang_name", sortable: false },
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
    bank_name: "PT. SIAKAD Kampus",
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
    <!--
      <VCol v-for="item in saldos" :key="item.id" cols="12" md="3" sm="6">
      <div>
      <VCard
      class="logistics-card-statistics cursor-pointer"
      :style="`border-block-end-color: rgb(var(--v-theme-${card_color}))`"
      >
      <VCardText>
      <div class="d-flex align-center gap-x-4 mb-2">
      <VAvatar variant="tonal" :color="card_color" rounded="lg">
      <VIcon :icon="card_icon" size="24" />
      </VAvatar>
      <h4 class="text-h4">
      {{ formatRupiah(item.saldo_nominal) }}
      </h4>
      </div>
      <div class="text-body-1 text-high-emphasis">
      Saldo {{ item.text }}
      </div>
      </VCardText>
      </VCard>
      </div>
      </VCol>
    -->
    <VCol cols="12" md="12" sm="12">
      <div>
        <VCard class="logistics-card-statistics cursor-pointer">
          <VCardText>
            <VRow>
              <!--
                <VCol cols="3">
                <VAutocomplete
                v-model="selectedBank"
                label="Bank"
                placeholder="Select Bank"
                :items="bankList"
                item-title="text"
                item-value="value"
                variant="outlined"
                clearable
                clear-icon="ri-close-line"
                />
                </VCol>
                <VCol cols="3">
                <VSelect
                v-model="selectedType"
                :items="typeList"
                item-title="text"
                item-value="value"
                label="Type"
                variant="outlined"
                clearable
                clear-icon="ri-close-line"
                />
                </VCol>
              -->
              <VCol cols="3">
                <VAutocomplete
                  v-model="selectedCabang"
                  label="Cabang"
                  placeholder="Pilih Cabang"
                  :items="cabangList"
                  item-title="text"
                  item-value="value"
                  clearable
                  clear-icon="ri-close-line"
                  required
                />
              </VCol>

              <!--
                <VCol cols="3">
                <AppDateTimePicker
                v-model="filter_range"
                label="Range"
                placeholder="Select date"
                :config="{ mode: 'range' }"
                />
                </VCol>
              -->
            </VRow>
          </VCardText>
        </VCard>
      </div>
    </VCol>
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
