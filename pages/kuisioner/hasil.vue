<script setup lang="ts">

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const route = useRoute();

const kusionerId = computed(() => route.query.id);

const url_table = 'kuisioner/result?kuisioner_id=' + kusionerId.value;

onMounted(() => {
  const { user } = useAuthStore();
});
</script>

<template>
  <VRow>
    <VCol cols="12" v-if="kusionerId">
      <AppTable
        ref="tableRef"
        title="Daftar Hasil Siswa"
        :path="url_table"
        :kusioner_id="kusionerId"
        :with-actions="true"
        :headers="[
          {
            title: 'Mata Pelajaran',
            key: 'mata_pelajaran_name',
            sortable: false,
          },
          {
            title: 'Guru',
            key: 'guru_name',
            sortable: false,
          },
          {
            title: 'Pertemuan Ke',
            key: 'pertemuan_ke',
            sortable: false,
          },
          {
            title: 'Judul',
            key: 'title',
            sortable: false,
          },
          {
            title: 'Siswa',
            key: 'siswa',
            sortable: false,
          },
          {
            title: 'Jumlah Soal',
            key: 'jumlah_soal',
            sortable: false,
          },
          {
            title: 'Nilai',
            key: 'nilai',
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
                  title: 'Hapus Pilihan Ganda Kuisioner',
                  message: `Anda yakin ingin menghapus Pilihan Ganda Kuisioner ${
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
