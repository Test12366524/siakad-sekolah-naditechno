<script setup lang="ts">
import { VCol, VTextField } from 'vuetify/lib/components/index.mjs';

const { confirmDialog } = useCommonStore()

const dialogSave = ref()
const tableRef = ref()

const kelas = ref();
const semester = ref();
const filter_semester = ref();
const periode = ref();
const filter_periode = ref();

const jurusans = ref();
const angkatans = ref();

const form = ref({
  user_id: undefined,
  angkatan_id: undefined,
  semester_id: undefined,
  periode_id: undefined,
  jurusan_id: undefined,
  kelas_id: undefined,
  name: "",
  photo: "",
  birth_date: "",
  place_of_birth: "",
  gender: "",
  religion: "",
  nik: "",
  entrance_date: "",
  email: "",
  phone_1: "",
  phone_2: "",
  address: "",
  created_at: "",
  updated_at: "",
  nisn: "",
  keterangan: "",
  status: "",
  nis_number: "",
  kip: "",
  kks: "",
  province_id: "",
  city_id: "",
  district_id: "",
  subdistrict_id: "",
  post_code: "",
  anak_ke: "",
  dari_jumlah_anak: "",
  status_dalam_keluarga: "",
  nama_ayah: "",
  nama_ibu: "",
  pekerjaan_ayah: "",
  pekerjaan_ibu: "",
  nik_ayah: "",
  nik_ibu: "",
  no_kk: "",
  asal_sekolah: "",
});

const religions = ref([
  { id: "Islam", text: "Islam" },
  { id: "Katolik", text: "Katolik" },
  { id: "Protestan", text: "Protestan" },
  { id: "Hindu", text: "Hindu" },
  { id: "Budha", text: "Budha" },
  { id: "Konghucu", text: "Konghucu" },
]);

const status_dalam_keluarga = ref([
  { id: "Anak Kandung", text: "Anak Kandung" },
  { id: "Anak Tiri", text: "Anak Tiri" },
  { id: "Anak Asuh", text: "Anak Asuh" },
]);

const genders = ref([
  { id: "L", text: "Laki-laki" },
  { id: "P", text: "Perempuan" },
]);

const kelas_id = ref<number | null>(null);
const semester_id = ref<number | null>(null);
const periode_id = ref<number | null>(null);
const gender = ref("");

useApi("master/kelas/all").then(({ data }) => {
  kelas.value = data;
});

useApi("master/semester/all/1").then(({ data }) => {
  semester.value = data;
});

useApi("master/semester/all/0").then(({ data }) => {
  filter_semester.value = data;
});

useApi("master/periode/all/1").then(({ data }) => {
  periode.value = data;
});

useApi("master/periode/all/0").then(({ data }) => {
  filter_periode.value = data;
});

useApi("master/jurusan/all").then(({ data }) => {
  jurusans.value = data;
});

useApi("master/angkatan/all").then(({ data }) => {
  angkatans.value = data;
});

const role_id = ref();
const status_action = ref();
const provinceList = ref([]);
const cityList = ref([]);
const districtList = ref([]);
const subDistrictList = ref([]);
const previewPhoto = ref(null);
const getProvinceList = async () => {
  const { data } = await useApi("province/all", {
    withLoader: false,
  });

  provinceList.value = data;
  cityList.value = [];
  districtList.value = [];
  subDistrictList.value = [];

  const resetKeys = ["city_id", "district_id", "subdistrict_id"];

  // dialogSave.value.resetData(form.value, resetKeys);
};

const getCityList = async (province_id: number) => {
  const { data } = await useApi(`city/all/${province_id}`, {
    withLoader: false,
  });

  cityList.value = data;
  districtList.value = [];
  subDistrictList.value = [];

  const resetKeys = ["district_id", "subdistrict_id"];

  // dialogSave.value.resetData(form.value, resetKeys);
};

const getDistrictList = async (city_id: number) => {
  const { data } = await useApi(`district/all/${city_id}`, {
    withLoader: false,
  });

  districtList.value = data;
  subDistrictList.value = [];

  const resetKeys = ["subdistrict_id"];

  // dialogSave.value.resetData(form.value, resetKeys);
};

