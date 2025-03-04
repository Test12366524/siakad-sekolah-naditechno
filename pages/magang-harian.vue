<script setup lang="ts">
import { VTextField } from 'vuetify/lib/components/index.mjs';

const { confirmDialog } = useCommonStore();
const route = useRoute();

const dialogSave = ref();

const tableRef = ref();

const magang_id = computed(() => route.query.id);

const form = ref({
  magang_id: magang_id, // guruid
  tanggal: "",
  catatan: "",
});


const role_id = ref();
const actions = ref();
const url = 'magang-harian?magang_id=' + magang_id.value;

onMounted(() => {
  const { user } = useAuthStore();
  role_id.value = user.role_id;
  if(user.role_id == 1){
    actions.value = true;
  }else if(user.role_id == 2){
    actions.value = true;
  }else if(user.role_id == 12){
    actions.value = true;
  }else{
    actions.value = false;
  }
  //   useApi(`level/magang/${user.role_id}`).then(({ data }) => {
  //     if(data == 0){
  //       navigateTo(`/not-authorized`);
  //     }
  //   });


});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="magang-harian"
    title="Tambah Magang Harian"
    edit-title="Edit Magang Harian"
    :default-form="form"
    :request-form="form"
    :refresh-callback="tableRef.refresh"
    width="600"
  >
    <VCol cols="12">
      <VTextField
        v-model="formData.tanggal"
        type="date"
        :error-messages="validationErrors.tanggal"
        label="Tanggal"
      />
    </VCol>

    <VCol cols="12">
      <VTextField
        v-model="formData.catatan"
        :error-messages="validationErrors.catatan"
        label="Catatan"
      />
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12" v-if="role_id == 1 || role_id == 2 || role_id == 12">
      <VCard>
        <VCardItem>
          <VBtn
            color="primary"
            @click="
              () => {
                dialogSave.show();
              }
            "
            style="margin-right: 10px;"
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
        title="Data Magang Harian"
        :path="url"
        :with-actions="actions"
        :headers="[
          {
            title: 'Tanggal',
            key: 'tanggal',
            sortable: false,
          },
          {
            title: 'Catatan',
            key: 'catatan',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1" v-if="role_id == 1 || role_id == 2 || role_id == 12">
            <IconBtn
              label="Edit"
              size="small"
              @click="
                () => {
                  const payload = { ...item };
                  const tanggal = new Date(payload.tanggal);
                  tanggal.setDate(tanggal.getDate() + 1);
                  payload.tanggal = formatFullDate(tanggal).simpleDate;
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
                  title: 'Hapus Magang Harian',
                  message: `Anda yakin ingin menghapus Magang Harian ${
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
