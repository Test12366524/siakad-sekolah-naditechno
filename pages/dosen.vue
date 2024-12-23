<script setup lang="ts">
import { VCol, VTextField, VTextarea } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();

const form = {
  nidn: "",
  nip: "",
  name: "",
  gender: "L",
  birthdate: "",
  place_of_birth: "",
  email: "",
  phone: "",
  address: "",
  photo: "",
};

onMounted(() => {
  useApi("auth/me").then(({ data }) => {
    useApi(`dosen/${data.role_id}`).then(({ data }) => {
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
    path="master/dosen"
    title="Tambah Dosen"
    detail-title="Detail Dosen"
    edit-title="Edit Dosen"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.nidn"
        :error-messages="validationErrors.nidn"
        label="NIDN"
        :readonly="isDetail"
      />
    </VCol>

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

    <VCol cols="12" md="6">
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
        v-model="formData.place_of_birth"
        :error-messages="validationErrors.place_of_birth"
        label="Tempat Lahir"
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
        title="Data Dosen"
        path="master/dosen"
        :with-actions="true"
        :headers="[
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
          {
            title: 'NIDN',
            key: 'nidn',
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
                  title: 'Hapus Dosen',
                  message: `Anda yakin ingin menghapus Dosen ${
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