const getSubDistrictList = async (district_id: number) => {
  const { data } = await useApi(`subdistrict/all/${district_id}`, {
    withLoader: false,
  });

  subDistrictList.value = data;
};

const handleAction = async (status, type, data) => {
  const url = `ppdb/change-status/${type}/${status}/${data.id}`

  const { errors, success } = await useApi(url, {
    withNotif: true,
    method: 'PUT',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  if (success)
    tableRef.value.refresh()
}

const { user } = useAuthStore()

onMounted(() => {
  fetchData(params);
  const { user } = useAuthStore();
  useApi(`level/ppdb/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  });
  getProvinceList();
});

const search = ref("");

const contentData = ref([]);

const headers = [
  { title: "Kode", key: "registration_code", sortable: false },
  { title: "Nama", key: "name", sortable: false },
  { title: "NIK", key: "nik", sortable: false },
  { title: "Jenis Kelamin", key: "gender", sortable: false },
  { title: "No. Handphone", key: "phone_1", sortable: false },
  { title: "Status", key: "status_all", sortable: false },
  { title: "Aksi", key: "actions", sortable: false },
];

const pagination = reactive({
  totalItem: 1,
  pageTotal: 1,
  page: 1,
});

const params = reactive({
  page: 1,
  limit: 10,
  search: "",
});

const baseUrl = "/ppdb";

const fetchData = async (params = {}) => {
  const url = `${baseUrl}${objectToParams(params)}`;

  useApi(url).then(({ data }) => {
    pagination.pageTotal = data.pageTotal;
    pagination.page = Number.parseInt(data.currentPage);
    pagination.totalItem = data.total;
    contentData.value = data.items;
  });
};

const goToPreviousPage = () => {
  if (pagination.page > 1) {
    params.page = params.page - 1;
    fetchData(params);
  }
};

const goToNextPage = () => {
  if (pagination.page < pagination.pageTotal) {
    params.page = params.page + 1;
    fetchData(params);
  }
};

watchDebounced(
  search,
  (newValue) => {
    params.search = newValue;
    fetchData(params);
  },
  { debounce: 500, maxWait: 1000 }
);

const selectableDataIds = ref([]);
const handleProsesBayar = async () => { 
  const requestBody = { 
    ids: [...selectableDataIds.value], // Spread operator to create a new array
  }; 
 
  console.log("requestBody", requestBody); 
 
  const url = "/ppdb/change-bulk-status/approved/payment"; 
 
  const { success } = await useApi(url, { 
    withNotif: true, 
    withLoader: true, 
    method: "PUT", 
    data: requestBody, 
  }); 
 
  if (success) { 
    fetchData(params); 
    selectableDataIds.value = []; 
  } 
};

const handleVerifikasiData = async () => { 
  const requestBody = { 
    ids: [...selectableDataIds.value], // Spread operator to create a new array
  }; 
  const url = "/ppdb/change-bulk-status/approved/data"; 
 
  const { success } = await useApi(url, { 
    withNotif: true, 
    withLoader: true, 
    method: "PUT", 
    data: requestBody, 
  }); 
 
  if (success) { 
    fetchData(params); 
    selectableDataIds.value = []; 
  } 
};

const handleDiterima = async () => { 
  const requestBody = { 
    ids: [...selectableDataIds.value], // Spread operator to create a new array
  }; 
  const url = "/ppdb/change-bulk-status/approved/test"; 
 
  const { success } = await useApi(url, { 
    withNotif: true, 
    withLoader: true, 
    method: "PUT", 
    data: requestBody, 
  }); 
 
  if (success) { 
    fetchData(params); 
    selectableDataIds.value = []; 
  } 
};

watch(
  selectableDataIds,
  (newValue) => {
    if (newValue) {
      const getTotalOutStanding = contentData.value
        .filter((item) => newValue.includes(item.id));
    }
  },
  { deep: true }
);
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isDetail }"
    ref="dialogSave"
    width="1200"
    path="ppdb"
    title="Tambah PPDB"
    edit-title="Edit PPDB"
    detail-title="Detail PPDB"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="3">
      <VCol cols="12">
        <VImg
          class="mb-3"
          rounded
          border
          max-height="300"
          :src="
            previewPhoto ||
            'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
          "
        />
        <FileInput
          v-if="!isDetail"
          v-model="formData.photo"
          accept="image/*"
          label="Upload Foto"
          @change="(data) => (previewPhoto = data.previewImageUrl)"
        />
      </VCol>
    </VCol>
    <VCol cols="12" md="9">
      <VCard>
        <VCardTitle class="mb-2"> Data Siswa </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <LimitInput
                v-model="formData.nisn"
                :error-messages="validationErrors.nisn"
                :maxlength="10"
                :rules="[lengthValidator(formData.nisn, 10)]"
                label="NISN"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <LimitInput
                v-model="formData.kip"
                :error-messages="validationErrors.kip"
                :maxlength="16"
                label="KIP"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <LimitInput
                  v-model="formData.kks"
                  :error-messages="validationErrors.kks"
                  :maxlength="16"
                  :rules="[lengthValidator(formData.kks, 16)]"
                  label="KKS"
                  :readonly="isDetail"
                />
            </VCol>
            <VCol cols="12" md="6">
              <LimitInput
                v-model="formData.nik"
                :error-messages="validationErrors.nik"
                label="NIK Siswa"
                :maxlength="16"
                :rules="[lengthValidator(formData.nik, 16)]"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.name"
                :error-messages="validationErrors.name"
                label="Nama Siswa"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.place_of_birth"
                :error-messages="validationErrors.place_of_birth"
                label="Tempat Lahir"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.birth_date"
                type="date"
                :error-messages="validationErrors.birth_date"
                label="Tanggal Lahir"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VAutocomplete
                v-model="formData.semester_id"
                label="Semester"
                :error-messages="validationErrors.semester_id"
                placeholder="Pilih Semester"
                :items="semester"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VAutocomplete
                v-model="formData.angkatan_id"
                label="Angkatan"
                :error-messages="validationErrors.angkatan_id"
                placeholder="Pilih Angkatan"
                :items="angkatans"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VAutocomplete
                v-model="formData.periode_id"
                label="Periode"
                :error-messages="validationErrors.periode_id"
                placeholder="Pilih Periode"
                :items="periode"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VAutocomplete
                v-model="formData.jurusan_id"
                label="Jurusan"
                :error-messages="validationErrors.jurusan_id"
                placeholder="Pilih Jurusan"
                :items="jurusans"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VAutocomplete
                v-model="formData.kelas_id"
                label="Kelas"
                :error-messages="validationErrors.kelas_id"
                placeholder="Pilih Kelas"
                :items="kelas"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
                :readonly="isDetail"
              />
            </VCol>
            
          </VRow>
        </VCardText>
      </VCard>

      <VCard class="mt-4">
        <VCardTitle class="mb-2"> Alamat Siswa </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.address"
                :error-messages="validationErrors.address"
                label="Jalan"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VAutocomplete
                v-model="formData.province_id"
                label="Provinsi"
                :error-messages="validationErrors.province_id"
                placeholder="Pilih Provinsi"
                :items="provinceList"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
                :readonly="isDetail"
                @update:model-value="getCityList"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VAutocomplete
                v-model="formData.city_id"
                label="Kota/Kabupaten"
                :error-messages="validationErrors.city_id"
                placeholder="Pilih Kota/Kabupaten"
                :items="cityList"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
                :disabled="!formData.province_id"
                :readonly="isDetail"
                @update:model-value="getDistrictList"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VAutocomplete
                v-model="formData.district_id"
                label="Kecamatan"
                :error-messages="validationErrors.district_id"
                placeholder="Pilih Kecamatan"
                :items="districtList"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
                :disabled="!formData.city_id"
                :readonly="isDetail"
                @update:model-value="getSubDistrictList"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VAutocomplete
                v-model="formData.subdistrict_id"
                label="Desa/Kelurahan"
                :error-messages="validationErrors.subdistrict_id"
                placeholder="Pilih Desa/Kelurahan"
                :items="subDistrictList"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
                :disabled="!formData.district_id"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.post_code"
                :error-messages="validationErrors.post_code"
                label="Kode Pos"
                :readonly="isDetail"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>

      <VCard class="mt-4">
        <VCardTitle class="mb-2"> Informasi Lainnya </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12" md="4">
              <VAutocomplete
                v-model="formData.religion"
                label="Agama"
                :error-messages="validationErrors.religion"
                placeholder="Pilih Agama"
                :items="religions"
                item-title="text"
                item-value="text"
                required
                clearable
                clear-icon="ri-close-line"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                v-model="formData.anak_ke"
                :error-messages="validationErrors.anak_ke"
                label="Anak Ke"
                type="number"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                v-model="formData.dari_jumlah_anak"
                :error-messages="validationErrors.dari_jumlah_anak"
                label="Dari Jumlah Anak"
                type="number"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VAutocomplete
                v-model="formData.status_dalam_keluarga"
                label="Status Dalam Keluarga"
                :error-messages="validationErrors.status_dalam_keluarga"
                placeholder="Pilih Status Dalam Keluarga"
                :items="status_dalam_keluarga"
                item-title="text"
                item-value="text"
                required
                clearable
                clear-icon="ri-close-line"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VLabel>Jenis Kelamin</VLabel>
              <VRadioGroup
                v-model="formData.gender"
                inline
                :error-messages="validationErrors.gender"
                :readonly="isDetail"
              >
                <VRadio label="Laki-laki" value="L" />
                <VRadio label="Perempuan" value="P" />
              </VRadioGroup>
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                v-model="formData.entrance_date"
                type="date"
                :error-messages="validationErrors.entrance_date"
                label="Tanggal Masuk"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                v-model="formData.asal_sekolah"
                :error-messages="validationErrors.asal_sekolah"
                label="Asal SMP/MTS"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                v-model="formData.alamat_asal_sekolah"
                :error-messages="validationErrors.alamat_asal_sekolah"
                label="Alamat Asal Sekolah"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                v-model="formData.npsn_asal_sekolah"
                :error-messages="validationErrors.npsn_asal_sekolah"
                label="NPSN Asal Sekolah"
                type="number"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                v-model="formData.nsm_asal_sekolah"
                :error-messages="validationErrors.nsm_asal_sekolah"
                label="NSM Asal Sekolah"
                type="number"
                :readonly="isDetail"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>

      <VCard class="mt-4">
        <VCardTitle class="mb-2"> Data Orang Tua </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <LimitInput
                v-model="formData.nik_ayah"
                :error-messages="validationErrors.nik_ayah"
                label="NIK (Ayah)"
                :maxlength="16"
                :rules="[lengthValidator(formData.nik_ayah, 16)]"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <LimitInput
                v-model="formData.nik_ibu"
                :error-messages="validationErrors.nik_ibu"
                label="NIK (Ibu)"
                :maxlength="16"
                :rules="[lengthValidator(formData.nik_ibu, 16)]"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.nama_ayah"
                :error-messages="validationErrors.nama_ayah"
                label="Nama Ayah"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.nama_ibu"
                :error-messages="validationErrors.nama_ibu"
                label="Nama Ibu"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.pekerjaan_ayah"
                :error-messages="validationErrors.pekerjaan_ayah"
                label="Pekerjaan Ayah"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.pekerjaan_ibu"
                :error-messages="validationErrors.pekerjaan_ibu"
                label="Pekerjaan Ibu"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VAutocomplete
                v-model="formData.agama_ayah"
                label="Agama (Ayah)"
                :error-messages="validationErrors.agama_ayah"
                placeholder="Pilih Agama (Ayah)"
                :items="religions"
                item-title="text"
                item-value="text"
                required
                clearable
                clear-icon="ri-close-line"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VAutocomplete
                v-model="formData.agama_ibu"
                label="Agama (Ibu)"
                :error-messages="validationErrors.agama_ibu"
                placeholder="Pilih Agama (Ibu)"
                :items="religions"
                item-title="text"
                item-value="text"
                required
                clearable
                clear-icon="ri-close-line"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.pendidikan_ayah"
                :error-messages="validationErrors.pendidikan_ayah"
                label="Pendidikan (Ayah)"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.pendidikan_ibu"
                :error-messages="validationErrors.pendidikan_ibu"
                label="Pendidikan (Ibu)"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <LimitInput
                v-model="formData.no_kk"
                :error-messages="validationErrors.no_kk"
                label="No. KK"
                :maxlength="16"
                :rules="[lengthValidator(formData.no_kk, 16)]"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.penghasilan_ortu_perbulan"
                :error-messages="validationErrors.penghasilan_ortu_perbulan"
                label="Penghasilan Ortu / Bln"
                :readonly="isDetail"
                type="number"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.alamat_ortu"
                :error-messages="validationErrors.alamat_ortu"
                label="Alamat Orang Tua"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.nomer_hp_ortu"
                :error-messages="validationErrors.nomer_hp_ortu"
                label="Nomer HP Orang Tua"
                :readonly="isDetail"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>

      <VCard class="mt-4">
        <VCardTitle class="mb-2"> Kontak dan Email </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12" md="4">
              <VTextField
                v-model="formData.email"
                type="email"
                :error-messages="validationErrors.email"
                label="Email"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                v-model="formData.phone_1"
                :error-messages="validationErrors.phone_1"
                label="No. Handphone 1"
                type="number"
                :readonly="isDetail"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                v-model="formData.phone_2"
                :error-messages="validationErrors.phone_2"
                label="No. Handphone 2"
                type="number"
                :readonly="isDetail"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>

      <VCard class="mt-4">
        <VCardTitle class="mb-2"> Upload Berkas </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <FileInput
                v-if="!isDetail"
                v-model="formData.dokumen_kk"
                label="Dokumen KK"
              />
            </VCol>
            <VCol cols="12" md="6">
              <FileInput
                v-if="!isDetail"
                v-model="formData.dokumen_skl"
                label="Dokumen SKL / Ijazah"
              />
            </VCol>
            <VCol cols="12" md="6">
              <FileInput
                v-if="!isDetail"
                v-model="formData.dokumen_kip"
                label="Dokumen KIP"
              />
            </VCol>
            <VCol cols="12" md="6">
              <FileInput
                v-if="!isDetail"
                v-model="formData.dokumen_kks"
                label="Dokumen KKS"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </SaveFileDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol cols="12" md="6">
              <VBtn
                color="primary"
                @click="dialogSave.show()"
                style="margin-right: 10px;"
              >
                <VIcon
                  end
                  icon="ri-add-fill"
                />
                Tambah Data
              </VBtn>
              <ExportFileExcel path="ppdb/export-excel" />
            </VCol>
            <VCol cols="12" md="2" style="margin-block-start: 5px">
            </VCol>
            <VCol cols="12" md="2" style="margin-block-start: 5px">
              <VAutocomplete
                v-model="periode_id"
                label="Tahun Ajaran"
                placeholder="Pilih Tahun Ajaran"
                :items="filter_periode"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="12" md="2" style="margin-block-start: 5px">
              <VAutocomplete
                v-model="semester_id"
                label="Semester"
                placeholder="Pilih Semester"
                :items="filter_semester"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>
    <VCol cols="12">
      <VRow>
        <VCol cols="3">
          <VBtn
            size="large"
            :disabled="selectableDataIds.length === 0"
            @click="
              () => {
                handleProsesBayar();
              }
            "
          >
            Proses Bayar ( {{ selectableDataIds.length }} Calon Siswa )
          </VBtn>
        </VCol>

        <VCol cols="3">
          <VBtn
            size="large"
            :disabled="selectableDataIds.length === 0"
            @click="
              () => {
                handleVerifikasiData();
              }
            "
          >
            Verifikasi Data ( {{ selectableDataIds.length }} Calon Siswa )
          </VBtn>
        </VCol>
        <VCol cols="3">
          <VBtn
            size="large"
            :disabled="selectableDataIds.length === 0"
            @click="
              () => {
                handleDiterima();
              }
            "
          >
            Data Diterima ( {{ selectableDataIds.length }} Calon Siswa )
          </VBtn>
        </VCol>
      </VRow>
    </VCol>
    <VCol cols="12">
      <VDataTable
        ref="tableRef"
        v-model="selectableDataIds"
        :headers="headers"
        :items="contentData"
        :items-per-page="pagination.itemsPerPage"
        :page-count="pagination.pageTotal"
        class="text-no-wrap"
        show-select
      >
        <template #[`item.actions`]="{ item }">
          <div class="d-flex gap-1">
            <VBtn
              v-if="item.tripay_status_transaction == 0"
              size="x-small"
              title="Pembayaran"
              style="border-radius: 0.375rem !important;"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Approve Payment',
                    message: `Anda yakin ingin mengubah status jadi approve?`,
                    onConfirm: () => handleAction('payment', 'approved', item),
                  });
                }
              "
            >
              <VIcon
                start
                icon="ri-checkbox-circle-line"
              />
              Diterima
            </VBtn>
            <VBtn
              v-if="item.tripay_status_transaction == 0"
              title="Pembayaran"
              size="x-small"
              style="border-radius: 0.375rem !important;"
              color="secondary"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Reject Payment',
                    message: `Anda yakin ingin mengubah status jadi reject?`,
                    onConfirm: () => handleAction('payment', 'rejected', item),
                  });
                }
              "
            >
              <VIcon
                start
                icon="ri-subtract-line"
              />
              Ditolak
            </VBtn>
            <VBtn
              v-if="item.status == 0 && item.tripay_status_transaction == 1"
              size="x-small"
              title="Verifikasi Data"
              style="border-radius: 0.375rem !important;"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Approve Verification',
                    message: `Anda yakin ingin mengubah status jadi approve?`,
                    onConfirm: () => handleAction('data', 'approved', item),
                  });
                }
              "
            >
              <VIcon
                start
                icon="ri-checkbox-circle-line"
              />
              Diterima
            </VBtn>
            <VBtn
              v-if="item.status == 0 && item.tripay_status_transaction == 1"
              title="Verifikasi Data"
              size="x-small"
              style="border-radius: 0.375rem !important;"
              color="secondary"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Reject Verification',
                    message: `Anda yakin ingin mengubah status jadi reject?`,
                    onConfirm: () => handleAction('data', 'rejected', item),
                  });
                }
              "
            >
              <VIcon
                start
                icon="ri-subtract-line"
              />
              Ditolak
            </VBtn>
            <VBtn
              v-if="item.status_test == 0 && item.status == 1"
              size="x-small"
              style="border-radius: 0.375rem !important;"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Status Lulus',
                    message: `Anda yakin ingin mengubah status jadi lulus?`,
                    onConfirm: () => handleAction('test', 'approved', item),
                  });
                }
              "
            >
              <VIcon
                start
                icon="ri-checkbox-circle-line"
              />
              Lulus
            </VBtn>
            <VBtn
              v-if="item.status_test == 0 && item.status == 1"
              size="x-small"
              style="border-radius: 0.375rem !important;"
              color="secondary"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Status Tidak Lulus',
                    message: `Anda yakin ingin mengubah status jadi tidak lulus?`,
                    onConfirm: () => handleAction('test', 'rejected', item),
                  });
                }
              "
            >
              <VIcon
                start
                icon="ri-subtract-line"
              />
              Tidak Lulus
            </VBtn>
            <IconBtn
              size="small"
              title="Detail"
              @click="
                () => {
                  const payload = { ...item };
                  payload.mariage_status = String(item.mariage_status);
                  dialogSave.show(payload, true);
                }
              "
            >
              <VIcon icon="ri-eye-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                () => {
                  const payload = { ...item };
                  payload.mariage_status = String(item.mariage_status);
                  const birth_date = new Date(payload.birth_date);
                  birth_date.setDate(birth_date.getDate() + 1);
                  payload.birth_date = formatFullDate(birth_date).simpleDate;

                  const entrance_date = new Date(payload.entrance_date);
                  entrance_date.setDate(entrance_date.getDate() + 1);
                  payload.entrance_date = formatFullDate(entrance_date).simpleDate;
                  dialogSave.show(payload);
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus PPDB',
                  message: `Anda yakin ingin menghapus PPDB ${
                    (item as any).name
                  }?`,
                  onConfirm: () => remove((item as any).id),
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
            Total Data: <b>{{ pagination.totalItem }}</b>
            <!--
              <VSelect
              v-model="pagination.itemsPerPage"
              class="per-page-select"
              variant="plain"
              :items="[10, 20, 25, 50, 100]"
              />
            -->
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
    <!-- <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data PPDB"
        path="ppdb"
        :with-actions="true"
        :periode_id="periode_id"
        :semester_id="semester_id"
        :headers="[
          {
            title: 'Kode',
            key: 'registration_code',
            sortable: false,
          },
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
          {
            title: 'NIK',
            key: 'nik',
            sortable: false,
          },
          {
            title: 'Jenis Kelamin',
            key: 'gender',
            sortable: false,
          },
          {
            title: 'No. Handphone',
            key: 'phone_1',
            sortable: false,
          },
          // {
          //   title: 'Pendidikan Terakhir',
          //   key: 'pendidikan_terakhir',
          //   sortable: false,
          // },
          {
            title: 'Status',
            key: 'status_all',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <VBtn
              v-if="item.tripay_status_transaction == 0"
              size="x-small"
              style="border-radius: 0.375rem !important;"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Approve Payment',
                    message: `Anda yakin ingin mengubah status jadi approve?`,
                    onConfirm: () => handleAction('payment', 'approved', item),
                  });
                }
              "
            >
              <VIcon
                start
                icon="ri-checkbox-circle-line"
              />
              Payment Diterima
            </VBtn>
            <VBtn
              v-if="item.tripay_status_transaction == 0"
              size="x-small"
              style="border-radius: 0.375rem !important;"
              color="secondary"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Reject Payment',
                    message: `Anda yakin ingin mengubah status jadi reject?`,
                    onConfirm: () => handleAction('payment', 'rejected', item),
                  });
                }
              "
            >
              <VIcon
                start
                icon="ri-subtract-line"
              />
              Payment Ditolak
            </VBtn>
            <VBtn
              v-if="item.status == 0 && item.tripay_status_transaction == 1"
              size="x-small"
              style="border-radius: 0.375rem !important;"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Approve Verification',
                    message: `Anda yakin ingin mengubah status jadi approve?`,
                    onConfirm: () => handleAction('data', 'approved', item),
                  });
                }
              "
            >
              <VIcon
                start
                icon="ri-checkbox-circle-line"
              />
              Verifikasi Data Diterima
            </VBtn>
            <VBtn
              v-if="item.status == 0 && item.tripay_status_transaction == 1"
              size="x-small"
              style="border-radius: 0.375rem !important;"
              color="secondary"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Reject Verification',
                    message: `Anda yakin ingin mengubah status jadi reject?`,
                    onConfirm: () => handleAction('data', 'rejected', item),
                  });
                }
              "
            >
              <VIcon
                start
                icon="ri-subtract-line"
              />
              Verifikasi Data Ditolak
            </VBtn>
            <VBtn
              v-if="item.status_test == 0 && item.status == 1"
              size="x-small"
              style="border-radius: 0.375rem !important;"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Status Lulus',
                    message: `Anda yakin ingin mengubah status jadi lulus?`,
                    onConfirm: () => handleAction('test', 'approved', item),
                  });
                }
              "
            >
              <VIcon
                start
                icon="ri-checkbox-circle-line"
              />
              Lulus
            </VBtn>
            <VBtn
              v-if="item.status_test == 0 && item.status == 1"
              size="x-small"
              style="border-radius: 0.375rem !important;"
              color="secondary"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Status Tidak Lulus',
                    message: `Anda yakin ingin mengubah status jadi tidak lulus?`,
                    onConfirm: () => handleAction('test', 'rejected', item),
                  });
                }
              "
            >
              <VIcon
                start
                icon="ri-subtract-line"
              />
              Tidak Lulus
            </VBtn>
            <IconBtn
              size="small"
              title="Detail"
              @click="
                () => {
                  const payload = { ...item };
                  payload.mariage_status = String(item.mariage_status);
                  dialogSave.show(payload, true);
                }
              "
            >
              <VIcon icon="ri-eye-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                () => {
                  const payload = { ...item };
                  payload.mariage_status = String(item.mariage_status);
                  dialogSave.show(payload);
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus PPDB',
                  message: `Anda yakin ingin menghapus PPDB ${
                    (item as any).name
                  }?`,
                  onConfirm: () => remove((item as any).id),
                })
              "
            >
              <VIcon icon="ri-delete-bin-line" />
            </IconBtn>
          </div>
        </template>
      </AppTable>
    </VCol> -->
  </VRow>
</template>
