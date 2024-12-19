<script setup lang="ts">
import type { TransactionType, UserType } from "@/types";
import male from "@images/cards/illustration-1.png";
import female from "@images/cards/illustration-2.png";

const tableRef = ref();
const selectedUser = ref<UserType | null>(null);
const userList = ref<UserType[]>([]);
const paymentHistories = ref<TransactionType[]>([]);

const pagination = reactive({
  page: 1,
  itemsPerPage: 10,
  totalPages: 0,
  totalItems: 0,
});

const objParams = reactive({ page: 1, limit: 10, search: "" });
const keyword = ref("");
const isLoading = ref(false);

const header = [
  {
    title: "Tanggal",
    key: "created_at",
    sortable: false,
  },
  {
    title: "Deskripsi",
    key: "description",
    sortable: false,
  },
  {
    title: "Nominal",
    key: "nominal",
    sortable: false,
  },
  {
    title: "Source",
    key: "source",
    sortable: false,
  },
];

useDebounce(keyword, (value) => {
  objParams.search = value;
  fetchHistories(selectedUser.value.id, objParams);
  fetchSaldo(selectedUser.value.id);
});

watch(selectedUser, (newValue) => {
  if (newValue) {
    keyword.value = "";
    objParams.page = 1;
    objParams.search = "";
    fetchHistories(selectedUser.value.id, objParams);
    fetchSaldo(selectedUser.value.id);
  }
});

const fetchListUser = async () => {
  try {
    const response = await useApi("/user/all");
    const data = response.data;

    userList.value = [
      ...data.map((user: any) => ({
        text: `${user.name}`,
        value: user,
      })),
    ];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const fetchHistories = async (userId) => {
  isLoading.value = true;
  try {
    const response = await useApi(
      `/saldo-history/history-anggota/${userId}`
    );
    
    console.log(response);
    const data = response.data;
    paymentHistories.value = data.items;
    pagination.totalPages = data.pageTotal;
    pagination.totalItems = data.total;
    pagination.page = Number.parseInt(data.currentPage);
    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
    isLoading.value = false;
  }
};

const saldoData = ref([]);
const fetchSaldo = async (userId) => {
  isLoading.value = true;
  try {
    const response = await useApi(
      `/saldo-anggota-simpanan/user/${userId}`
    );
    
    const data = response.data;
    saldoData.value = data;
    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
    isLoading.value = false;
  }
};

const goToNextPage = () => {
  objParams.page = objParams.page + 1;
  fetchHistories(selectedUser.value.id, objParams);
};

const goToPreviousPage = () => {
  objParams.page = objParams.page - 1;
  fetchHistories(selectedUser.value.id, objParams);
};

const card_color = 'info';
const card_icon = 'ri-money-dollar-box-line';

onMounted(() => {
  fetchListUser();
});
</script>

<template>
  <VRow>
    <VCol cols="6">
      <VCard>
        <VCardItem>
          <VCol cols="12">
            <h2 class="mb-2">Histori Transaksi Anggota</h2>
            <VAutocomplete
              v-model="selectedUser"
              label="Anggota"
              placeholder="Pilih Anggota"
              :items="userList"
              item-title="text"
              item-value="value"
              required
            />
          </VCol>
        </VCardItem>
      </VCard>
    </VCol>
    <VCol v-if="selectedUser" cols="6">
      <VCard class="position-relative logistics-card-statistics py-2">
        <VCardText>
          <VRow style="margin-bottom: -52px;">
            <VCol v-if="selectedUser" cols="6">
              <h2 class="mb-2">SIAKAD PKU</h2>
              <div
                class="d-flex align-center flex-wrap justify-content-between"
              >
                <h4 class="me-2" style="margin-top: 20px;">
                  {{ selectedUser.code }} - {{ selectedUser.name }}
                </h4>
              </div>
              <p class="h6">
                {{ selectedUser.email || "-" }}
              </p>
            </VCol>
            <VCol v-if="selectedUser" cols="6">
              <div v-if="selectedUser.gender === 'M'" class="float-right">
                <img :src="male" />
              </div>
              <div v-else class="float-right">
                <img :src="female" />
              </div>
            </VCol>
          </VRow>
        </VCardText>

        <VSpacer />
      </VCard>
    </VCol>
  </VRow>

  <VRow>
    <VCol
      v-for="item in saldoData"
      :key="item.id"
      cols="12"
      md="3"
      sm="6"
    >
      <div>
        <VCard
          class="logistics-card-statistics cursor-pointer"
          :style="`border-block-end-color: rgb(var(--v-theme-${card_color}))`"
        >
          <VCardText>
            <div class="d-flex align-center gap-x-4 mb-2">
              <VAvatar
                variant="tonal"
                :color="card_color"
                rounded="lg"
              >
                <VIcon
                  :icon="card_icon"
                  size="24"
                />
              </VAvatar>
              <h4 class="text-h4">
                {{ formatRupiah(item.nominal) }}
              </h4>
            </div>
            <div class="text-body-1 text-high-emphasis">
              {{ item.master_deposit_name }}
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>
    <VCol cols="12" md="12" sm="12">
      <div v-if="selectedUser">
        <VCard class="cursor-pointer">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="keyword"
                  label="Search"
                  placeholder="Search..."
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

  <VRow>
    <VCol cols="12">
      <VDataTable
        :page="pagination.page"
        :headers="header"
        :items="paymentHistories"
        :items-per-page="pagination.itemsPerPage"
        :page-count="pagination.totalPages"
        :loading="isLoading"
        loading-text="Loading..."
        hover
        class="text-no-wrap"
        hide-default-footer
      >
        <template v-slot:[`item.nominal`]="{ item }">
          {{ formatRupiah(item.nominal) }}
        </template>
        <!-- Pagination -->
        <template #bottom>
          <VDivider />
          <div
            v-if="paymentHistories.length > 0"
            class="d-flex justify-end flex-wrap gap-x-6 px-2 py-1"
          >
            <div
              class="d-flex align-center gap-x-2 text-medium-emphasis text-base"
            >
              Total Data: <b>{{ pagination.totalItems }}</b> - Baris / Halaman:
              <VSelect
                v-model="pagination.itemsPerPage"
                class="per-page-select"
                variant="plain"
                :items="[5, 10, 20, 25, 50, 100]"
                @update:model-value="
                  (value) => {
                    objParams.page = 1;
                    objParams.limit = value;
                    fetchHistories(selectedUser.id, objParams);
                  }
                "
              />
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
  </VRow>
</template>
