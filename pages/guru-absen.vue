<script setup lang="ts">
const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const form = ref({
  user_id: null,
  tanggal: "",
  jam_masuk: "",
  jam_keluar: "",
  kehadiran: "",
});

const teacherList = ref([]);

const getAllTeacher = async () => {
  useApi("user/all-").then(({ data }) => {
    console.log(data);
    teacherList.value = data;
  });
};

onMounted(() => {
  const { user } = useAuthStore();
//   useApi(`level/absen-guru/${user.role_id}`).then(({ data }) => {
//     if(data == 0){
//       navigateTo(`/not-authorized`);
//     }
//   });
  getAllTeacher();
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="absen-guru"
    title="Tambah Absen Guru"
    edit-title="Edit Absen Guru"
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
      />
    </VCol>

    <VCol cols="12" md="12">
        <VTextField
            v-model="formData.jam_masuk"
            type="time"
            :error-messages="validationErrors.jam_masuk"
            label="Jam Masuk"
        />
    </VCol>

    <VCol cols="12" md="12">
        <VTextField
            v-model="formData.jam_keluar"
            type="time"
            :error-messages="validationErrors.jam_keluar"
            label="Jam Keluar"
        />
    </VCol>

    <VCol cols="12" md="12">
      <VLabel>Kehadiran</VLabel>
      <VRadioGroup
        v-model="formData.kehadiran"
        inline
        :error-messages="validationErrors.kehadiran"
      >
        <VRadio label="Hadir" value="Hadir" />
        <VRadio label="Izin" value="Izin" />
        <VRadio label="Sakit" value="Sakit" />
        <VRadio label="Alpa" value="Alpa" />
      </VRadioGroup>
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
        title="Data Absen Guru"
        path="absen-guru"
        :with-actions="true"
        :headers="[
          {
            title: 'Guru',
            key: 'user_name',
            sortable: false,
          },
          {
            title: 'Tanggal',
            key: 'tanggal',
            sortable: false,
          },
          {
            title: 'Jam Masuk',
            key: 'jam_masuk',
            sortable: false,
          },
          {
            title: 'Jam Keluar',
            key: 'jam_keluar',
            sortable: false,
          },
          {
            title: 'Kehadiran',
            key: 'kehadiran',
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
