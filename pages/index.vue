<script setup lang="ts">
const dashboardData = ref<any>(
  Array.from({ length: 8 }).fill({
    title: "",
    value: "",
    icon: "ri-wallet-line",
  })
);

const siswaData = ref<any>(
  Array.from({ length: 8 }).fill({
    title: "",
    value: "",
    icon: "ri-wallet-line",
  })
);

const guruData = ref<any>(
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
    siswa_total: "Total Siswa",
    guru_total: "Total Guru",
  };

  const iconMapping = {
    pmb_total: "ri-user-add-line",
    pmb_paid: "ri-currency-line",
    siswa_total: "ri-user-follow-fill",
    guru_total: "ri-user-star-line",
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

const mappingDataSiswa = (dataObject, icon = "ri-wallet-line") => {
  const titleMapping = {
    total_lms_start: "Total LMS",
    total_lms_not_done: "LMS Yang Belum Dikerjakan",
    total_hadir: "Total Hadir",
    total_izin: "Total Izin",
    total_sakit: "Total Sakit",
    total_alpa: "Total Alpa",
  };

  const iconMapping = {
    total_lms_start: "ri-user-add-line",
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

const role_id = ref(0);
const isTeacher = computed(() => role_id.value === 2);
const waliKelasData = ref(null);

const mappingDataGuru = (dataObject, icon = "ri-wallet-line") => {
  const titleMapping = {
    total_lms: "Total LMS",
    total_lms_not_graded: "Total LMS Belum Dinilai",
    total_mata_pelajaran: "Total Mata Pelajaran",
    total_silabus: "Total Silabus",
  };

  const iconMapping = {
    total_lms: "ri-user-add-line",
    total_lms_not_graded: "ri-currency-line",
    total_mata_pelajaran: "ri-user-follow-fill",
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

const fetchingDataSiswa = () => {
  useApi("/dashboard/siswa").then(({ data }) => {
    siswaData.value = mappingDataSiswa(data);
  });
};

const fetchingDataGuru = () => {
  useApi("/dashboard/guru").then(({ data }) => {
    guruData.value = mappingDataGuru(data);
  });
};

const userStore = useUserStore();

const checkWaliKelasData = (id) => {
  useApi(`/master/kelas/wali-kelas/${id}`).then(({ data }) => {
    waliKelasData.value = data;
    userStore.setWaliKelasData(data);
  });
};

const { user } = useAuthStore();

onMounted(() => {
  useApi("auth/me").then(({ data }) => {
    role_id.value = data.role_id;
    if (data.role_id === 1) {
      fetchingData();
    } else if (data.role_id === 3) {
      fetchingDataSiswa();
    } else if (data.role_id === 2) {
      fetchingDataGuru();
      checkWaliKelasData(user.id);
    }
  });
});
const openUrl = () => {
  window.open('https://apps.tunaskasihschool.sch.id/', '_blank');
}
</script>

<template>
  <VRow>
    <VCol v-if="waliKelasData" cols="12">
      <DashboardWaliKelas />
    </VCol>
    <VCol v-if="role_id == 1 || role_id == 4 || role_id == 3 || role_id == 5" cols="12">
      <VBtn
        color="primary"
        @click="openUrl"
      >
        <VIcon end icon="ri-add-fill" />
        Link Pembayaran SPP
      </VBtn>
    </VCol>
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
          v-for="item in siswaData"
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
          v-for="item in guruData"
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
