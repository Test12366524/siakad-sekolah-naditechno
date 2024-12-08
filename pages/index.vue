<script setup lang="ts">
const dashboardData = ref<any>(
  Array.from({ length: 8 }).fill({
    title: "",
    value: "",
    icon: "ri-wallet-line",
  })
);

const mappingData = (dataObject, icon = "ri-wallet-line") => {
  const titleMapping = {
    pengeluaran: "Total Pengeluaran",
    pemasukan: "Total Pemasukan",
    omset: "Total Penjualan Jasa & Produk",
    pengadaan: "Total Pengadaan Barang",
    order: "Total Order",
    anggota: "Total Pelanggan",
    dokter: "Total Dokter",
    reservation: "Total Reservasi",
  };

  const iconMapping = {
    pengeluaran: "ri-inbox-unarchive-fill",
    pemasukan: "ri-inbox-archive-fill",
    omset: "ri-exchange-dollar-line",
    pengadaan: "ri-archive-line",
    order: "ri-bank-card-line",
    anggota: "ri-group-line",
    dokter: "ri-user-heart-line",
    reservation: "ri-user-follow-line",
  };

  const rupiahFormatValue = {
    pengeluaran: "Rp",
    pemasukan: "Rp",
    omset: "Rp",
    pengadaan: "Rp",
  };

  return Object.keys(dataObject).map((key) => ({
    title: titleMapping[key] || key,
    value: rupiahFormatValue[key]
      ? rupiahFormater(dataObject[key])
      : dataObject[key],
    icon: iconMapping[key] || icon,
  }));
};

const fetchingData = () => {
  useApi("/dashboard").then(({ data }) => {
    dashboardData.value = mappingData(data);
  });
};

onMounted(() => {
  fetchingData();
});
</script>

<template>
  <VRow class="match-height">
    <VCol
      v-for="item in dashboardData"
      :key="`dashboard${item.title}`"
      cols="12"
      md="3"
      sm="6"
    >
      <div>
        <VCard
          class="logistics-card-statistics cursor-pointer"
          style="border-block-end-color: rgb(var(--v-theme-info))"
        >
          <VCardText>
            <div class="d-flex align-center gap-x-4 mb-2">
              <VAvatar variant="tonal" :color="card_color" rounded="lg">
                <VIcon :icon="item.icon" size="24" />
              </VAvatar>
              <h4 class="text-h4">
                {{ item.value !== null ? item.value : "Loading..." }}
              </h4>
            </div>
            <div class="text-body-1 text-high-emphasis">
              {{ item.title }}
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart";
@use "@core/scss/base/mixins" as mixins;

.text-body-1.text-error {
  display: none !important;
}

.illustrator-img img {
  inline-size: 90%;
}

.logistics-card-statistics {
  border-block-end-style: solid;
  border-block-end-width: 2px;
}
</style>
