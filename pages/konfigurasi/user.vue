<script setup lang="ts">
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const roles = ref();

const form = {
  role_id: undefined,
  name: "",
  email: "",
  phone_number: "",
  password: "",
  password_confirmation: "",
  status: 1,
};

onMounted(() => {
  const { user } = useAuthStore();
  useApi(`level/konfigurasi-user/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  });
  useApi("level/all").then(({ data }) => {
    roles.value = data;
  });
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="user"
    title="Tambah User"
    edit-title="Edit User"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="6">
      <VAutocomplete
        v-model="formData.role_id"
        label="User Role"
        density="compact"
        :error-messages="validationErrors.role_id"
        placeholder="Pilih role"
        :items="roles"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="6">
      <VTextField
        :error-messages="validationErrors.name"
        v-model="formData.name"
        label="Nama Lengkap"
      />
    </VCol>


    <VCol cols="6">
      <VTextField
        :error-messages="validationErrors.email"
        v-model="formData.email"
        label="Email"
      />
    </VCol>

    <VCol cols="6">
      <VTextField
        type="number"
        :error-messages="validationErrors.phone_number"
        v-model="formData.phone_number"
        label="Nomor HP"
      />
    </VCol>

    <VCol cols="6">
      <VTextField
        type="password"
        :error-messages="validationErrors.password"
        v-model="formData.password"
        :label="isEditing ? 'Update Password' : 'Password'"
      />
      <span v-if="isEditing" class="py-1 px-1"
        >Isi jika ingin mengganti password</span
      >
    </VCol>

    <VCol cols="6">
      <VTextField
        type="password"
        :error-messages="validationErrors.password_confirmation"
        v-model="formData.password_confirmation"
        label="Confirm Password"
        :rules="[
          confirmedValidator(formData.password, formData.password_confirmation),
        ]"
      />
    </VCol>
    
    <VCol cols="12">
      <VLabel>Status</VLabel>
      <VRadioGroup
        inline
        v-model="formData.status"
        :error-messages="validationErrors.status"
      >
        <VRadio label="Aktif" :value="1"></VRadio>
        <VRadio label="Nonaktif" :value="0"></VRadio>
      </VRadioGroup>
    </VCol>

  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VBtn @click="dialogSave.show()" color="primary">
            <VIcon end icon="ri-add-fill" />
            Tambah Data
          </VBtn>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data User"
        path="user"
        :with-actions="true"
        :headers="[
          {
            title: 'Nama Lengkap',
            key: 'name',
            sortable: false,
          },
          {
            title: 'Email',
            key: 'email',
            sortable: false,
          },
          {
            title: 'Role',
            key: 'role_name',
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
              @click="
                dialogSave.show({
                  ...item,
                  status_desc: undefined,
                  cabang_name: undefined,
                  departement_name: undefined,
                  role_name: undefined,
                  password: undefined,
                })
              "
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus user',
                  message: `Anda yakin ingin menghapus user ${
                    (item as any).name || (item as any).name
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
