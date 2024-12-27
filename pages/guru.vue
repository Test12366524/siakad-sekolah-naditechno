<script setup lang="ts">
import { VCol, VTextField, VTextarea } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();

const form = {
  nik: "",
  nuptk: "",
  nip: "",
  name: "",
  gender: "L",
  birthdate: "",
  place_of_birth: "",
  email: "",
  phone: "",
  address: "",
  pendidikan_terakhir: "",
  tugas_tambahan_1: "",
  tugas_tambahan_2: "",
  tugas_tambahan_3: "",
  photo: "",
};

onMounted(() => {
  useApi("auth/me").then(({ data }) => {
    useApi(`guru/${data.role_id}`).then(({ data }) => {
      if(data == 0){
        navigateTo(`/not-authorized`);
      }
    });
  });
});
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isDetail }"
    ref="dialogSave"
    path="master/guru"
    title="Tambah Guru"
    detail-title="Detail Guru"
    edit-title="Edit Guru"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.nip"
        :error-messages="validationErrors.nip"
        label="NIP"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.nik"
        :error-messages="validationErrors.nik"
        label="NIK"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.nuptk"
        :error-messages="validationErrors.nuptk"
        label="NUPTK"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.name"
        :error-messages="validationErrors.name"
        label="Nama"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VLabel>Jenis Kelamin</VLabel>
      <VRadioGroup
        v-model="formData.gender"
        inline
        :error-messages="validationErrors.gender"
        :readonly="isDetail"
      >
        <VRadio label="Laki-laki" value="L" />
        <VRadio label="Perempuan" value="P" />
      </VRadioGroup>
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.place_of_birth"
        :error-messages="validationErrors.place_of_birth"
        label="Tempat Lahir"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.birth_date"
        type="date"
        :error-messages="validationErrors.birth_date"
        label="Tanggal Lahir"
        :readonly="isDetail"
      />
    </VCol>


    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.email"
        type="email"
        :error-messages="validationErrors.email"
        label="Email"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.phone"
        :error-messages="validationErrors.phone"
        label="No. Handphone"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="12">
      <VTextarea
        v-model="formData.address"
        :error-messages="validationErrors.address"
        label="Alamat"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.pendidikan_terakhir"
        :error-messages="validationErrors.pendidikan_terakhir"
        label="Pendidikan Terakhir"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.tugas_tambahan_1"
        :error-messages="validationErrors.tugas_tambahan_1"
        label="Tugas Tambahan 2"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.tugas_tambahan_2"
        :error-messages="validationErrors.tugas_tambahan_2"
        label="Tugas Tambahan 2"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.tugas_tambahan_3"
        :error-messages="validationErrors.tugas_tambahan_3"
        label="Tugas Tambahan 3"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="12" class="grid grid-cols-2">
      <FileInput
        v-model="formData.photo"
        accept="image/*"
        label="Upload Foto"
        small-chips
        chips
        show-preview
        :readonly="isDetail"
      />
    </VCol>
  </SaveFileDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol>
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
        title="Data Guru"
        path="master/guru"
        :with-actions="true"
        :headers="[
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
          {
            title: 'NIK',
            key: 'nik',
            sortable: false,
          },
          {
            title: 'NIP',
            key: 'nip',
            sortable: false,
          },
          {
            title: 'Email',
            key: 'email',
            sortable: false,
          },
          {
            title: 'No. Handphone',
            key: 'phone',
            sortable: false,
          },
          {
            title: 'Tanggal Masuk',
            key: 'join_date',
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
                  payload.birth_date = formatFullDate(
                    payload.birth_date
                  ).simpleDate;
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
                  payload.birth_date = formatFullDate(
                    payload.birth_date
                  ).simpleDate;
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
                  title: 'Hapus Guru',
                  message: `Anda yakin ingin menghapus Guru ${
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
