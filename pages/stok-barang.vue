<script setup lang="ts">
import { useRuntimeConfig } from "#app"; // Import useRuntimeConfig
import { onMounted, reactive, ref, watch } from "vue";
import { VRow } from "vuetify/lib/components/index.mjs";

const config = useRuntimeConfig();

// State for edit and delete confirmation dialogs
const contentData = ref([]);
const listGudang = ref([]);
const listRak = ref([]);
const cabangList = ref([]);
const selectedGudang = ref(null);
const selectedRak = ref(null);
const selectedCabang = ref(null);
const stockHistoryDialog = ref(null);

const search = ref("");

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
  gudang_id: 0,
  rak_id: 0,
  cabang_id: 0,
});

// Headers for the table Produk, Saldo, Cabang, Gudang, Rak sama action
const headers = [
  { title: "Produk", key: "product_name", sortable: false },
  { title: "Saldo", key: "saldo", sortable: false },
  { title: "Cabang", key: "cabang_name", sortable: false },
  { title: "Gudang", key: "gudang_name", sortable: false },
  { title: "Rak", key: "rak_name", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

// Function to fetch data from the API
const fetchData = async (params) => {
  const baseUrl = `/stok${objectToParams(params)}`;

  useApi(baseUrl).then(({ data }) => {
    if (data) {
      pagination.totalPages = data.pageTotal;
      pagination.page = Number.parseInt(data.currentPage);
      pagination.totalItem = data.total;
      contentData.value = data.items;
    }
  });
};

watchDebounced(
  search,
  (value) => {
    params.search = value;

    fetchData(params);
  },
  { debounce: 500, maxWait: 1000 }
);

watch(
  [selectedGudang, selectedRak, selectedCabang],
  ([selectedGudangNewParams, selectedRakNewParams, selectedCabangParams]) => {
    const getGudangId =
      listGudang.value.find((gudang) => {
        return gudang.text == selectedGudangNewParams;
      })?.id || 0;

    const getRakId =
      listRak.value.find((rak) => {
        return rak.text == selectedRakNewParams;
      })?.id || 0;

    const getCategoryId =
      cabangList.value.find((cabang) => {
        return cabang.text === selectedCabangParams;
      })?.id || 0;

    params.gudang_id = getGudangId;
    params.rak_id = getRakId;
    params.cabang_id = getCategoryId;

    fetchData(params);
  }
);

const getListGudang = () => {
  useApi("/gudang/all").then(({ data }) => {
    listGudang.value = data;
  });
};

const getListRak = () => {
  useApi("/rak/all/0").then(({ data }) => {
    listRak.value = data;
  });
};

const getCabangList = () => {
  useApi("/cabang/all").then(({ data }) => {
    cabangList.value = data;
  });
};

// Fetch data when the component is mounted
onMounted(async () => {
  getListGudang();
  getListRak();
  getCabangList();
  fetchData(params);
});

// Pagination functions
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
</script>

<template>
  <StockHistoryDialog ref="stockHistoryDialog" />
  >
  <VRow>
    <VRow style="margin-block-end: 10px">
      <VCol cols="12" md="12" sm="12">
        <div>
          <VCard class="logistics-card-statistics cursor-pointer">
            <VCardText>
              <VRow>
                <VCol cols="12" sm="4" md="4">
                  <VAutocomplete
                    v-model="selectedGudang"
                    label="Gudang"
                    placeholder="Filter by Gudang"
                    :items="listGudang"
                    item-title="text"
                    item-value="value"
                    clearable
                    clear-icon="ri-close-line"
                  />
                </VCol>
                <VCol cols="12" sm="4" md="4">
                  <VAutocomplete
                    v-model="selectedRak"
                    label="Rak"
                    placeholder="Filter by Rak"
                    :items="listRak"
                    item-title="text"
                    item-value="value"
                    clearable
                    clear-icon="ri-close-line"
                  />
                </VCol>
                <VCol cols="12" sm="4" md="4">
                  <VAutocomplete
                    v-model="selectedCabang"
                    label="Cabang"
                    placeholder="Filter by Cabang"
                    :items="cabangList"
                    item-title="text"
                    item-value="value"
                    clearable
                    clear-icon="ri-close-line"
                  />
                </VCol>
                <VCol cols="12" offset-md="6" md="12" class="ms-md-auto">
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
            </VCardText>
          </VCard>
        </div>
      </VCol>
    </VRow>
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
            @click="() => stockHistoryDialog.show(item.id)"
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
  </VRow>
</template>

<style lang="scss" scoped>
@use "@core/scss/base/mixins" as mixins;

.logistics-card-statistics {
  border-block-end-style: solid;
  border-block-end-width: 2px;
}
</style>
