<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { VCol, VRow } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();
const route = useRoute();

const dialogSave = ref();
const tableRef = ref();
const filter_range = ref();
const val_role_id = ref();


onMounted(async () => {
  let dataUser = await useApi("/user/detailUser");
  val_role_id.value = dataUser.data.user.role_id;

  // Refresh table with initial values based on URL parameters
  tableRef.value.refresh({
    range: filter_range.value,
  });
});

watch([filter_range], ([newRangeFilter]) => {
  // Refresh AppTable with selected filters
  tableRef.value.refresh({
    range: newRangeFilter,
  });
});

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

</script>

<template>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol cols="12" md="6" sm="6">
              <AppDateTimePicker
              v-model="filter_range"
              label="Range"
              placeholder="Select date"
              :config="{ mode: 'range' }"
              clearable
              clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="12" md="6" sm="6">
              <div class="d-flex gap-3 items-center justify-end" style="margin-top: 5px;">
                <ExportFileExcel
                  :path="`saldo-history/export_excel?range=${filter_range}`"
                ></ExportFileExcel>
              </div>
            </VCol>

          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Laporan Arus Kas"
        path="saldo-history"
        :with-actions="false"
        :headers="[
          {
            title: 'Tanggal',
            key: 'created_at',
            sortable: false,
          },
          {
            title: 'Keterangan',
            key: 'saldo_history_description',
            sortable: false,
          },
          {
            title: 'Debit',
            key: 'debit',
            sortable: false,
          },
          {
            title: 'Kredit',
            key: 'kredit',
            sortable: false,
          },
          {
            title: 'Saldo',
            key: 'saldo_history_saldo_akhir',
            sortable: false,
          },
        ]"
      >
        <template #[`item.debit`]="{ item }">
          {{ formatRupiah(item.debit) }}
        </template>
        <template #[`item.kredit`]="{ item }">
          {{ formatRupiah(item.kredit) }}
        </template>
      </AppTable>
    </VCol>
  </VRow>
</template>
