<script setup lang="ts">
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const selectedCabang = ref(null);
const selectedStatus = ref(null);
const serviceList = ref([]);
const cabangList = ref([]);

const headers = [
  {
    title: "Nama",
    key: "name",
    sortable: false,
  },
  {
    title: "No. WhatsApp",
    key: "phone_number",
    sortable: false,
  },
  {
    title: "Tanggal",
    key: "date_plan",
    sortable: false,
  },
  {
    title: "Cabang",
    key: "cabang_name",
    sortable: false,
  },
  {
    title: "Kategori Jasa",
    key: "category_service_name",
    sortable: false,
  },
  {
    title: "Status",
    key: "status_desc",
    sortable: false,
  },
  { title: "Actions", key: "actions", sortable: false },
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
  search: "",
  status: 0,
  cabang_id: 0,
});

const statusList = ref([
  {
    id: 1,
    text: "Belum",
  },
  {
    id: 2,
    text: "Selesai",
  },
  {
    id: 3,
    text: "Tidak Datang",
  },
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

const contentData = ref([]);

const form = ref({
  name: "",
  phone_number: "",
  date_plan: "",
  cabang_id: undefined,
  detail: [],
  status: 1,
});

const getCabangList = () => {
  useApi("/cabang/all").then(({ data }) => {
    cabangList.value = data;
  });
};

const getServiceList = () => {
  useApi("/category-service/all").then(({ data }) => {
    serviceList.value = data;
  });
};

watch(
  [selectedCabang, selectedStatus],
  ([selectedCabangNewValue, selectedStatusNewValue]) => {
    params.cabang_id = selectedCabangNewValue || 0;
    params.status = selectedStatusNewValue || 0;
    fetchData(params);
  }
);

const fetchData = async (params) => {
  const baseUrl = `/reservation${objectToParams(params)}`;

  useApi(baseUrl).then(({ data }) => {
    if (data) {
      pagination.totalPages = data.pageTotal;
      pagination.page = Number.parseInt(data.currentPage);
      pagination.totalItem = data.total;
      contentData.value = data.items;
    }
  });
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

const handleDelete = async (item) => {
  const { success } = await useApi(`/reservation/${item.id}`, {
    withNotif: true,
    method: "DELETE",
  });

  if (success) fetchData(params);
};

onMounted(() => {
  getServiceList();
  getCabangList();
  fetchData(params);
});
</script>

<template>
  <ReservationDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="reservation"
    title="Tambah Reservasi"
    edit-title="Edit Reservasi"
    :default-form="form"
    :refresh-callback="() => fetchData(params)"
    width="600"
  >
    <VCol cols="12">
      <VTextField
        v-model="formData.name"
        :error-messages="validationErrors.name"
        label="Nama"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        v-model="formData.phone_number"
        :error-messages="validationErrors.phone_number"
        label="No. Whatsapp"
        type="number"
      />
    </VCol>

    <VCol cols="6">
      <VTextField
        v-model="formData.date_plan"
        type="datetime-local"
        :error-messages="validationErrors.date_plan"
        label="Tanggal Reservasi"
      />
    </VCol>

    <VCol cols="6">
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
      />
    </VCol>

    <VCol cols="12">
      <VLabel>Jasa</VLabel>
      <VRow v-if="serviceList.length > 0">
        <VCol
          v-for="(item, index) in serviceList"
          :key="`${index}checkbox-treatment`"
          cols="4"
        >
          <VCheckbox
            v-model="formData.detail"
            :label="item.text"
            :value="item.id"
          />
        </VCol>
      </VRow>
      <VRow v-else>
        <p>Tidak ditemukan jasa di cabang tersebut</p>
      </VRow>
    </VCol>

    <VCol cols="12">
      <VLabel>Status</VLabel>
      <VRadioGroup
        v-model="formData.status"
        inline
        :error-messages="validationErrors.status"
      >
        <VRadio
          v-for="status in statusList"
          :key="status.id"
          :label="status.text"
          :value="status.id"
        />
      </VRadioGroup>
    </VCol>
  </ReservationDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow class="mt-n1">
            <VCol cols="2" class="d-flex align-center">
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
            <VCol cols="2">
              <VAutocomplete
                v-model="selectedStatus"
                label="Status"
                placeholder="Pilih Status"
                :items="statusList"
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
              @click="
                () => {
                  const updateForm = {
                    id: item.id,
                    name: item.name,
                    phone_number: item.phone_number,
                    date_plan: item.date_plan,
                    cabang_id: item.cabang_id,
                    detail: item.category_service_id.split(',').map(Number),
                    status: item.status,
                  };
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
                  title: 'Hapus Reservasi',
                  message: `Anda yakin ingin menghapus reservasi ${
                    (item as any).name
                  }?`,
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
