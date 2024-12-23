<script setup lang="ts">
import { ref } from 'vue';
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";
const { snackbar, confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const dosen = ref();
const mata_kuliah = ref();
const semester = ref();

const days = ref([
  { id: '0', text: "Senin" },
  { id: '1', text: "Selasa" },
  { id: '2', text: "Rabu" },
  { id: '3', text: "Kamis" },
  { id: '4', text: "Jumat" },
  { id: '5', text: "Sabtu" },
  { id: '6', text: "Minggu" },
]);

const form = {
  dosen_id: undefined,
  mata_kuliah_id: undefined,
  semester_id: undefined,
  hari: "",
  dari_jam: "",
  ke_jam: "",
  status: 1,
};

useApi("master/dosen/all").then(({ data }) => {
  dosen.value = data;
});

useApi("master/semester/all").then(({ data }) => {
  semester.value = data;
});

useApi("master/mata-kuliah/all").then(({ data }) => {
  mata_kuliah.value = data;
});

const role_id = ref();
const status_action = ref();
onMounted(() => {
  useApi("auth/me").then(({ data }) => {
    role_id.value = data.role_id;
    if(data.role_id == 1){
      status_action.value = true;
    }else{
      status_action.value = false;
    }

    useApi(`penjadwalan/${data.role_id}`).then(({ data }) => {
      if(data == 0){
        navigateTo(`/not-authorized`);
      }
    });
  });
});

const mata_kuliah_id = ref<number | null>(null);
const dosen_id = ref<number | null>(null);
const semester_id = ref<number | null>(null);

const value_dosen_id = ref<number | null>(null);
const value_mata_kuliah_id = ref<number | null>(null);
const value_semester_id = ref<number | null>(null);

const setDosen = (dosen_id: number) => {
  value_dosen_id.value = dosen_id;
};

const setMataKuliah = (mata_kuliah_id: number) => {
  value_mata_kuliah_id.value = mata_kuliah_id;
};

const setSemester = (semester_id: number) => {
  value_semester_id.value = semester_id;
  if (value_dosen_id.value && value_mata_kuliah_id.value && value_semester_id.value) {
    checkingData(value_dosen_id.value, value_mata_kuliah_id.value, value_semester_id.value);
  }
};

const checkingData = (dosen_id: number, mata_kuliah_id: number, semester_id: number) => {
  useApi(`/jadwal-mata-kuliah/${dosen_id}/${mata_kuliah_id}/${semester_id}`)
    .then(({ data }) => {
      if (data && data.length > 0) {
        snackbar.show({
          message: "Jadwal Dosen Mata Kuliah sudah ada.",
          color: "error",
        });
        // Process the data
      } else {
        console.log('No data found');
        // Handle no data scenario
      }
    })
    .catch((error) => {
      console.error('Error checking data:', error);
    });
};

</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="jadwal-mata-kuliah"
    title="Tambah Jadwal"
    edit-title="Edit Jadwal"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.dosen_id"
        label="Dosen"
        density="compact"
        :error-messages="validationErrors.dosen_id"
        placeholder="Pilih Dosen"
        :items="dosen"
        item-title="text"
        item-value="id"
        @update:model-value="
          (dosen_id) => {
            setDosen(dosen_id);
          }
        "
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
    
    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.mata_kuliah_id"
        label="Mata Kuliah"
        density="compact"
        :error-messages="validationErrors.mata_kuliah_id"
        placeholder="Pilih Mata Kuliah"
        :items="mata_kuliah"
        item-title="text"
        item-value="id"
        @update:model-value="
          (mata_kuliah_id) => {
            setMataKuliah(mata_kuliah_id);
          }
        "
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.semester_id"
        label="Semester"
        density="compact"
        :error-messages="validationErrors.semester_id"
        placeholder="Pilih Semester"
        :items="semester"
        item-title="text"
        item-value="id"
        @update:model-value="
          (semester_id) => {
            setSemester(semester_id);
          }
        "
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.hari"
        label="Hari"
        density="compact"
        :error-messages="validationErrors.hari"
        placeholder="Pilih Hari"
        :items="days"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="6">
      <VTextField
        type="time"
        :error-messages="validationErrors.dari_jam"
        v-model="formData.dari_jam"
        label="Dari Jam"
      />
    </VCol>

    <VCol cols="6">
      <VTextField
        type="time"
        :error-messages="validationErrors.ke_jam"
        v-model="formData.ke_jam"
        label="Ke Jam"
      />
    </VCol>

    <VCol cols="12" md="6">
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
          <VRow>
            <VCol cols="12" md="6">
              <VBtn v-if="role_id == 1" @click="dialogSave.show()" color="primary">
                <VIcon end icon="ri-add-fill" />
                Tambah Data
              </VBtn>
            </VCol>
            <VCol cols="12" md="2" style="margin-top: 5px;">
              <VAutocomplete
                v-model="dosen_id"
                label="Dosen"
                density="compact"
                placeholder="Pilih Dosen"
                :items="dosen"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="12" md="2" style="margin-top: 5px;">
              <VAutocomplete
                v-model="mata_kuliah_id"
                label="Mata Kuliah"
                density="compact"
                placeholder="Pilih Mata Kuliah"
                :items="mata_kuliah"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="12" md="2" style="margin-block-start: 5px">
              <VAutocomplete
                v-model="semester_id"
                label="Semester"
                density="compact"
                placeholder="Pilih Semester"
                :items="semester"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Jadwal"
        path="jadwal-mata-kuliah"
        :with-actions="status_action"
        :dosen_id="dosen_id"
        :mata_kuliah_id="mata_kuliah_id"
        :semester_id="semester_id"
        :headers="[
          {
            title: 'Dosen',
            key: 'dosen_name',
            sortable: false,
          },
          {
            title: 'Mata Kuliah',
            key: 'mata_kuliah_name',
            sortable: false,
          },
          {
            title: 'Hari',
            key: 'hari_desc',
            sortable: false,
          },
          {
            title: 'Mulai Dari',
            key: 'dari_jam',
            sortable: false,
          },
          {
            title: 'Sampai',
            key: 'ke_jam',
            sortable: false,
          },
          {
            title: 'Semester',
            key: 'semester_name',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              v-if="role_id == 1"
              @click="dialogSave.show({ ...item, status_desc: undefined, hari_desc: undefined })"
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              v-if="role_id == 1"
              @click="
                confirmDialog.show({
                  title: 'Hapus Jadwal',
                  message: `Anda yakin ingin menghapus Jadwal ${
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
