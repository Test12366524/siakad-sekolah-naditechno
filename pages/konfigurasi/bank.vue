<script setup lang="ts">
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const status = ref([
  { id: 1, name: "Aktif" },
  { id: 0, name: "Tidak Aktif" },
]);

const bankForm = {
  bank_name: "",
  name: "",
  account_no: "",
  status: "",
};

</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="master/bank"
    title="Form Bank"
    edit-title="Form Bank"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="bankForm"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12">
      <VTextField
        :rules="[requiredValidator]"
        :error-messages="validationErrors.bank_name"
        v-model="formData.bank_name"
        label="Bank"
      />
    </VCol>
    <VCol cols="12">
      <VTextField
        :rules="[requiredValidator]"
        :error-messages="validationErrors.name"
        v-model="formData.name"
        label="Nama"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        :rules="[requiredValidator]"
        :error-messages="validationErrors.account_no"
        v-model="formData.account_no"
        label="Nomor Rekening"
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
        title="Data Bank"
        path="master/bank"
        :with-actions="true"
        :headers="[
          {
            title: 'Bank',
            key: 'bank_name',
            sortable: false,
          },
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
          {
            title: 'Nomor Rekening',
            key: 'account_no',
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
              @click="dialogSave.show({ ...item, status_desc: undefined })"
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Delete bank',
                  message: `Are you sure want to delete bank ${
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
