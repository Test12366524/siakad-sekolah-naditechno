<script setup lang="ts">
const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

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
  gender_id: 0,
  cabang_id: 0,
});

const contentData = ref([]);
const selectedCabang = ref(null);
const selectedGender = ref(null);
const cabangs = ref([]);

const headers = [
  {
    title: "id pelanggan",
    key: "code",
    sortable: false,
  },
  {
    title: "nama pelanggan",
    key: "name",
    sortable: false,
  },
  {
    title: "no. whatsapp",
    key: "phone_number_1",
    sortable: false,
  },
  {
    title: "l/p",
    key: "gender",
    sortable: false,
  },
  { title: "Actions", key: "actions", sortable: false },
];

const fetchData = async (params) => {
  const baseUrl = `/anggota${objectToParams(params)}`;

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

const goToPreviousPage = () => {
  if (pagination.page > 1) {
    pagination.page = pagination.page - 1;
    params.page = pagination.page;

    fetchData(params);
  }
};

const deletePelanggan = async (item) => {
  const { success } = await useApi(`/anggota/${item.id}`, {
    withNotif: true,
    method: "DELETE",
  });

  if (success) fetchData(params);
};

const genders = ref([
  { id: 1, text: "Laki-laki" },
  { id: 2, text: "Perempuan" },
]);

const search = ref("");
watchDebounced(
  search,
  (value) => {
    params.search = value;

    fetchData(params);
  },
  { debounce: 500, maxWait: 1000 }
);

watch(
  [selectedCabang, selectedGender],
  ([selectedCabangNewValue, selectedGenderNewValue]) => {
    params.cabang_id = selectedCabangNewValue || 0;
    params.gender_id = selectedGenderNewValue || 0;
    fetchData(params);
  }
);

onMounted(() => {
  fetchData(params);
  useApi("cabang/all").then(({ data }) => {
    cabangs.value = data;
  });
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol cols="2">
              <NuxtLink to="/pelanggan/create">
                <VBtn color="primary">
                  <VIcon end icon="ri-add-fill" />
                  Tambah Data
                </VBtn>
              </NuxtLink>
            </VCol>
            <VCol cols="3">
              <VAutocomplete
                v-model="selectedCabang"
                label="Cabang"
                placeholder="Pilih Cabang"
                :items="cabangs"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="2">
              <VAutocomplete
                v-model="selectedGender"
                label="Gender"
                placeholder="Pilih Gender"
                :items="genders"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="5" md="5" class="">
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
              @click="
                () => {
                  navigateTo(`/pelanggan/detail/${item.id}`);
                }
              "
            >
              <VIcon icon="ri-eye-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                () => {
                  navigateTo(`/pelanggan/edit/${item.id}`);
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Pelanggan',
                  message: `Anda yakin ingin menghapus pelanggan ${
                    (item as any).name
                  }?`,
                  onConfirm: () => deletePelanggan(item),
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
