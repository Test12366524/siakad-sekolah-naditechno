<script lang="ts" setup>
import { ref } from "vue"; // Tambahkan nextTick dari Vue

const formRef = ref();
const { user, validateLogin } = useAuthStore();

const formData = ref({
  mata_pelajaran_id: null,
  name: "",
  nik: "",
  nuptk: "",
  nip: "",
  birth_date: "",
  place_of_birth: "",
  gender: "",
  email: "",
  phone: "",
  join_date: "",
  pendidikan_terakhir: "",
  tugas_tambahan_id: null,
  status_kepegawaian: "",
  address: "",
  photo: null,
});

const previewPhoto = ref(null);
const validationErrors = ref({});
const refVForm = ref(null);
const tugasTambahanList = ref([]);
const mataPelajaranList = ref([]);

const getTugasTambahan = async () => {
  await useApi("master/tugas-tambahan/all", { withLoader: false }).then(
    ({ data }) => {
      tugasTambahanList.value = data;
    }
  );
};

const getMataPelajaran = async () => {
  await useApi("master/mata-pelajaran/all", { withLoader: false }).then(
    ({ data }) => {
      mataPelajaranList.value = data;
    }
  );
};

const getDetails = (userId) => {
  useApi(`master/guru/user/${userId}`).then(({ data }) => {
    console.log("getDetails", data);
    formData.value = data;
    formData.value.photo = data.photo ? getFileUrl(data.photo) : null;
    previewPhoto.value = formData.value.photo;
  });
};

onMounted(async () => {
  getDetails(user.id);
  getTugasTambahan();
  getMataPelajaran();
});

const updateData = () => {
  const payload = formData.value;

  const { errors, success } = useApi(`master/guru/${formData.value.id}`, {
    withNotif: true,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: payload,
  });
};

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
              <VCol cols="12" align-self="center">
                <VImg
                  max-height="300"
                  class="mb-3"
                  rounded
                  border
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
                <VCardTitle class="mb-2"> Data Guru </VCardTitle>
                <VCardText>
                  <VRow>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.name"
                        :error-messages="validationErrors.name"
                        label="Nama Guru"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.nik"
                        type="number"
                        :error-messages="validationErrors.nik"
                        label="NIK"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.nuptk"
                        :error-messages="validationErrors.nuptk"
                        label="NUPTK"
                        type="number"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.nip"
                        :error-messages="validationErrors.nip"
                        label="NIP"
                        type="number"
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
                      <VTextField
                        v-model="formData.place_of_birth"
                        :error-messages="validationErrors.place_of_birth"
                        label="Tempat Lahir"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
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
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.email"
                        type="email"
                        :error-messages="validationErrors.email"
                        label="Email"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.phone"
                        :error-messages="validationErrors.phone"
                        label="No. Handphone"
                        type="number"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.join_date"
                        type="date"
                        :error-messages="validationErrors.join_date"
                        label="Tanggal Bergabung"
                      />
                    </VCol>
                    <VCol cols="12">
                      <VTextarea
                        v-model="formData.address"
                        :error-messages="validationErrors.address"
                        label="Alamat"
                        rows="2"
                      />
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>

              <VCard class="mt-4">
                <VCardTitle class="mb-2"> Pendidikan dan Tugas </VCardTitle>
                <VCardText>
                  <VRow>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.pendidikan_terakhir"
                        :error-messages="validationErrors.pendidikan_terakhir"
                        label="Pendidikan Terakhir"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VAutocomplete
                        v-model="formData.mata_pelajaran_id"
                        label="Mata Pelajaran"
                        :error-messages="validationErrors.mata_pelajaran_id"
                        placeholder="Pilih Mata Pelajaran"
                        :items="mataPelajaranList"
                        item-title="text"
                        item-value="id"
                        required
                        clearable
                        clear-icon="ri-close-line"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VAutocomplete
                        v-model="formData.tugas_tambahan_id"
                        label="Tugas Tambahan"
                        :error-messages="validationErrors.tugas_tambahan_id"
                        placeholder="Pilih Tugas Tambahan"
                        :items="tugasTambahanList"
                        item-title="text"
                        item-value="id"
                        required
                        clearable
                        clear-icon="ri-close-line"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="formData.status_kepegawaian"
                        :error-messages="validationErrors.status_kepegawaian"
                        label="Status Kepegawaian"
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
