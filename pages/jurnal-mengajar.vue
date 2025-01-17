<script setup lang="ts">
const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const form = ref({
  user_id: null,
  tanggal: "",
  jam_mulai: "",
  jam_selesai: "",
  materi: "",
  catatan: "",
  photo: "",
});
const previewPhoto = ref(null);

const teacherList = ref([]);

const getAllTeacher = async () => {
  useApi("user/all-guru").then(({ data }) => {
    console.log(data);
    teacherList.value = data;
  });
};

const isAttendanceIn = ref(true);
const role_id = ref(null);

onMounted(() => {
  const { user } = useAuthStore();
  role_id.value = user.role_id;
  useApi(`level/jurnal-mengajar/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  });

  if(user.role_id == 2){
    form.value.user_id = user.id;
  }else{
    getAllTeacher();
  }
});
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    width="1200"
    ref="dialogSave"
    path="jurnal-mengajar"
    :title="role_id === 2 ? 'Mulai Mengajar' : 'Tambah Jurnal Mengajar'"
    :edit-title="role_id === 2 ? 'Selesai Mengajar' : 'Edit Jurnal Mengajar'"
    :default-form="form"
    :request-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="3">
      <VCol cols="12">
        <VImg
          class="mb-3"
          rounded
          border
          max-height="300"
          :src="
            previewPhoto ||
            'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
          "
        />
        <FileInput
          v-model="formData.photo"
          accept="image/*"
          label="Upload Foto"
          @change="(data) => (previewPhoto = data.previewImageUrl)"
        />
      </VCol>
    </VCol>
    <VCol cols="12" md="9">
      <VRow>
        <VCol cols="12" md="12" v-if="role_id === 1">
          <VAutocomplete
            v-model="formData.user_id"
            label="Guru"
            :error-messages="validationErrors.user_id"
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
            v-model="formData.tanggal"
            type="date"
            :error-messages="validationErrors.tanggal"
            label="Tanggal"
            :readonly="role_id === 2"
          />
        </VCol>

        <VCol cols="12" md="12" v-if="role_id === 2 ? isAttendanceIn : true">
          <VTextField
            v-model="formData.jam_mulai"
            type="time"
            :error-messages="validationErrors.jam_mulai"
            label="Jam Mulai"
            :readonly="role_id === 2"
          />
        </VCol>

        <VCol cols="12" md="12" v-if="role_id === 2 ? !isAttendanceIn : true">
          <VTextField
            v-model="formData.jam_selesai"
            type="time"
            :error-messages="validationErrors.jam_selesai"
            label="Jam Selesai"
          />
        </VCol>

        <VCol cols="12" md="12">
          <VTextField
            v-model="formData.materi"
            :error-messages="validationErrors.materi"
            label="Materi"
          />
        </VCol>

        <VCol cols="12" md="12">
          <VTextField
            v-model="formData.catatan"
            :error-messages="validationErrors.catatan"
            label="Catatan"
          />
        </VCol>
      </VRow>
    </VCol>
  </SaveFileDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VBtn
            color="primary"
            @click="
              () => {
                if (role_id === 2) {
                  isAttendanceIn = true;
                  form.tanggal = formatFullDate(new Date()).localDateNow;
                  form.jam_mulai = formatFullDate(new Date()).localTimeNow;
                }
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
        title="Data Jurnal Mengajar"
        path="jurnal-mengajar"
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
            title: 'Jam Mulai',
            key: 'jam_mulai',
            sortable: false,
          },
          {
            title: 'Jam Selesai',
            key: 'jam_selesai',
            sortable: false,
          },
          {
            title: 'Materi',
            key: 'materi',
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
          <div class="d-flex gap-1">
            <IconBtn
              label="Edit"
              size="small"
              @click="
                () => {
                  const payload = { ...item };
                  payload.tanggal = formatFullDate(payload.tanggal).simpleDate;
                  if (role_id === 2) {
                    isAttendanceIn = false;

                    payload.jam_selesai = formatFullDate(
                      new Date()
                    ).localTimeNow;
                  }
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
