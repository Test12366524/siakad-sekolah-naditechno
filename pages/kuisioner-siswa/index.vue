<script setup lang="ts">
import { ref } from "vue";
import { VCol } from "vuetify/lib/components/index.mjs";

const { snackbar, confirmDialog } = useCommonStore();

const tableRef = ref();
const jadwal = ref();
const filter_semester = ref();
const filter_periode = ref();

useApi("jadwal-mata-pelajaran/all").then(({ data }) => {
  jadwal.value = data;
});

useApi("master/semester/all/0").then(({ data }) => {
  filter_semester.value = data;
});

useApi("master/periode/all/0").then(({ data }) => {
  filter_periode.value = data;
});

const role_id = ref();
const status_action = ref();
const { user } = useAuthStore();

onMounted(() => {
  //   useApi(`level/kuisioner/${user.role_id}`).then(({ data }) => {
  //     if(data == 0){
  //       navigateTo(`/not-authorized`);
  //     }
  //   });
  role_id.value = user.role_id;
  status_action.value = user.role_id === 1 || user.role_id === 6;
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Kuisioner"
        path="kuisioner/siswa"
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
              v-if="item.nilai < 0"
              label="Kerjakan Ujian"
              size="small"
              title="Kerjakan Ujian"
              @click="
                () => {
                  navigateTo(`/kuisioner-siswa/${item.id}`);
                }
              "
            >
              <VIcon icon="ri-menu-add-fill" /> Kerjakan
            </IconBtn>
            <IconBtn
              v-if="item.nilai > 0"
              label="Hasil Ujian"
              size="small"
              @click="
                () => {
                  navigateTo(`/kuisioner-siswa/hasil?id=${item.id}`);
                }
              "
            >
            <VIcon icon="ri-file-list-2-line" /> Hasil Ujian
            </IconBtn>
          </div>
        </template>
      </AppTable>
    </VCol>
  </VRow>
</template>
