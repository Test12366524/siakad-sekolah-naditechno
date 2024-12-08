<script setup lang="ts">
import { watch } from 'vue';
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
  dosen_id: props.dosen_id
});

// Watch for changes in prop and update the internal kelas_id
watch(() => props.kelas_id, (newValue) => {
  appTable.kelas_id.value = newValue ?? '';
  if(newValue != null){
    appTable.fetchItems(true);
  }
}, { immediate: true });


watch(() => props.gender, (newValue) => {
  appTable.gender.value = newValue ?? '';
  if(newValue != null){
    appTable.fetchItems(true);
  }
}, { immediate: true });

watch(() => props.dosen_id, (newValue) => {
  appTable.dosen_id.value = newValue ?? '';
  if(newValue != null){
    appTable.fetchItems(true);
  }
}, { immediate: true });

watch(() => props.mata_kuliah_id, (newValue) => {
  appTable.mata_kuliah_id.value = newValue ?? '';
  if(newValue != null){
    appTable.fetchItems(true);
  }
}, { immediate: true });

defineExpose({
  refresh: () => appTable.fetchItems(true)
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
          ></VTextField>
        </VCol>
      </VRow>
    </VCardItem>

    <VDataTableServer
      fixed-header
      width="100%"
      :items-length="appTable.total.value"
      :items="appTable.items.value"
      v-model:page="appTable.currentPage.value"
      v-model:items-per-page="appTable.limit.value"
      v-model:kelas_id="appTable.kelas_id.value"
      :search="appTable.search.value"
      :loading="appTable.loading.value"
      loading-text="loading..."
      @update:options="() => appTable.fetchItems()"
      :headers="[
        ...(headers as any),
        withActions ? {
              title: 'actions',
              key: 'actions',
              sortable: false,
              width: 10,
            } : {},
      ] ?? []"
    >
      <template #item.nominal="{ item }">
        {{ formatRupiah(item.nominal) }}
      </template>
      <template #item.actions="{ item }">
        <slot name="actions" :item="item" :remove="appTable.removeRowBy"></slot>
      </template>
    </VDataTableServer>
  </VCard>
</template>
