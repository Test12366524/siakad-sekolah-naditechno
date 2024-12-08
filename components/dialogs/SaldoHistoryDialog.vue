<script lang="ts" setup>

const props = defineProps({
  path: String,
  title: String,
  editTitle: String,
  refreshCallback: Function,
  defaultForm: Object,
  width: null || Number,
  itemKey: null || String,
  customButtonText: null || String,
  formOrder: null || Array,
});

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
  type: 1,
  bank_id: 0,
});

const data = [
  {
    id: 1,
    saldo_id: 1,
    user_id: 1,
    type: 1,
    reference_id: 1,
    nominal: 1000010,
    source: "pemasukan",
    created_at: null,
    updated_at: null,
    description: "sample pemasukan",
    status: 1,
    cabang_id: 1,
    bank_id: 1,
    bank_name: "PT. SIAKAD Kampus",
    cabang_name: "Yogyakarta",
    status_desc: "AKTIF",
  },
];

const headers = [
  { title: "Cabang", key: "cabang_name", sortable: false },
  { title: "Bank", key: "bank_name", sortable: false },
  { title: "Saldo", key: "nominal", sortable: false },
  { title: "Sumber", key: "source", sortable: false },
  { title: "Deskripsi", key: "description", sortable: false },
];

const modalTitle = ref(props.title);
const isEditing = ref(false);
const isShow = ref(false);
const contentData = ref([]);

const formData = ref({ ...props.defaultForm });

const fetchingData = async (params) => {
  const baseUrl = `/saldo-history${objectToParams(params)}`;

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

    fetchingData(params);
  }
};

const goToPreviousPage = () => {
  if (pagination.page > 1) {
    pagination.page = pagination.page - 1;
    params.page = pagination.page;

    fetchingData(params);
  }
};

defineExpose({
  show(stockItem = any) {
    isShow.value = true;

    const updatedParams = {
      ...params,
      cabang_id: stockItem.cabang_id,
      type: stockItem.type_id,
      bank_id: stockItem.bank_id,
    };

    fetchingData(updatedParams);
  },
});
</script>

<template>
  <VDialog v-model="isShow" scrollable location="top center" :width="900">
    <!-- Dialog Content -->
    <VCard>
      <VCardItem class="pb-3">
        <VCardTitle>Histori Stok</VCardTitle>
      </VCardItem>

      <DialogCloseBtn variant="text" size="default" @click="isShow = false" />

      <VDivider />

      <VCardText class="py-6">
        <VRow>
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
          </VDataTable>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>
