<script lang="ts" setup>
import type { VForm } from "vuetify/lib/components/index.mjs";

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

const headers = [
  { title: "Produk", key: "product_name", sortable: false },
  { title: "Qty", key: "qty", sortable: false },
  { title: "Deskripsi", key: "description", sortable: false },
  { title: "Stok", key: "last_stock", sortable: false },
];

const modalTitle = ref(props.title);
const isEditing = ref(false);
const isShow = ref(false);
const contentData = ref([]);

const formData = ref({ ...props.defaultForm });

const fetchingData = (stockId) => {
  useApi(`/stok-history/${stockId}`).then(({ data }) => {
    data.stokHistory && (contentData.value = data.stokHistory);
  });
};

defineExpose({
  show(stockId: number) {
    isShow.value = true;
    fetchingData(stockId);
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
          <VDataTable
            v-model:page="pagination.page"
            :headers="headers"
            :items="contentData"
            :items-per-page="pagination.itemsPerPage"
            :page-count="pagination.totalPages"
            class="text-no-wrap"
          />
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>
