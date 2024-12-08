<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { reactive, ref } from 'vue';
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref(null);

const listProvince = ref([]); // List of services

const fetchListProvince = async () => {
  try {
    const response = await useApi("/province/all");
    const data = response.data;
    console.log(data);
    listProvince.value = [
      ...data.map((province: any) => ({
        text: province.name,
        value: province.id
      }))
    ];
    console.log(listProvince);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Tambahkan penanganan error sesuai kebutuhan
  }
};

// onMounted(() => {
//   fetchListProvince();
// });

const tableRef = ref(null);

// Gunakan reactive untuk formData agar lebih fleksibel
const formData = reactive({
  provinceId: '',
  name: '',
});


// Fungsi untuk membuka dialog create
const openCreateDialog = () => {
  fetchListProvince();
  formData.provinceId = ''; // Reset province ID
  formData.name = ''; // Reset name
  dialogSave.value.show(); // Show the dialog
};

// Fungsi untuk membuka dialog edit
const openEditDialog = (item) => {
  fetchListProvince();
  formData.provinceId = item.province.id;
  formData.name = item.name;
  item.provinceId = item.province.id;
  dialogSave.value.show(item);
};
</script>

<template>
  <UpdateDialog
    v-if="tableRef"
    path="city"
    title="Create new city"
    edit-title="Edit City"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="formData"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12">
      <VAutocomplete
          v-model="formData.provinceId"
          label="Province"
          density="compact"
          placeholder="Select Province"
          :rules="[requiredValidator]"
          :items="listProvince"
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
        title="City"
        path="city"
        :with-actions="true"
        :headers="[
          {
            title: 'Provinsi',
            key: 'province.name',
            sortable: false,
          },
          {
            title: 'Kota',
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
                  title: 'Delete City',
                  message: `Are you sure want to delete city ${item.name}?`,
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
