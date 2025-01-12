<script setup lang="ts">
const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const form = ref({
  pembina_id: null, // guruid
  date: null,
});

const teacherList = ref([]);

const getAllTeacher = async () => {
  useApi("master/guru/all").then(({ data }) => {
    teacherList.value = data;
  });
};

onMounted(() => {
  const { user } = useAuthStore();
  useApi(`level/jadwal-upacara/${user.role_id}`).then(({ data }) => {
    if (data == 0) {
      navigateTo(`/not-authorized`);
    }
  });

  getAllTeacher();
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="jadwal-upacara"
    title="Tambah Pembina Upacara"
    edit-title="Edit Pembina Upacara"
    :default-form="form"
    :request-form="form"
    :refresh-callback="tableRef.refresh"
    width="600"
  >
    <VCol cols="12">
      <VAutocomplete
        v-model="formData.pembina_id"
        label="Guru"
        :error-messages="validationErrors.pembina_id"
        placeholder="Pilih Guru"
        :items="teacherList"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        v-model="formData.date"
        type="date"
        :error-messages="validationErrors.date"
        label="Tanggal"
      />
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VBtn
            color="primary"
            @click="
              () => {
                dialogSave.show();
              }
            "
          >
            <VIcon end icon="ri-add-fill" />
            Tambah Data
          </VBtn>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Pembina Upacara"
        path="jadwal-upacara"
        :with-actions="true"
        :headers="[
          {
            title: 'Pembina',
            key: 'pembina_name',
            sortable: false,
          },
          {
            title: 'Tanggal',
            key: 'date',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              label="Detail"
              size="small"
              @click="
                () => {
                  navigateTo(`/jadwal-upacara/${item.id}`);
                }
              "
            >
              <VIcon icon="ri-file-list-line" />
            </IconBtn>
            <IconBtn
              label="Edit"
              size="small"
              @click="
                () => {
                  const payload = { ...item };
                  payload.date = addDaysToDate(
                    convertToSimpleDate(payload.date),
                    1
                  );
                  dialogSave.show(payload, false);
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              label="Hapus"
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Surat Masuk',
                  message: `Anda yakin ingin menghapus Surat Masuk ${
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
    </VCol>
  </VRow>
</template>
