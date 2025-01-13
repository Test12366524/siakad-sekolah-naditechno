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
  guru_id?: string | number | null;
  mata_pelajaran_id?: string | number | null;
  periode_id?: string | number | null;
  semester_id?: string | number | null;
  notulen_kegiatan_id?: string | number | null;
  jadwal_upacara_id?: string | number | null;
  showSelect?: boolean;
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
  mata_pelajaran_id: props.mata_pelajaran_id,
  guru_id: props.guru_id,
  semester_id: props.semester_id,
  periode_id: props.periode_id,
  notulen_kegiatan_id: props.notulen_kegiatan_id,
  jadwal_upacara_id: props.jadwal_upacara_id,
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
  () => props.guru_id,
  (newValue) => {
    appTable.guru_id.value = newValue;
    appTable.fetchItems(true);
  },
  { immediate: true }
);

watch(
  () => props.mata_pelajaran_id,
  (newValue) => {
    appTable.mata_pelajaran_id.value = newValue;
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

watch(
  () => props.notulen_kegiatan_id,
  (newValue) => {
    appTable.notulen_kegiatan_id.value = newValue;
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
      :show-select="props.showSelect"
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
      <template #item.date="{ item }">
        {{ formatFullDate(item.date)?.dateOnly }}
      </template>
      <template #item.jadwal_upacara_date="{ item }">
        {{ formatFullDate(item.jadwal_upacara_date)?.dateOnly }}
      </template>
      <template #item.created_at="{ item }">
        {{ formatFullDate(item.created_at)?.dateOnly }}
      </template>
      <template #item.updated_at="{ item }">
        {{ formatFullDate(item.updated_at)?.dateOnly }}
      </template>
      <template #item.until_date="{ item }">
        {{ formatFullDate(item.until_date)?.dateOnly }}
      </template>
      <template #item.nominal="{ item }">
        {{ formatRupiah(item.nominal) }}
      </template>
      <template #item.waktu="{ item }">
        {{ item.hari_desc }} , {{ item.dari_jam.substring(0, 5) }} -
        {{ item.ke_jam.substring(0, 5) }}
      </template>
      <template #item.biaya="{ item }">
        {{ formatRupiah(item.biaya) }}
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
