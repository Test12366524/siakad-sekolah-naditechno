<script setup lang="ts">
import { ref } from "vue";
import { VCol, VTextField, VTextarea } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();


const form = {
  name: "",
  description: "",
  image: "",
  publish_date: "",
  qty: "",
  status: 1,
};

const role_id = ref();
const status_action = ref();

onMounted(() => {
  const { user } = useAuthStore();
  useApi(`level/prasarana/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  });

  if (user.role_id == 1 || user.role_id == 2) status_action.value = true;
  else status_action.value = true;

});
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isDetail }"
    ref="dialogSave"
    width="1200"
    path="prasarana"
    title="Tambah Prasarana"
    edit-title="Edit Prasarana"
    detail-title="Detail Prasarana"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >

    <VCol cols="12" md="12">
      <VTextField
        v-model="formData.name"
        :error-messages="validationErrors.name"
        label="Nama"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="12" class="grid grid-cols-2">
      <FileInput
        v-model="formData.image"
        accept="image/*"
        label="Upload Gambar"
        small-chips
        chips
        show-preview
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="12">
      <VTextarea
        v-model="formData.description"
        :error-messages="validationErrors.description"
        label="Deskripsi"
        rows="2"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.qty"
        :error-messages="validationErrors.qty"
        label="Qty"
        :readonly="isDetail"
        type="number"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.publish_date"
        type="date"
        :error-messages="validationErrors.description"
        label="Tanggal"
        :readonly="isDetail"
      />
    </VCol>

    

    
  </SaveFileDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol cols="12" md="6">
              <VBtn
                color="primary"
                @click="dialogSave.show()"
              >
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
        title="Data Prasarana"
        path="prasarana"
        :with-actions="status_action"
        :headers="[
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
          {
            title: 'Deskripsi',
            key: 'description',
            sortable: false,
          },
          {
            title: 'Tanggal',
            key: 'publish_date',
            sortable: false,
          },
          {
            title: 'Jumlah',
            key: 'qty',
            sortable: false,
          },

        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              v-if="role_id == 1 || role_id == 2"
              size="small"
              title="Detail"
              @click="
                () => {
                  const payload = { ...item };
                  payload.publish_date = new Date(payload.publish_date)
                    .toISOString()
                    .substring(0, 10);
                  dialogSave.show(payload, true);
                }
              "
            >
              <VIcon icon="ri-eye-line" />
            </IconBtn>
            <IconBtn
              v-if="role_id == 1"
              size="small"
              title="Edit"
              @click="
                () => {
                  const payload = { ...item };
                  payload.publish_date = new Date(payload.publish_date)
                    .toISOString()
                    .substring(0, 10);
                  dialogSave.show(payload);
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              v-if="role_id == 1"
              size="small"
              title="Hapus"
              @click="
                confirmDialog.show({
                  title: 'Hapus Prasarana',
                  message: `Anda yakin ingin menghapus Prasarana ${
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
