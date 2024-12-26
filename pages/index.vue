<script setup lang="ts">
const dashboardData = ref<any>(
  Array.from({ length: 8 }).fill({
    title: "",
    value: "",
    icon: "ri-wallet-line",
  })
);

const mahasiswaData = ref<any>(
  Array.from({ length: 8 }).fill({
    title: "",
    value: "",
    icon: "ri-wallet-line",
  })
);

const dosenData = ref<any>(
  Array.from({ length: 8 }).fill({
    title: "",
    value: "",
    icon: "ri-wallet-line",
  })
);

const mappingData = (dataObject, icon = "ri-wallet-line") => {
  const titleMapping = {
    pmb_total: "Total PMB",
    pmb_paid: "Total Pembayaran PMB",
    mahasiswa_total: "Total Mahasiswa",
    dosen_total: "Total Dosen",
  };

  const iconMapping = {
    pmb_total: "ri-user-add-line",
    pmb_paid: "ri-currency-line",
    mahasiswa_total: "ri-user-follow-fill",
    dosen_total: "ri-user-star-line",
  };

  const rupiahFormatValue = {
    pmb_paid: "Rp",
  };

  return Object.keys(dataObject).map((key) => ({
    title: titleMapping[key] || key,
    value: rupiahFormatValue[key]
      ? rupiahFormater(dataObject[key])
      : dataObject[key],
    icon: iconMapping[key] || icon,
  }));
};

const mappingDataMahasiswa = (dataObject, icon = "ri-wallet-line") => {
  const titleMapping = {
    total_lms_not_done: "LMS Yang Belum Dikerjakan",
    total_hadir: "Total Pembayaran PMB",
    total_izin: "Total Mahasiswa",
    total_sakit: "Total Dosen",
    total_alpa: "Total Dosen",
  };

  const iconMapping = {
    total_lms_not_done: "ri-user-add-line",
    total_hadir: "ri-currency-line",
    total_izin: "ri-user-follow-fill",
    total_sakit: "ri-user-star-line",
    total_alpa: "ri-user-star-line",
  };

  const rupiahFormatValue = {
    pmb_paid: "Rp",
  };

  return Object.keys(dataObject).map((key) => ({
    title: titleMapping[key] || key,
    value: rupiahFormatValue[key]
      ? rupiahFormater(dataObject[key])
      : dataObject[key],
    icon: iconMapping[key] || icon,
  }));
};

const mappingDataDosen = (dataObject, icon = "ri-wallet-line") => {
  const titleMapping = {
    total_lms: "Total LMS",
    total_lms_not_graded: "Total LMS Belum Dinilai",
    total_mata_kuliah: "Total Mata Kuliah",
    total_silabus: "Total Silabus",
  };

  const iconMapping = {
    total_lms: "ri-user-add-line",
    total_lms_not_graded: "ri-currency-line",
    total_mata_kuliah: "ri-user-follow-fill",
    total_silabus: "ri-user-star-line",
  };

  const rupiahFormatValue = {
    pmb_paid: "Rp",
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

const fetchingDataMahasiswa = () => {
  useApi("/dashboard/mahasiswa").then(({ data }) => {
    mahasiswaData.value = mappingDataMahasiswa(data);
  });
};

const fetchingDataDosen = () => {
  useApi("/dashboard/dosen").then(({ data }) => {
    dosenData.value = mappingDataDosen(data);
  });
};

const role_id = ref(0);

onMounted(() => {
  useApi("auth/me").then(({ data }) => {
    role_id.value = data.role_id;
    if (data.role_id === 1) fetchingData();
    else if (data.role_id === 3) fetchingDataMahasiswa();
    else if (data.role_id === 2) fetchingDataDosen();
  });
});
</script>

<template>
  <VRow>
    <VCol cols="12" md="12">
      <DashboardAnnouncement />
    </VCol>
    <VCol cols="12" md="12">
      <VRow class="match-height">
        <VCol
          v-for="item in dashboardData"
          v-if="role_id == 1"
          :key="`dashboard${item.title}`"
          cols="12"
          md="6"
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
        <VCol
          v-for="item in mahasiswaData"
          v-if="role_id == 3"
          :key="`dashboard${item.title}`"
          cols="12"
          md="4"
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
        <VCol
          v-for="item in dosenData"
          v-if="role_id == 2"
          :key="`dashboard${item.title}`"
          cols="12"
          md="6"
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
    </VCol>
  </VRow>
  <VRow>
    <VCol v-if="role_id == 1 || role_id == 3" cols="12">
      <DashboardAttendanceChart />
    </VCol>
    <VCol v-if="role_id == 1" cols="12">
      <DashboardGenderChart />
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
