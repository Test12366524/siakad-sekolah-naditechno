<script setup lang="ts">
import { formatFullDate } from "@/composables/common";
import { watch } from "vue";
import { VDataTableServer } from "vuetify/lib/components/index.mjs";

const props = defineProps<{
  title: string;
  path: string;
  headers: Array<{
    title: string;
    key: string;
    sortable: boolean | null;
    width: number | null;
    rupiah?: boolean;
  }>;
  withActions: boolean | null;
  kelas_id?: string | number | null;
  gender?: string | number | null;
  dosen_id?: string | number | null;
  mata_kuliah_id?: string | number | null;
  periode_id?: string | number | null;
  semester_id?: string | number | null;
}>();

// Fungsi untuk format Rupiah
const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const appTable = useAppTable({
  path: props.path as string,
  kelas_id: props.kelas_id,
  gender: props.gender,
  mata_kuliah_id: props.mata_kuliah_id,
  dosen_id: props.dosen_id,
  semester_id: props.semester_id,
  periode_id: props.periode_id,
});

// Watch for changes in prop and update the internal kelas_id
watch(
  () => props.kelas_id,
  (newValue) => {
    if (props.kelas_id) {
      appTable.kelas_id.value = newValue;
      appTable.fetchItems(true);
    }
  },
  { immediate: true }
);

watch(
  () => props.gender,
  (newValue) => {
    appTable.gender.value = newValue;
    appTable.fetchItems(true);
  },
  { immediate: true }
);

watch(
  () => props.dosen_id,
  (newValue) => {
    appTable.dosen_id.value = newValue;
    appTable.fetchItems(true);
  },
  { immediate: true }
);

watch(
  () => props.mata_kuliah_id,
  (newValue) => {
    appTable.mata_kuliah_id.value = newValue;
    appTable.fetchItems(true);
  },
  { immediate: true }
);

watch(
  () => props.semester_id,
  (newValue) => {
    appTable.semester_id.value = newValue;
    appTable.fetchItems(true);
  },
  { immediate: true }
);

watch(
  () => props.periode_id,
  (newValue) => {
    appTable.periode_id.value = newValue;
    appTable.fetchItems(true);
  },
  { immediate: true }
);

defineExpose({
  refresh: () => appTable.fetchItems(true),
});
</script>

<template>
  <VCard>
    <VCardItem>
      <VRow align="center" justify="space-between">
        <VCol cols="12" md="8">
          <VCardTitle>{{ title }}</VCardTitle>
        </VCol>
        <VCol cols="12" md="4" class="d-flex align-center">
          <VTextField
            v-model="appTable.search.value"
            class="ma-2"
            density="compact"
            placeholder="Search..."
            hide-details
          />
        </VCol>
      </VRow>
    </VCardItem>

    <VDataTableServer
      v-model:page="appTable.currentPage.value"
      v-model:items-per-page="appTable.limit.value"
      v-model:kelas_id="appTable.kelas_id.value"
      fixed-header
      width="100%"
      :items-length="appTable.total.value"
      :items="appTable.items.value"
      :search="appTable.search.value"
      :loading="appTable.loading.value"
      loading-text="loading..."
      :headers="[
        ...(headers as any),
        withActions ? {
          title: 'actions',
          key: 'actions',
          sortable: false,
          width: 10,
        } : {},
      ] ?? []"
      @update:options="() => appTable.fetchItems()"
    >
      <template #item.join_date="{ item }">
        {{ formatFullDate(item.join_date)?.dateOnly }}
      </template>
      <template #item.tanggal="{ item }">
        {{ formatFullDate(item.tanggal)?.dateOnly }}
      </template>
      <template #item.publish_date="{ item }">
        {{ formatFullDate(item.publish_date)?.dateOnly }}
      </template>
      <template #item.borrow_date="{ item }">
        {{ formatFullDate(item.borrow_date)?.dateOnly }}
      </template>
      <template #item.return_date="{ item }">
        {{ formatFullDate(item.return_date)?.dateOnly }}
      </template>
      <template #item.from_date="{ item }">
        {{ formatFullDate(item.from_date)?.dateOnly }}
      </template>
      <template #item.to_date="{ item }">
        {{ formatFullDate(item.to_date)?.dateOnly }}
      </template>
      <template #item.start_date="{ item }">
        {{ formatFullDate(item.start_date)?.dateOnly }}
      </template>
      <template #item.until_date="{ item }">
        {{ formatFullDate(item.until_date)?.dateOnly }}
      </template>
      <template #item.nominal="{ item }">
        {{ formatRupiah(item.nominal) }}
      </template>
      <template #item.nilai="{ item }">
        {{ !item.nilai && item.nilai !== 0 ? "-" : item.nilai }}
      </template>
      <template #item.file="{ item }">
        <VBtn
          v-if="item.file"
          size="small"
          class="d-flex justify-center items-center my-2"
          @click="
            () => {
              openFileHandler(item.file);
            }
          "
        >
          <VIcon icon="ri-eye-line" class="mr-2" /> Buka File
        </VBtn>
        <p v-else>-</p>
      </template>
      <template #item.actions="{ item }">
        <slot name="actions" :item="item" :remove="appTable.removeRowBy" />
      </template>
    </VDataTableServer>
  </VCard>
</template>
