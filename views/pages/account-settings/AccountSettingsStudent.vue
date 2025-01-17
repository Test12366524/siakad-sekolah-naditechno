<script lang="ts" setup>
import { ref } from "vue"; // Tambahkan nextTick dari Vue

const formRef = ref();
const { user, validateLogin } = useAuthStore();

const kelas = ref();
const semester = ref();
const filter_semester = ref();
const periode = ref();
const filter_periode = ref();

const jurusans = ref();
const angkatans = ref();

const formData = ref({
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
  nis: "",
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
  { id: "Protestan", text: "Protestan" },
  { id: "Katolik", text: "Katolik" },
  { id: "Hindu", text: "Hindu" },
  { id: "Budha", text: "Budha" },
  { id: "Konghucu", text: "Konghucu" },
]);

const genders = ref([
  { id: "L", text: "Laki-laki" },
  { id: "P", text: "Perempuan" },
]);

const kelas_id = ref<number | null>(null);
const semester_id = ref<number | null>(null);
const periode_id = ref<number | null>(null);
const gender = ref("");

const previewPhoto = ref(null);
const validationErrors = ref({});
const refVForm = ref(null);
const provinceList = ref([]);
const cityList = ref([]);
const districtList = ref([]);
const subDistrictList = ref([]);

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

const getDetails = (userId) => {
  useApi(`siswa/user/${userId}`).then(async ({ data }) => {
    const payload = { ...data };

    await getProvinceList();
    payload.province_id = payload.province_id.toString();
    payload.city_id = payload.city_id.toString();
    await getCityList(payload.province_id);
    payload.district_id = payload.district_id.toString();
    await getDistrictList(payload.city_id);
    payload.subdistrict_id = payload.subdistrict_id.toString();
    await getSubDistrictList(payload.district_id);

    if (payload.photo) previewPhoto.value = getFileUrl(payload.photo);

    payload.entrance_date = new Date(payload.entrance_date)
      .toISOString()
      .substring(0, 10);
    payload.birth_date = new Date(payload.birth_date)
      .toISOString()
      .substring(0, 10);

    formData.value = payload;
  });
};

const updateData = () => {
  const payload = formData.value;

  const { errors, success } = useApi(`siswa/${formData.value.id}`, {
    withNotif: true,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: payload,
  });
};

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

const getDetails = (userId) => {
  useApi(`siswa/user/${userId}`).then(async ({ data }) => {
    const payload = { ...data };

    payload.province_id = payload.province_id.toString();
    payload.city_id = payload.city_id.toString();
    await getCityList(payload.province_id);
    payload.district_id = payload.district_id.toString();
    await getDistrictList(payload.city_id);
    payload.subdistrict_id = payload.subdistrict_id.toString();
    await getSubDistrictList(payload.district_id);

    if (payload.photo) previewPhoto.value = getFileUrl(payload.photo);

    payload.entrance_date = new Date(payload.entrance_date)
      .toISOString()
      .substring(0, 10);
    payload.birth_date = new Date(payload.birth_date)
      .toISOString()
      .substring(0, 10);

    formData.value = payload;
  });
};

const updateData = () => {
  const payload = formData.value;

  const { errors, success } = useApi(`siswa/${formData.value.id}`, {
    withNotif: true,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: payload,
  });
};

onMounted(async () => {
  getDetails(user.id);
  await getProvinceList();
  getDetails(user.id);
});

watchEffect(() => {
  if (formRef.value) formRef.value.init(user);
});
</script>

<template>
  <VRow>
    <VForm ref="refVForm" @submit.prevent="updateData">
      <VCard>
        <VCardText class="py-6">
          <VRow>
            <VCol cols="12">
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
            <VCol cols="12">
              <VCard>
                <VCardTitle class="mb-2"> Data Siswa </VCardTitle>
                <VCardText>
                  <VRow>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.nis"
                        :error-messages="validationErrors.nis"
                        label="No Induk Siswa"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.nisn"
                        :error-messages="validationErrors.nisn"
                        label="NISN"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.kip"
                        :error-messages="validationErrors.kip"
                        label="KIP"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.kks"
                        :error-messages="validationErrors.kks"
                        label="KKS"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.nik"
                        :error-messages="validationErrors.nik"
                        label="NIK Siswa"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.name"
                        :error-messages="validationErrors.name"
                        label="Nama Siswa"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.place_of_birth"
                        :error-messages="validationErrors.place_of_birth"
                        label="Tempat Lahir"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.birth_date"
                        type="date"
                        :error-messages="validationErrors.birth_date"
                        label="Tanggal Lahir"
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
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.post_code"
                        :error-messages="validationErrors.post_code"
                        label="Kode Pos"
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
                      />
                    </VCol>
                    <VCol cols="12" md="4">
                      <VTextField
                        v-model="formData.anak_ke"
                        :error-messages="validationErrors.anak_ke"
                        label="Anak Ke"
                        type="number"
                      />
                    </VCol>
                    <VCol cols="12" md="4">
                      <VTextField
                        v-model="formData.dari_jumlah_anak"
                        :error-messages="validationErrors.dari_jumlah_anak"
                        label="Dari Jumlah Anak"
                        type="number"
                      />
                    </VCol>
                    <VCol cols="12" md="4">
                      <VLabel>Jenis Kelamin</VLabel>
                      <VRadioGroup
                        v-model="formData.gender"
                        inline
                        :error-messages="validationErrors.gender"
                      >
                        <VRadio label="Laki-laki" value="L" />
                        <VRadio label="Perempuan" value="P" />
                      </VRadioGroup>
                    </VCol>
                    <VCol cols="12" md="4">
                      <VTextField
                        v-model="formData.asal_sekolah"
                        :error-messages="validationErrors.asal_sekolah"
                        label="Asal SMP/MTS"
                      />
                    </VCol>

                    <VCol cols="12" md="4">
                      <VTextField
                        v-model="formData.entrance_date"
                        type="date"
                        :error-messages="validationErrors.entrance_date"
                        label="Tanggal Masuk"
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
                      <VTextField
                        v-model="formData.nama_ayah"
                        :error-messages="validationErrors.nama_ayah"
                        label="Nama Ayah"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.pekerjaan_ayah"
                        :error-messages="validationErrors.pekerjaan_ayah"
                        label="Pekerjaan Ayah"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.nik_ayah"
                        :error-messages="validationErrors.nik_ayah"
                        label="NIK Ayah"
                        type="number"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.nama_ibu"
                        :error-messages="validationErrors.nama_ibu"
                        label="Nama Ibu"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.pekerjaan_ibu"
                        :error-messages="validationErrors.pekerjaan_ibu"
                        label="Pekerjaan Ibu"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.nik_ibu"
                        :error-messages="validationErrors.nik_ibu"
                        label="NIK Ibu"
                        type="number"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.no_kk"
                        :error-messages="validationErrors.no_kk"
                        label="No KK"
                        type="number"
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
                      />
                    </VCol>
                    <VCol cols="12" md="4">
                      <VTextField
                        v-model="formData.phone_1"
                        :error-messages="validationErrors.phone_1"
                        label="No. Handphone 1"
                        type="number"
                      />
                    </VCol>
                    <VCol cols="12" md="4">
                      <VTextField
                        v-model="formData.phone_2"
                        :error-messages="validationErrors.phone_2"
                        label="No. Handphone 2"
                        type="number"
                      />
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCardText>
        <VDivider />

        <VCardText class="overflow-visible d-flex justify-end flex-wrap gap-4">
          <VBtn type="submit"> Update </VBtn>
        </VCardText>
      </VCard>
    </VForm>
  </VRow>
</template>
