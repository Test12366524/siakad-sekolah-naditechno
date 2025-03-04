<script setup lang="ts">
import { VTextarea, VTextField } from 'vuetify/lib/components/index.mjs';

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();
const { user } = useAuthStore();
const role_id = ref(null);
const form = ref({
  type: "",
  name: "",
  nomor: "",
  phone_number: "",
  tujuan: "",
  status: "0",
});

onMounted(() => {
  const roleId = Number(user.role_id);
  // useApi(`level/buku-tamu/${user.role_id}`).then(({ data }) => {
  //   if(data == 0){
  //     navigateTo(`/not-authorized`);
  //   }
  // });
});

const keluar = async (item: any) => {
  

  const request = {
    type: item.type,
    name: item.name,
    phone_number: item.phone_number,
    tujuan: item.tujuan,
    waktu_masuk: item.waktu_masuk,
    waktu_keluar: new Date,
  };

  const url = "buku-tamu/keluar/" + item.id;

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
    path="buku-tamu"
    title="Tambah Buku Tamu"
    edit-title="Edit Buku Tamu"
    :default-form="form"
    :request-form="form"
    :refresh-callback="tableRef.refresh"
    action-btn-text="Submit"
    width="600"
  >
    <VCol cols="12">
      <VTextField
        v-model="formData.name"
        label="Nama Lengkap"
      />
    </VCol>
    <VCol cols="12">
      <VTextField
        v-model="formData.nomor"
        label="Nomor Identitas (KTP / SIM / NIM / Dll)"
      />
    </VCol>
    <VCol cols="12">
      <VTextField
        v-model="formData.phone_number"
        label="No. Telpon"
      />
    </VCol>
    <VCol cols="12">
      <VTextField
        v-model="formData.asal_instansi"
        label="Asal Instansi"
      />
    </VCol>
    <VCol cols="12">
      <VTextField
        v-model="formData.jabatan"
        label="Jabatan"
      />
    </VCol>
    <VCol cols="12">
      <VTextField
        v-model="formData.nomor_surat_tugas"
        label="Nomor Surat Tugas"
      />
    </VCol>
    <VCol cols="12">
      <VTextarea
        v-model="formData.tujuan"
        :error-messages="validationErrors.tujuan"
        label="Tujuan Kedatangan"
      />
    </VCol>

    <VCol cols="12" md="12">
      <VLabel>Tipe</VLabel>
      <VRadioGroup
        v-model="formData.type"
        inline
        :error-messages="validationErrors.type"
      >
        <VRadio label="Orang Tua" value="Orang Tua" />
        <VRadio label="Alumni" value="Alumni" />
        <VRadio label="Dinas" value="Dinas" />
        <VRadio label="Ormit" value="Ormit" />
        <VRadio label="Komite" value="Komite" />
        <VRadio label="Pihak Eksternal" value="Pihak Eksternal" />
        <VRadio label="Dll" value="Dll" />
      </VRadioGroup>
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
        title="Data Buku Tamu"
        path="buku-tamu"
        :with-actions="true"
        :headers="[
          {
            title: 'Tipe',
            key: 'type',
            sortable: false,
          },
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
          {
            title: 'Nomor Identitas',
            key: 'nomor',
            sortable: false,
          },
          {
            title: 'Tujuan',
            key: 'tujuan',
            sortable: false,
          },
          {
            title: 'Waktu Masuk',
            key: 'waktu_masuk',
            sortable: false,
          },
          {
            title: 'Waktu Keluar',
            key: 'waktu_keluar',
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
              label="Keluar"
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Keluar',
                  message: `Anda yakin ingin submit keluar ${
                    (item as any).name
                  }?`,
                  onConfirm: () => keluar(item),
                })
              "
            >
              <VIcon icon="ri-check-line" />
            </IconBtn>
            <IconBtn
              label="Edit"
              size="small"
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
              @click="
                confirmDialog.show({
                  title: 'Hapus Buku Tamu',
                  message: `Anda yakin ingin menghapus Buku Tamu ${
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
