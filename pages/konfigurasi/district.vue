<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { nextTick, reactive, ref } from 'vue'; // Tambahkan nextTick dari Vue
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref(null);

const listProvince = ref([]);
const listCity = ref([]);

const fetchListProvince = async () => {
  try {
    const response = await useApi("/province/all");
    const data = response.data;
    listProvince.value = [
      ...data.map((province: any) => ({
        text: province.name,
        value: province.id
      }))
    ];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const fetchListCity = async (provinceId: number) => {
  try {
    listCity.value = [];
    const response = await useApi(`/city/all/${provinceId}`);
    const data = response.data;
    
    // Tambahkan opsi default "Pilih Kota"
    listCity.value = [
      ...data.map((city: any) => ({
        text: city.name,
        value: city.id
      }))
    ];

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const tableRef = ref(null);

// Gunakan reactive untuk formData agar lebih fleksibel
const formData = reactive({
  provinceId: '',
  cityId: '',
  name: '',
});

// Fungsi untuk membuka dialog create
const openCreateDialog = () => {
  fetchListProvince();
  formData.provinceId = ''; // Reset province ID
  formData.cityId = ''; // Reset city ID
  formData.name = ''; // Reset name
  dialogSave.value.show(); // Show the dialog
};

// Fungsi untuk membuka dialog edit
const openEditDialog = async (item) => {
  fetchListProvince();
  formData.provinceId = item.city.provinceId;
  await nextTick(); // Pastikan `formData.provinceId` sudah di-update sebelum fetch
  fetchListCity(formData.provinceId); // Fetch cities based on the selected province
  formData.cityId = item.city.id;
  formData.name = item.name;

  item.provinceId = item.city.provinceId;
  item.cityId = item.city.id;
  dialogSave.value.show(item);
};

const onProvinceChange = (provinceId: number) => {
  fetchListCity(provinceId);
};

</script>

<template>
  <UpdateDialog
    v-if="tableRef"
    path="district"
    title="Create new district"
    edit-title="Edit District"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="formData"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="6">
      <VAutocomplete
          v-model="formData.provinceId"
          label="Province"
          density="compact"
          placeholder="Select Province"
          :rules="[requiredValidator]"
          :items="listProvince"
          @update:modelValue="onProvinceChange"
          item-title="text"
          item-value="value"
          required
          clearable
          clear-icon="ri-close-line"
        />
    </VCol>  
    <VCol cols="6">
      <VAutocomplete
          v-model="formData.cityId"
          label="City"
          density="compact"
          placeholder="Select City"
          :rules="[requiredValidator]"
          :items="listCity"
          item-title="text"
          item-value="value"
          required
          clearable
          clear-icon="ri-close-line"
        />
    </VCol>
    <VCol cols="12">
      <VTextField
        :rules="[requiredValidator]"
        v-model="formData.name"
        label="Name"
      />
    </VCol>
  </UpdateDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VBtn @click="openCreateDialog" color="primary">
            <VIcon end icon="ri-add-fill" />
            Create New
          </VBtn>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Daftar - Kecamatan"
        path="district"
        :with-actions="true"
        :headers="[
          {
            title: 'Kota',
            key: 'city.name',
            sortable: false,
          },
          {
            title: 'Kecamatan',
            key: 'name',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn @click="openEditDialog(item)" size="small">
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Delete District',
                  message: `Are you sure want to delete district ${item.name}?`,
                  onConfirm: () => remove(item.id),
                })
              "
              size="small"
            >
              <VIcon icon="ri-delete-bin-line" />
            </IconBtn>
          </div>
        </template>
      </AppTable>
    </VCol>
  </VRow>
</template>
