<script setup lang="ts">
import { VTextarea, VTextField } from 'vuetify/lib/components/index.mjs';

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();
const { user } = useAuthStore();
const role_id = ref(null);
const form = ref({
  user_id: "",
  type: "",
  content: "",
  status: "0",
});
const isAttendanceIn = ref(true);

const userList = ref([]);

const getAllUser = async () => {
  useApi("user/all-user").then(({ data }) => {
    userList.value = data;
  });
};

onMounted(() => {
  const roleId = Number(user.role_id);
  // useApi(`level/e-form/${user.role_id}`).then(({ data }) => {
  //   if(data == 0){
  //     navigateTo(`/not-authorized`);
  //   }
  // });
  if(user.role_id == 3){
    form.value.user_id = user.id;
  }
  getAllUser();
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="e-form"
    title="Tambah E-Form"
    edit-title="Edit E-Form"
    :default-form="form"
    :request-form="form"
    :refresh-callback="tableRef.refresh"
    action-btn-text="Submit"
    width="600"
  >
    <VCol cols="12" v-if="user.role_id == 1">
      <VAutocomplete
        v-model="formData.user_id"
        label="Siswa"
        :error-messages="validationErrors.user_id"
        placeholder="Pilih Siswa"
        :items="userList"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
    <VCol cols="12" v-if="user.role_id == 3">
      <VTextField
        v-model="user.name"
        label="Siswa"
        readonly
      />
    </VCol>
    <VCol cols="12">
      <VTextarea
        v-model="formData.content"
        :error-messages="validationErrors.content"
        label="Keterangan"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VLabel>Tipe</VLabel>
      <VRadioGroup
        v-model="formData.type"
        inline
        :error-messages="validationErrors.type"
      >
        <VRadio label="Izin" value="Izin" />
        <VRadio label="Saran" value="Saran" />
      </VRadioGroup>
    </VCol>

    <VCol cols="12" md="6" v-if="user.role_id == 1">
      <VLabel>Status</VLabel>
      <VRadioGroup
        v-model="formData.status"
        inline
        :error-messages="validationErrors.status"
      >
        <VRadio label="Pending" value="0" />
        <VRadio label="Disetujui" value="1" />
        <VRadio label="Ditolak" value="2" />
      </VRadioGroup>
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VBtn
            color="primary"
            style="margin-right: 10px;"
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
        title="Data E-Form"
        path="e-form"
        :with-actions="true"
        :headers="[
          {
            title: 'Siswa',
            key: 'user_name',
            sortable: false,
          },
          {
            title: 'Tanggal',
            key: 'created_at',
            sortable: false,
          },
          {
            title: 'Tipe',
            key: 'type',
            sortable: false,
          },
          {
            title: 'Keterangan',
            key: 'content',
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
              label="Edit"
              size="small"
              @click="
                () => {
                  const payload = { ...item };
                  payload.status = item.status.toString();
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
                  title: 'Hapus E-Form',
                  message: `Anda yakin ingin menghapus E-Form ${
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
