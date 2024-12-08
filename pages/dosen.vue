<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();

const form = {
  name: "",
  nidn: "",
  nip: "",
  email_1: "",
  email_2: "",
  phone_1: "",
  phone_2: "",
  profile_sinta: "",
  profilegoogle_scholar: "",
  join_date: "",
  profile_scopus: "",
};

</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="master/dosen"
    title="Tambah Dosen"
    edit-title="Edit Dosen"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.name"
        v-model="formData.name"
        label="Nama"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.nidn"
        v-model="formData.nidn"
        label="NIDN"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.nip"
        v-model="formData.nip"
        label="NIP"
      />
    </VCol>
    
    <VCol cols="12" md="6">
      <VTextField
        type="date"
        :error-messages="validationErrors.join_date"
        v-model="formData.join_date"
        label="Tanggal Masuk"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        type="email"
        :error-messages="validationErrors.email_1"
        v-model="formData.email_1"
        label="Email 1"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        type="email"
        :error-messages="validationErrors.email_2"
        v-model="formData.email_2"
        label="Email 2"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.phone_1"
        v-model="formData.phone_1"
        label="No. HP 1"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.phone_2"
        v-model="formData.phone_2"
        label="No. HP 2"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.profile_sinta"
        v-model="formData.profile_sinta"
        label="Profile Sinta"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.profilegoogle_scholar"
        v-model="formData.profilegoogle_scholar"
        label="Profile Google Scholar"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.profile_scopus"
        v-model="formData.profile_scopus"
        label="Profile Scopus"
      />
    </VCol>
    
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol>
              <VBtn @click="dialogSave.show()" color="primary">
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
            key: 'email_1',
            sortable: false,
          },
          {
            title: 'No. Handphone',
            key: 'phone_1',
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
              @click="dialogSave.show({ ...item })"
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus Dosen',
                  message: `Anda yakin ingin menghapus Dosen ${
                    (item as any).name
                  }?`,
                  onConfirm: () => remove((item as any).id),
                })
              "
              size="small"
            >
              <VIcon icon="ri-delete-bin-line" />
            </IconBtn>
          </div>
        </template>
      </AppTable>
    </VCol>
  </VRow>
</template>
