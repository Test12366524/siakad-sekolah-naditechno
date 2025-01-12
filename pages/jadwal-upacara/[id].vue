<script setup lang="ts">
const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const route = useRoute();

const jadwalUpacaraId = computed(() => route.params.id);

const form = ref({
  jadwal_upacara_id: jadwalUpacaraId.value, // guruid
  guru_id: null,
});

const teacherList = ref([]);

const getAllTeacher = async () => {
  useApi("master/guru/all").then(({ data }) => {
    teacherList.value = data;
  });
};

onMounted(() => {
  const { user } = useAuthStore();

  if (user.role_id !== 1) return navigateTo(`/not-authorized`);

  getAllTeacher();
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="jadwal-upacara-detail"
    title="Tambah Kehadiran Upacara"
    edit-title="Edit Kehadiran Upacara"
    :default-form="form"
    :request-form="form"
    :refresh-callback="tableRef.refresh"
    width="600"
  >
    <VCol cols="12">
      <VAutocomplete
        v-model="formData.guru_id"
        label="Guru"
        :error-messages="validationErrors.guru_id"
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

    <VCol cols="12" v-if="jadwalUpacaraId">
      <AppTable
        ref="tableRef"
        title="Daftar Hadir Guru"
        path="jadwal-upacara-detail"
        :jadwal_upacara_id="jadwalUpacaraId"
        :with-actions="true"
        :headers="[
          {
            title: 'Tanggal',
            key: 'jadwal_upacara_date',
            sortable: false,
          },
          {
            title: 'Pembina',
            key: 'pembina_name',
            sortable: false,
          },
          {
            title: 'Guru',
            key: 'guru_name',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
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
