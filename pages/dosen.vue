<script setup lang="ts">
import { VCol, VTextarea, VTextField } from "vuetify/lib/components/index.mjs";

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
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isDetail }"
    ref="dialogSave"
    path="master/dosen"
    title="Tambah Dosen"
    edit-title="Edit Dosen"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.nidn"
        :error-messages="validationErrors.nidn"
        label="NIDN"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.nip"
        :error-messages="validationErrors.nip"
        label="NIP"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.name"
        :error-messages="validationErrors.name"
        label="Nama"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VLabel>Jenis Kelamin</VLabel>
      <VRadioGroup
        v-model="formData.gender"
        inline
        :error-messages="validationErrors.gender"
        :disabled="isDetail"
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
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.place_of_birth"
        :error-messages="validationErrors.place_of_birth"
        label="Tempat Lahir"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.email"
        type="email"
        :error-messages="validationErrors.email"
        label="Email"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.phone"
        :error-messages="validationErrors.phone"
        label="No. Handphone"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="12">
      <VTextarea
        v-model="formData.address"
        :error-messages="validationErrors.address"
        label="Alamat"
        :disabled="isDetail"
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
        :disabled="isDetail"
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
              @click="dialogSave.show({ ...item }, true)"
            >
              <VIcon icon="ri-eye-line" />
            </IconBtn>
            <IconBtn size="small" @click="dialogSave.show({ ...item })">
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
