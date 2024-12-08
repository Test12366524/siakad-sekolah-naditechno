<script lang="ts" setup>
import { ref } from "vue"; // Tambahkan nextTick dari Vue
import { VTextField } from "vuetify/lib/components/index.mjs";

const props = defineProps({
  validationErrors: {
    type: Object,
    required: true,
  },
  formData: {
    type: Object,
    required: true,
  },
  viewOnly: {
    type: Boolean,
  },
});

const emits = defineEmits(["updateCabang"]);

const route = useRoute();

const formRef = ref();
const categories = ref();
const currentTab = ref(0);
const marketings = ref([]);
const cabangs = ref([]);
const cabangList = ref([]);
const selectedCabang = ref(null);

const form = {
  name: "",
  gender: "M",
  birth_date: "",
  phone_number_1: "",
  email: "",
  instagram: "",
  facebook: "",
  cabang_id: "",
  status: "0",
  tensi: "",
  alergi: "",
  keluhan: "",
  lidah: "",
  nadi: "",
};

watch(selectedCabang, (value) => {
  const getId =
    cabangList.value.find((cabang) => {
      return cabang.text === selectedCabangParams;
    })?.id || 0;

  emits("updateCabang", getId);
});


const getCabangList = () => {
  useApi("/cabang/all").then(({ data }) => {
    cabangList.value = data;
  });
};

onMounted(() => {
  getCabangList();
});
</script>

<template>
  <VRow>
    <VCol v-if="viewOnly" cols="12">
      <VTextField
        v-model="formData.code"
        :error-messages="validationErrors.name"
        :readonly="viewOnly"
        label="ID Pelanggan"
      />
    </VCol>

    <!-- data diri -->
    <VCol cols="12">
      <VCard elevation="0" border>
        <VCardItem>
          <VRow>
            <VCol cols="12"> Data Diri </VCol>
            <VCol cols="6">
              <VTextField
                v-model="formData.name"
                :error-messages="validationErrors.name"
                :readonly="viewOnly"
                label="Nama Pelanggan"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                v-model="formData.phone_number_1"
                type="number"
                :error-messages="validationErrors.phone_number_1"
                :readonly="viewOnly"
                label="No.Handphone"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                v-model="formData.email"
                type="email"
                :error-messages="validationErrors.email"
                :readonly="viewOnly"
                label="Email"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                v-model="formData.alamat"
                :error-messages="validationErrors.alamat"
                :readonly="viewOnly"
                label="Alamat"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                v-model="formData.birth_date"
                :error-messages="validationErrors.birth_date"
                :readonly="viewOnly"
                label="Tanggal lahir"
                type="date"
              />
            </VCol>
            <VCol cols="6">
              <VLabel>Jenis kelamin</VLabel>
              <VRadioGroup
                v-model="formData.gender"
                inline
                :readonly="viewOnly"
                :error-messages="validationErrors.gender"
              >
                <VRadio label="Laki Laki" value="M" />
                <VRadio label="Perempuan" value="F" />
              </VRadioGroup>
            </VCol>
            <VCol cols="6">
              <VAutocomplete
                v-model="formData.cabang_id"
                label="Cabang"
                placeholder="Pilih Cabang"
                :items="cabangList"
                item-title="text"
                item-value="id"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                v-model="formData.facebook"
                :error-messages="validationErrors.facebook"
                label="Facebook"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                v-model="formData.instagram"
                :error-messages="validationErrors.instagram"
                label="Instagram"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                v-model="formData.tiktok"
                :error-messages="validationErrors.tiktok"
                label="Tiktok"
              />
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <!-- koperasi -->
    <VCol cols="12">
      <VCard elevation="0" border>
        <VCardItem>
          <VRow>
            <VCol cols="12"> Riwayat </VCol>
            <VCol cols="6">
              <VTextField
                v-model="formData.tensi"
                :error-messages="validationErrors.tensi"
                label="Tensi"
              />
            </VCol>

            <VCol cols="6">
              <VTextField
                v-model="formData.keluhan"
                :error-messages="validationErrors.keluhan"
                label="Keluhan"
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                v-model="formData.alergi"
                :error-messages="validationErrors.alergi"
                label="Alergi"
              />
            </VCol>

            <VCol cols="6">
              <VTextField
                v-model="formData.nadi"
                :error-messages="validationErrors.nadi"
                label="Cek Nadi "
              />
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>
  </VRow>
</template>
