<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  title: String,
  type: {
    type: String,
    required: true,
  },
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

const provinces = ref([]);
const cities = ref([]);
const districts = ref([]);
const subdistricts = ref([]);

// Computed property to check if address is the same as KTP
const isAddressSameWithKtp = computed(
  () =>
    (props.type !== "address" &&
      props.formData.pasangan.address_same_with_ktp == 1) ||
    props.viewOnly
);

// Computed to decide the model for form fields based on isAddressSameWithKtp
const addressModel = computed(() =>
  isAddressSameWithKtp.value
    ? props.formData.pasangan.address
    : props.formData.pasangan[props.type]
);

const handleProvinceChange = async (val: number) => {
  if (val) {
    const { data } = await useApi(`city/all/${val}`, {
      withLoader: false,
    });
    cities.value = data ?? [];
    await nextTick(); // Ensure the DOM updates after the data fetch
  }
};

const handleCityChange = async (val: number) => {
  if (val) {
    const { data } = await useApi(`district/all/${val}`, {
      withLoader: false,
    });
    districts.value = data ?? [];
    await nextTick(); // Ensure the DOM updates after the data fetch
  }
};

const handleDistrictChange = async (val: number) => {
  if (val) {
    const { data } = await useApi(`subdistrict/all/${val}`, {
      withLoader: false,
    });
    subdistricts.value = data ?? [];
    await nextTick(); // Ensure the DOM updates after the data fetch
  }
};

watch(
  addressModel,
  async () => {
    useApi("province/all", {
      withLoader: false,
    }).then(({ data }) => (provinces.value = data));

    if (addressModel.value.province_id) {
      handleProvinceChange(addressModel.value.province_id);
      await nextTick();
      // addressModel.value.city_id = props.formData[props.type].city_id;
    }

    if (addressModel.value.city_id) {
      handleCityChange(addressModel.value.city_id);
      await nextTick();
    }

    if (addressModel.value.district_id) {
      handleDistrictChange(addressModel.value.district_id);
      await nextTick();
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<template>
  <VCard elevation="0" border>
    <VCardItem>
      <VRow>
        <VCol cols="12">{{ title }}</VCol>

        <!-- Checkbox for Same with KTP -->
        <VCol cols="12" v-if="type === 'address_domicile'">
          <VCheckbox
            v-model="formData.pasangan.address_same_with_ktp"
            :readonly="viewOnly"
            :value="1"
            :error-messages="validationErrors['pasangan.address_same_with_ktp']"
            label="Sama Dengan Alamat KTP"
          />
        </VCol>

        <VCol cols="12" class="p-0">
          <VRow class="p-0 m-0">
            <!-- Full Address -->
            <VCol cols="6">
              <VTextField
                :error-messages="
                  validationErrors['pasangan.' + type + '.full_address']
                "
                v-model="addressModel.full_address"
                label="Alamat Lengkap"
                :readonly="isAddressSameWithKtp || props.viewOnly"
              />
            </VCol>

            <!-- Province -->
            <VCol cols="6">
              <VAutocomplete
                :error-messages="
                  validationErrors['pasangan.' + type + '.province_id']
                "
                @update:model-value="handleProvinceChange"
                v-model="addressModel.province_id"
                label="Provinsi"
                density="compact"
                placeholder="Pilih Provinsi"
                :items="provinces"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
                :readonly="isAddressSameWithKtp || props.viewOnly"
              />
            </VCol>

            <!-- City -->
            <VCol cols="6">
              <VAutocomplete
                :error-messages="
                  validationErrors['pasangan.' + type + '.city_id']
                "
                @update:model-value="handleCityChange"
                v-model="addressModel.city_id"
                label="Kabupaten/Kota"
                density="compact"
                placeholder="Pilih Kota/Kabupaten"
                :items="cities"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
                :readonly="isAddressSameWithKtp || props.viewOnly"
              />
            </VCol>

            <!-- District -->
            <VCol cols="6">
              <VAutocomplete
                :error-messages="
                  validationErrors['pasangan.' + type + '.district_id']
                "
                @update:model-value="handleDistrictChange"
                v-model="addressModel.district_id"
                label="Kecamatan"
                density="compact"
                placeholder="Pilih Kecamatan"
                :items="districts"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
                :readonly="isAddressSameWithKtp || props.viewOnly"
              />
            </VCol>

            <!-- Subdistrict -->
            <VCol cols="6">
              <VAutocomplete
                :error-messages="
                  validationErrors['pasangan.' + type + '.subdistrict_id']
                "
                v-model="addressModel.subdistrict_id"
                label="Kelurahan"
                density="compact"
                placeholder="Pilih Kelurahan"
                :items="subdistricts"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
                :readonly="isAddressSameWithKtp || props.viewOnly"
              />
            </VCol>

            <!-- Postal Code -->
            <VCol cols="6">
              <VTextField
                :error-messages="
                  validationErrors['pasangan.' + type + '.post_code']
                "
                type="number"
                v-model="addressModel.post_code"
                label="Kode Pos"
                :readonly="isAddressSameWithKtp || props.viewOnly"
              />
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VCardItem>
  </VCard>
</template>
