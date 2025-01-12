<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const siswa = ref();

const form = {
  siswa_id: undefined,
  kerja: "",
  perusahaan: "",
  alamat_perusahaan: "",
};

useApi("siswa/all").then(({ data }) => {
  siswa.value = data;
});


onMounted(() => {
  const { user } = useAuthStore();
  // useApi(`level/alumni/${user.role_id}`).then(({ data }) => {
  //   if(data == 0){
  //     navigateTo(`/not-authorized`);
  //   }
  // });
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="siswa/alumni"
    title="Tambah Alumni"
    edit-title="Edit Alumni"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="12">
      <VAutocomplete
        v-model="formData.siswa_id"
        label="Siswa"
        density="compact"
        :error-messages="validationErrors.siswa_id"
        placeholder="Pilih Siswa"
        :items="siswa"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
    <VCol cols="12" md="12">
      <VTextField
        :error-messages="validationErrors.kerja"
        v-model="formData.kerja"
        label="Kerja"
      />
    </VCol>
    <VCol cols="12" md="12">
      <VTextField
        :error-messages="validationErrors.perusahaan"
        v-model="formData.perusahaan"
        label="Perusahaan"
      />
    </VCol>
    <VCol cols="12">
      <VTextField
        :error-messages="validationErrors.alamat_perusahaan"
        v-model="formData.alamat_perusahaan"
        label="Alamat Perusahaan"
      />
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
        title="Data Alumni"
        path="siswa/alumni"
        :with-actions="true"
        :headers="[
          {
            title: 'Siswa',
            key: 'siswa_name',
            sortable: false,
          },
          {
            title: 'Kerja',
            key: 'kerja',
            sortable: false,
          },
          {
            title: 'Perusahaan',
            key: 'perusahaan',
            sortable: false,
          },
          {
            title: 'Alamat Perusahaan',
            key: 'alamat_perusahaan',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              @click="dialogSave.show({ ...item })"
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus Alumni',
                  message: `Anda yakin ingin menghapus Alumni ${
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
