<script setup lang="ts">
const { confirmDialog } = useCommonStore();
const route = useRoute(); // Untuk membaca route saat ini

const dialogSave = ref();

const tableRef = ref();

const guru = ref([]);
const notulenId = computed(() => route.params.id);
const url = "notulen-kegiatan-detail";

const form = ref({
  notulen_kegiatan_id: notulenId.value, // guruid
  guru_id: "", // guruid
});

onMounted(() => {
  const { user } = useAuthStore();
  //   useApi(`level/notulen-kegiatan/${user.role_id}`).then(({ data }) => {
  //     if(data == 0){
  //       navigateTo(`/not-authorized`);
  //     }
  //   });

  console.log("notulenId", notulenId.value);
  if (user.role_id !== 1) return navigateTo(`/not-authorized`);
  useApi("master/guru/all").then(({ data }) => {
    guru.value = data;
  });
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :path="url"
    title="Tambah Absen Notulen Kegiatan Guru"
    edit-title="Edit Absen Notulen Kegiatan Guru"
    :default-form="form"
    :request-form="form"
    :refresh-callback="tableRef.refresh"
    width="600"
  >
    <VCol cols="12">
      <VAutocomplete
        v-model="formData.guru_id"
        label="Guru"
        :error-messages="validationErrors.guru_id"
        placeholder="Pilih Guru"
        :items="guru"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VBtn
            color="primary"
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

    <VCol cols="12" v-if="notulenId">
      <AppTable
        ref="tableRef"
        title="Data Notulen Kegiatan"
        :path="url"
        :notulen_kegiatan_id="notulenId"
        :with-actions="true"
        :headers="[
          {
            title: 'Tanggal',
            key: 'created_at',
            sortable: false,
          },
          {
            title: 'Judul',
            key: 'kegiatan_title',
            sortable: false,
          },
          {
            title: 'Guru',
            key: 'guru_name',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              label="Edit"
              size="small"
              @click="
                () => {
                  const payload = { ...item };
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
                  title: 'Hapus Notulen Kegiatan',
                  message: `Anda yakin ingin menghapus Notulen Kegiatan ${
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
