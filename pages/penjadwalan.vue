<script setup lang="ts">
const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();
const periode = ref();
const filter_periode = ref();

const form = ref({
  guru_id: null,
  mata_pelajaran_id: null,
  semester_id: null,
  periode_id: null,
  hari: "0", // 0 sampe 6
  dari_jam: null,
  ke_jam: null,
  jumlah_jam: null,
  status: 1, // 0 atau 1
});

const teacherList = ref([]);
const mataPelajaranList = ref([]);
const semesterList = ref([]);
const filterSemesterList = ref([]);

const semester_id = ref<number | null>(null);
const periode_id = ref<number | null>(null);

const dayList = ref([
  { id: "0", text: "Senin" },
  { id: "1", text: "Selasa" },
  { id: "2", text: "Rabu" },
  { id: "3", text: "Kamis" },
  { id: "4", text: "Jumat" },
  { id: "5", text: "Sabtu" },
  { id: "6", text: "Minggu" },
]);

const getAllTeacher = async () => {
  useApi("master/guru/all").then(({ data }) => {
    teacherList.value = data;
  });
};

const getAllMataPelajaran = async () => {
  useApi("master/mata-pelajaran/all").then(({ data }) => {
    mataPelajaranList.value = data;
  });
};

const getAllSemester = async () => {
  useApi("master/semester/all/1").then(({ data }) => {
    semesterList.value = data;
  });

  useApi("master/semester/all/0").then(({ data }) => {
    filterSemesterList.value = data;
  });
};

useApi("master/periode/all/1").then(({ data }) => {
  periode.value = data;
});

useApi("master/periode/all/0").then(({ data }) => {
  filter_periode.value = data;
});

const handleExportPdf = (item) => {
  const payload = { ...item };

  console.log(payload);
};

const role_id = ref();
const status_action = ref();

onMounted(() => {
  getAllTeacher();
  getAllMataPelajaran();
  getAllSemester();

  const { user } = useAuthStore();
  useApi(`level/penjadwalan/${user.role_id}`).then(({ data }) => {
    if (data == 0) {
      navigateTo(`/not-authorized`);
    }
  });

  role_id.value = user.role_id;
  console.log("role_id", user.role_id);
  status_action.value = user.role_id === 1 || user.role_id === 6
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing, isDetail }"
    ref="dialogSave"
    path="jadwal-mata-pelajaran"
    title="Tambah Jadwal Guru"
    edit-title="Edit Jadwal Guru"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    :request-form="form"
    width="900"
  >
    <VCol cols="12" md="6">
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
        density="compact"
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
        :readonly="isDetail"
        density="compact"
      />
    </VCol>
    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.semester_id"
        label="Semester"
        :error-messages="validationErrors.semester_id"
        placeholder="Pilih Semester"
        :items="semesterList"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :readonly="isDetail"
        density="compact"
      />
    </VCol>
    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.periode_id"
        label="Periode"
        :error-messages="validationErrors.periode_id"
        placeholder="Pilih Periode"
        :items="periode"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :readonly="isDetail"
        density="compact"
      />
    </VCol>
    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.hari"
        label="Hari"
        density="compact"
        :error-messages="validationErrors.hari"
        placeholder="Pilih Hari"
        :items="dayList"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.dari_jam"
        type="time"
        :error-messages="validationErrors.dari_jam"
        label="Jam Mulai"
        density="compact"
      />
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.ke_jam"
        type="time"
        :error-messages="validationErrors.ke_jam"
        label="Jam Selesai"
        density="compact"
      />
    </VCol>

    <VCol cols="6">
      <VTextField
        v-model="formData.jumlah_jam"
        type="number"
        :error-messages="validationErrors.jumlah_jam"
        label="Jumlah Jam"
        density="compact"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VLabel>Status</VLabel>
      <VRadioGroup
        v-model="formData.status"
        inline
        :error-messages="validationErrors.status"
      >
        <VRadio label="Aktif" :value="1" />
        <VRadio label="Nonaktif" :value="0" />
      </VRadioGroup>
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol cols="12" md="6">
              <VBtn
                v-if="role_id === 1 || role_id === 6"
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
            </VCol>
            <VCol cols="12" md="2" style="margin-block-start: 5px"> </VCol>
            <VCol cols="12" md="2" style="margin-block-start: 5px">
              <VAutocomplete
                v-model="periode_id"
                label="Tahun Ajaran"
                placeholder="Pilih Tahun Ajaran"
                :items="filter_periode"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="12" md="2" style="margin-block-start: 5px">
              <VAutocomplete
                v-model="semester_id"
                label="Semester"
                placeholder="Pilih Semester"
                :items="filterSemesterList"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Jadwal Guru"
        path="jadwal-mata-pelajaran"
        :with-actions="status_action"
        :periode_id="periode_id"
        :semester_id="semester_id"
        :headers="[
          {
            title: 'Guru',
            key: 'guru_name',
            sortable: false,
          },
          {
            title: 'Mata Pelajaran',
            key: 'mata_pelajaran_name',
            sortable: false,
          },
          {
            title: 'Semester',
            key: 'semester_name',
            sortable: false,
          },
          {
            title: 'Tahun Ajar',
            key: 'periode_name',
            sortable: false,
          },
          {
            title: 'Waktu',
            key: 'waktu',
            sortable: false,
          },
          {
            title: 'Jumlah Jam',
            key: 'jumlah_jam',
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
                  payload.hari = payload.hari.toString();
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
