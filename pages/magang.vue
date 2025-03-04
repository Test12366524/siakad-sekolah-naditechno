<script setup lang="ts">
import { VTextField } from 'vuetify/lib/components/index.mjs';

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const form = ref({
  siswa_id: null, // guruid
  guru_id: null, // guruid
  tanggal: "",
  perusahaan: "",
  catatan: "",
});

const studentList = ref([]);
const teacherList = ref([]);

const getAllStudent = async () => {
  useApi("siswa/all").then(({ data }) => {
    studentList.value = data;
  });
};

const getAllTeacher = async () => {
  useApi("master/guru/all").then(({ data }) => {
    teacherList.value = data;
  });
};

const role_id = ref();
const actions = ref();
onMounted(() => {
  const { user } = useAuthStore();
  role_id.value = user.role_id;
  if(user.role_id == 1){
    actions.value = true;
  }else if(user.role_id == 2){
    actions.value = true;
  }else if(user.role_id == 12){
    actions.value = true;
  }else{
    actions.value = false;
  }
//   useApi(`level/magang/${user.role_id}`).then(({ data }) => {
//     if(data == 0){
//       navigateTo(`/not-authorized`);
//     }
//   });
  getAllStudent();
  getAllTeacher();
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="magang"
    title="Tambah Magang Siswa"
    edit-title="Edit Magang Siswa"
    :default-form="form"
    :request-form="form"
    :refresh-callback="tableRef.refresh"
    width="600"
  >
    <VCol cols="12">
      <VAutocomplete
        v-model="formData.siswa_id"
        label="Siswa"
        :error-messages="validationErrors.siswa_id"
        placeholder="Pilih Siswa"
        :items="studentList"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

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

    <VCol cols="12">
      <VTextField
        v-model="formData.tanggal"
        type="date"
        :error-messages="validationErrors.tanggal"
        label="Tanggal"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        v-model="formData.perusahaan"
        :error-messages="validationErrors.perusahaan"
        label="Perusahaan"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        v-model="formData.catatan"
        :error-messages="validationErrors.catatan"
        label="Catatan"
      />
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12" v-if="role_id == 1 || role_id == 2 || role_id == 12">
      <VCard>
        <VCardItem>
          <VBtn
            color="primary"
            @click="
              () => {
                dialogSave.show();
              }
            "
            style="margin-right: 10px;"
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
        title="Data Magang Siswa"
        path="magang"
        :with-actions="actions"
        :headers="[
          {
            title: 'Siswa',
            key: 'siswa_name',
            sortable: false,
          },
          {
            title: 'Guru',
            key: 'guru_name',
            sortable: false,
          },
          {
            title: 'Tanggal',
            key: 'tanggal',
            sortable: false,
          },
          {
            title: 'Perusahaan',
            key: 'perusahaan',
            sortable: false,
          },
          {
            title: 'Catatan',
            key: 'catatan',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1" v-if="role_id == 1 || role_id == 2 || role_id == 12">
            <IconBtn
              title="Catatan Harian"
              size="small"
              @click="
                () => {
                  navigateTo(`/magang-harian?id=${item.id}`);
                }
              "
            >
              <VIcon icon="ri-file-list-2-line" />
            </IconBtn>
            <IconBtn
              label="Edit"
              size="small"
              @click="
                () => {
                  const payload = { ...item };
                  const tanggal = new Date(payload.tanggal);
                  tanggal.setDate(tanggal.getDate() + 1);
                  payload.tanggal = formatFullDate(tanggal).simpleDate;
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
                  title: 'Hapus Magang',
                  message: `Anda yakin ingin menghapus Magang ${
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
