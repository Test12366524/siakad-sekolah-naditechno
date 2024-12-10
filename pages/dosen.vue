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
        v-model="formData.name"
        :error-messages="validationErrors.name"
        label="Nama"
        :disabled="isDetail"
      />
    </VCol>

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
        v-model="formData.join_date"
        type="date"
        :error-messages="validationErrors.join_date"
        label="Tanggal Masuk"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.email_1"
        type="email"
        :error-messages="validationErrors.email_1"
        label="Email 1"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.email_2"
        type="email"
        :error-messages="validationErrors.email_2"
        label="Email 2"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.phone_1"
        :error-messages="validationErrors.phone_1"
        label="No. HP 1"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.phone_2"
        :error-messages="validationErrors.phone_2"
        label="No. HP 2"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.profile_sinta"
        :error-messages="validationErrors.profile_sinta"
        label="Profile Sinta"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.profilegoogle_scholar"
        :error-messages="validationErrors.profilegoogle_scholar"
        label="Profile Google Scholar"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.profile_scopus"
        :error-messages="validationErrors.profile_scopus"
        label="Profile Scopus"
        :disabled="isDetail"
      />
    </VCol>
  </SaveDialog>

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
