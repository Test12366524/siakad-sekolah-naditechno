<script setup lang="ts">
import { VTextField } from 'vuetify/lib/components/index.mjs';

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();
const { user } = useAuthStore();
const role_id = ref(null);
const form = ref({
  nominal: "",
  status: "0",
});

const today = new Date();
const tahun = String(today.getFullYear());
const bulan = String(today.getMonth() + 1).padStart(2, '0');

onMounted(() => {
  const roleId = Number(user.role_id);
  // useApi(`level/spp/${user.role_id}`).then(({ data }) => {
  //   if(data == 0){
  //     navigateTo(`/not-authorized`);
  //   }
  // });
});

const bayar = async (item: any) => {

  const request = {
    status: 1,
  };

  const url = "spp/pay-spp/" + item.id;

  const { errors, success } = await useApi(url, {
    withNotif: true,
    method: "PUT",
    data: request,
  });

  if (success) {
    tableRef.value.refresh();
  }
};

</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="spp/create-many"
    title="Tambah SPP"
    edit-title="Edit SPP"
    :default-form="form"
    :request-form="form"
    :refresh-callback="tableRef.refresh"
    action-btn-text="Submit"
    width="600"
  >
    <VCol cols="12">
      <CurrencyInput
        v-model="formData.nominal"
        label="Tagihan"
      />
    </VCol>
    <VCol cols="6">
      <VTextField
        v-model="tahun"
        label="Tahun"
        readonly
      />
    </VCol>
    <VCol cols="6">
      <VTextField
        v-model="bulan"
        label="Bulan"
        readonly
      />
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
        title="Data SPP"
        path="spp"
        :with-actions="true"
        :headers="[
          {
            title: 'Tahun-Bulan',
            key: 'tahun_bulan',
            sortable: false,
          },
          {
            title: 'Siswa',
            key: 'siswa_name',
            sortable: false,
          },
          {
            title: 'Tagihan',
            key: 'tagihan',
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
              v-if="item.status == 0"
              label="Bayar"
              title="Bayar"
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Bayar',
                  message: `Anda yakin ingin submit bayar ${
                    (item as any).name
                  }?`,
                  onConfirm: () => bayar(item),
                })
              "
            >
              <VIcon icon="ri-check-line" />
            </IconBtn>
            <IconBtn
              label="Edit"
              size="small"
              v-if="item.status == 0"
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
              v-if="item.status == 0"
              @click="
                confirmDialog.show({
                  title: 'Hapus SPP',
                  message: `Anda yakin ingin menghapus SPP ${
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
