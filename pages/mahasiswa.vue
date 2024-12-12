<script setup lang="ts">
import { ref } from "vue";
import { VCol, VTextField, VTextarea } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const fakultas = ref();
const kelas = ref();
const semester = ref();
const periode = ref();

const jurusans = ref();

const religions = ref([
  { id: "Islam", text: "Islam" },
  { id: "Kristen", text: "Kristen" },
  { id: "Katolik", text: "Katolik" },
  { id: "Hindu", text: "Hindu" },
  { id: "Budha", text: "Budha" },
  { id: "Konghucu", text: "Konghucu" },
]);

const genders = ref([
  { id: "L", text: "Laki-laki" },
  { id: "P", text: "Perempuan" },
]);

const kelas_id = ref<number | null>(null);
const semester_id = ref<number | null>(null);
const periode_id = ref<number | null>(null);
const gender = ref("");

const form = {
  fakultas_id: undefined,
  jurusan_id: undefined,
  kelas_id: undefined,
  semester_id: undefined,
  periode_id: undefined,
  name: "",
  birth_date: "",
  place_of_birth: "",
  birth_mother_name: "",
  gender: "L",
  religion: "",
  nik: "",
  entrance_date: "",
  email: "",
  phone_1: "",
  phone_2: "",
  address: "",
  photo: "",
};

useApi("master/fakultas/all").then(({ data }) => {
  fakultas.value = data;
});

useApi("master/kelas/all").then(({ data }) => {
  kelas.value = data;
});

useApi("master/semester/all").then(({ data }) => {
  semester.value = data;
});

useApi("master/periode/all").then(({ data }) => {
  periode.value = data;
});

useApi("master/jurusan/all").then(({ data }) => {
  jurusans.value = data;
});

const role_id = ref();
const status_action = ref();
onMounted(() => {
  useApi("auth/me").then(({ data }) => {
    role_id.value = data.role_id;
    if(data.role_id == 1 || data.role_id == 2){
      status_action.value = true;
    }else{
      status_action.value = false;
    }
  });
});
</script>

<template>
  <SaveDialog
    width="1200"
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isDetail }"
    ref="dialogSave"
    path="mahasiswa"
    title="Tambah Mahasiswa"
    edit-title="Edit Mahasiswa"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="4">
      <VAutocomplete
        v-model="formData.semester_id"
        label="Semester"
        :error-messages="validationErrors.semester_id"
        placeholder="Pilih Semester"
        :items="semester"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VAutocomplete
        v-model="formData.periode_id"
        label="Periode"
        :error-messages="validationErrors.periode_id"
        placeholder="Pilih Periode"
        :items="periode"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :disabled="isDetail"
      />
    </VCol>
    <VCol cols="12" md="4">
      <VAutocomplete
        v-model="formData.fakultas_id"
        label="Fakultas"
        :error-messages="validationErrors.fakultas_id"
        placeholder="Pilih Fakultas"
        :items="fakultas"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :disabled="isDetail"
      />
    </VCol>
    <VCol cols="12" md="4">
      <VAutocomplete
        v-model="formData.jurusan_id"
        label="Jurusan"
        :error-messages="validationErrors.jurusan_id"
        placeholder="Pilih Jurusan"
        :items="jurusans"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VAutocomplete
        v-model="formData.kelas_id"
        label="Kelas"
        :error-messages="validationErrors.kelas_id"
        placeholder="Pilih Kelas"
        :items="kelas"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.nim"
        :error-messages="validationErrors.nim"
        label="NIM"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.name"
        :error-messages="validationErrors.name"
        label="Nama"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VAutocomplete
        v-model="formData.religion"
        label="Agama"
        :error-messages="validationErrors.religion"
        placeholder="Pilih Agama"
        :items="religions"
        item-title="text"
        item-value="text"
        required
        clearable
        clear-icon="ri-close-line"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.nik"
        :error-messages="validationErrors.nik"
        label="NIK"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.birth_date"
        type="date"
        :error-messages="validationErrors.birth_date"
        label="Tanggal Lahir"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="2">
      <VTextField
        v-model="formData.place_of_birth"
        :error-messages="validationErrors.place_of_birth"
        label="Tempat Lahir"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VLabel>Jenis Kelamin</VLabel>
      <VRadioGroup
        v-model="formData.gender"
        inline
        :error-messages="validationErrors.gender"
        :disabled="isDetail"
      >
        <VRadio label="Laki-laki" value="L" />
        <VRadio label="Perempuan" value="P" />
      </VRadioGroup>
    </VCol>

    

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.entrance_date"
        type="date"
        :error-messages="validationErrors.entrance_date"
        label="Tanggal Masuk"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.email"
        type="email"
        :error-messages="validationErrors.email"
        label="Email"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4">
      <VTextField
        v-model="formData.phone_1"
        :error-messages="validationErrors.phone_1"
        label="No. Handphone 1"
        type="number"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="4" class="grid grid-cols-2">
      <FileInput
        v-model="formData.foto"
        accept="image/*"
        label="Upload Foto"
        small-chips
        chips
        show-preview
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="12">
      <VTextarea
        v-model="formData.address"
        :error-messages="validationErrors.address"
        label="Alamat"
        rows="2"
        :disabled="isDetail"
      />
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol cols="12" md="6">
              <VBtn v-if="role_id == 1" color="primary" @click="dialogSave.show()">
                <VIcon end icon="ri-add-fill" />
                Tambah Data
              </VBtn>
            </VCol>
            <VCol cols="12" md="2" style="margin-block-start: 5px">
              <VAutocomplete
                v-model="kelas_id"
                label="Kelas"
                placeholder="Pilih Kelas"
                :items="kelas"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="12" md="2" style="margin-block-start: 5px">
              <VAutocomplete
                v-model="periode_id"
                label="Tahun Ajaran"
                placeholder="Pilih Tahun Ajaran"
                :items="periode"
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
        title="Data Mahasiswa"
        path="mahasiswa"
        :with-actions="status_action"
        :kelas_id="kelas_id"
        :periode_id="periode_id"
        :semester_id="semester_id"
        :headers="[
          {
            title: 'Tahun Ajaran',
            key: 'periode_name',
            sortable: false,
          },
          {
            title: 'Angkatan',
            key: 'periode_angkatan',
            sortable: false,
          },
          {
            title: 'Semester',
            key: 'semester_name',
            sortable: false,
          },
          {
            title: 'Kelas',
            key: 'kelas_name',
            sortable: false,
          },
          {
            title: 'NIM',
            key: 'nim',
            sortable: false,
          },
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
          {
            title: 'Jenis Kelamin',
            key: 'gender',
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
              @click="dialogSave.show({ ...item }, true)"
            >
              <VIcon icon="ri-eye-line" />
            </IconBtn>
            <IconBtn
              v-if="role_id == 1"
              size="small"
              title="Edit"
              @click="dialogSave.show({ ...item })"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              v-if="role_id == 1"
              size="small"
              title="Hapus"
              @click="
                confirmDialog.show({
                  title: 'Hapus Mahasiswa',
                  message: `Anda yakin ingin menghapus Mahasiswa ${
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
