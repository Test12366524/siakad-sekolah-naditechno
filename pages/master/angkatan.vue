<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const form = {
  periode_id: "",
  name: "",
  status: 1,
};

const periodes = ref();

useApi("master/periode/all/0").then(({ data }) => {
    periodes.value = data;
});

onMounted(() => {
  const { user } = useAuthStore();
  useApi(`level/master-angkatan/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  });
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="master/angkatan"
    title="Tambah Angkatan"
    edit-title="Edit Angkatan"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >

    <VCol cols="12">
      <VAutocomplete
        v-model="formData.periode_id"
        label="Tahun Ajaran"
        density="compact"
        :error-messages="validationErrors.periode_id"
        placeholder="Pilih Tahun Ajaran"
        :items="periodes"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
    <VCol cols="12">
      <VTextField
        :error-messages="validationErrors.angkatan"
        v-model="formData.angkatan"
        label="Angkatan"
      />
    </VCol>

    <VCol cols="12">
      <VLabel>Status</VLabel>
      <VRadioGroup
        inline
        v-model="formData.status"
        :error-messages="validationErrors.status"
      >
        <VRadio label="Aktif" :value="1"></VRadio>
        <VRadio label="Nonaktif" :value="0"></VRadio>
      </VRadioGroup>
    </VCol>

  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol>
              <VBtn @click="dialogSave.show()" color="primary">
                <VIcon end icon="ri-add-fill" />
                Tambah Data
              </VBtn>
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Angkatan"
        path="master/angkatan"
        :with-actions="true"
        :headers="[
          {
            title: 'Tahun Ajaran',
            key: 'periode_name',
            sortable: false,
          },
          {
            title: 'Angkatan',
            key: 'angkatan',
            sortable: false,
          },
          {
            title: 'Status',
            key: 'status_desc',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              @click="dialogSave.show({ ...item, status_desc: undefined })"
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus Angkatan',
                  message: `Anda yakin ingin menghapus Angkatan ${
                    (item as any).name
                  }?`,
                  onConfirm: () => remove((item as any).id),
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
