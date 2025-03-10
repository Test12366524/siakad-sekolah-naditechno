<script setup lang="ts">
import { ref } from "vue";
import { VCol, VTextField, VTextarea } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();

const form = ref({
  publish_by: "", // Will be filled automatically
  to: "",
  title: "",
  content: "",
  from_date: "",
  to_date: "",
  broadcast_to_whatsapp: "",
  status: "",
});

const list_to = ref([
  { id: "semua", text: "semua" },
  { id: "guru", text: "guru" },
  { id: "siswa", text: "siswa" },
]);

const user_id = ref<number | null>(null);
const user_name = ref<string | null>(null);

const role_id = ref();
const status_action = ref();
const roles = ref([]);

onMounted(() => {
  const { user } = useAuthStore();
  useApi(`level/pengumuman/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  });
  
  useApi("level/all").then(({ data }) => {
    roles.value = data;
  });
  user_id.value = Number(user.id);
  user_name.value = user.name;
  // Automatically set publish_by to user_id
  form.value.publish_by = user.id.toString();
  // Update list_to based on user's role
  if (user.role_id === 1) {
    status_action.value = user.role_id == 1;
    list_to.value = [
      { id: "semua", text: "semua" },
      { id: "guru", text: "guru" },
      { id: "siswa", text: "siswa" },
    ];
  } else if (user.role_id === 2) {
    status_action.value = user.role_id == 2;
    list_to.value = [
      { id: "siswa", text: "siswa" },
    ];
  } else if (user.role_id === 8) {
    status_action.value = user.role_id == 8;
    list_to.value = [
      { id: "semua", text: "semua" },
      { id: "guru", text: "guru" },
      { id: "siswa", text: "siswa" },
    ];
  } 

  role_id.value = user.role_id;
});

</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isDetail }"
    ref="dialogSave"
    path="announcement"
    title="Tambah Pengumuman"
    edit-title="Edit Pengumuman"
    detail-title="Detail Pengumuman"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="12">
        <VTextField
            v-model="user_name"
            label="Nama"
            :readonly="true"
        />
    </VCol>
    <VCol cols="12" md="12">
      <VTextField
        v-model="formData.title"
        :error-messages="validationErrors.title"
        label="Judul"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="12">
      <VTextarea
        v-model="formData.content"
        label="Deskripsi"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        type="date"
        v-model="formData.from_date"
        label="Tanggal Mulai"
        :readonly="isDetail"
      />
    </VCol>
    <VCol cols="12" md="6">
      <VTextField
        type="date"
        v-model="formData.to_date"
        label="Tanggal Berakhir"
        :readonly="isDetail"
      />
    </VCol>
    <VCol cols="12" md="12">
      <VAutocomplete
        v-model="formData.to"
        label="Ditujukan Kepada"
        :error-messages="validationErrors.to"
        placeholder="Pilih Ditujukan Kepada"
        :items="roles"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :readonly="isDetail"
      />
    </VCol>
    <VCol cols="12" md="6">
      <VLabel>Status Broadcast Whatsapp</VLabel>
      <VRadioGroup
        inline
        v-model="formData.broadcast_to_whatsapp"
        :error-messages="validationErrors.broadcast_to_whatsapp"
      >
        <VRadio label="Aktif" :value="1"></VRadio>
        <VRadio label="Nonaktif" :value="0"></VRadio>
      </VRadioGroup>
    </VCol>
    <VCol cols="12" md="6">
      <VLabel>Status</VLabel>
      <VRadioGroup
        inline
        v-model="formData.status"
        :error-messages="validationErrors.status"
      >
        <VRadio label="Draft" :value="0"></VRadio>
        <VRadio label="Publish" :value="1"></VRadio>
        <VRadio label="Unpublish" :value="2"></VRadio>
      </VRadioGroup>
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12" v-if="role_id == 1 || role_id == 2 || role_id == 8">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol cols="12" md="6">
              <VBtn color="primary" @click="dialogSave.show()">
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
        title="Data Pengumuman"
        path="announcement"
        :with-actions="status_action"
        :headers="[
          {
            title: 'Nama',
            key: 'publish_name',
            sortable: false,
          },
          {
            title: 'Judul',
            key: 'title',
            sortable: false,
          },
          {
            title: 'Tanggal Mulai',
            key: 'from_date',
            sortable: false,
          },
          {
            title: 'Tanggal Berakhir',
            key: 'to_date',
            sortable: false,
          },
          {
            title: 'Status',
            key: 'status_desc',
            sortable: false,
          },
          {
            title: 'Status Broadcast Whtasapp',
            key: 'broadcast_to_whatsapp_desc',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              size="small"
              title="Detail"
              @click="
                () => {
                  const payload = { ...item };
                  const from_date = new Date(payload.from_date);
                  from_date.setDate(from_date.getDate() + 1);
                  payload.from_date = formatFullDate(from_date).simpleDate;

                  const to_date = new Date(payload.to_date);
                  to_date.setDate(to_date.getDate() + 1);
                  payload.to_date = formatFullDate(to_date).simpleDate;
                  
                  dialogSave.show(payload, true);
                }
              "
            >
              <VIcon icon="ri-eye-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                () => {
                  const payload = { ...item };
                  const from_date = new Date(payload.from_date);
                  from_date.setDate(from_date.getDate() + 1);
                  payload.from_date = formatFullDate(from_date).simpleDate;

                  const to_date = new Date(payload.to_date);
                  to_date.setDate(to_date.getDate() + 1);
                  payload.to_date = formatFullDate(to_date).simpleDate;
                  dialogSave.show(payload);
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Pengumuman',
                  message: `Anda yakin ingin menghapus Pengumuman ${
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
