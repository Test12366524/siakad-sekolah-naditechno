<script setup lang="ts">
import { ref } from 'vue';
import { VCol, VTextarea, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const fakultas = ref();
const kelas = ref();


const jurusans = ref();
const religions = ref([
  { id: 'Islam', text: "Islam" },
  { id: 'Kristen', text: "Kristen" },
  { id: 'Katolik', text: "Katolik" },
  { id: 'Hindu', text: "Hindu" },
  { id: 'Budha', text: "Budha" },
  { id: 'Konghucu', text: "Konghucu" },
]);

const genders = ref([
  { id: 'L', text: "Laki-laki" },
  { id: 'P', text: "Perempuan" },
]);

const kelas_id = ref<number | null>(null);
const gender = ref('');

const form = {
  fakultas_id: undefined,
  jurusan_id: undefined,
  kelas_id: undefined,
  education_level: "",
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
};

useApi("master/fakultas/all").then(({ data }) => {
  fakultas.value = data;
});

useApi("master/kelas/all").then(({ data }) => {
  kelas.value = data;
});

useApi("master/jurusan/all").then(({ data }) => {
  jurusans.value = data;
});


</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="mahasiswa"
    title="Tambah Mahasiswa"
    edit-title="Edit Mahasiswa"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.fakultas_id"
        label="Fakultas"
        density="compact"
        :error-messages="validationErrors.fakultas_id"
        placeholder="Pilih Fakultas"
        :items="fakultas"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.jurusan_id"
        label="Jurusan"
        density="compact"
        :error-messages="validationErrors.jurusan_id"
        placeholder="Pilih Jurusan"
        :items="jurusans"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.education_level"
        v-model="formData.education_level"
        label="Edukasi Level"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.kelas_id"
        label="Kelas"
        density="compact"
        :error-messages="validationErrors.kelas_id"
        placeholder="Pilih Kelas"
        :items="kelas"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.name"
        v-model="formData.name"
        label="Nama"
      />
    </VCol>
    
    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.religion"
        label="Agama"
        density="compact"
        :error-messages="validationErrors.religion"
        placeholder="Pilih Agama"
        :items="religions"
        item-title="text"
        item-value="text"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        type="date"
        :error-messages="validationErrors.birth_date"
        v-model="formData.birth_date"
        label="Tanggal Lahir"
      />
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        :error-messages="validationErrors.place_of_birth"
        v-model="formData.place_of_birth"
        label="Tempat Lahir"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VLabel>Jenis Kelamin</VLabel>
      <VRadioGroup
        inline
        v-model="formData.gender"
        :error-messages="validationErrors.gender"
      >
        <VRadio label="Laki-laki" value="L"></VRadio>
        <VRadio label="Perempuan" value="P"></VRadio>
      </VRadioGroup>
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.nik"
        v-model="formData.nik"
        label="NIK"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        type="date"
        :error-messages="validationErrors.entrance_date"
        v-model="formData.entrance_date"
        label="Tanggal Masuk"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        type="email"
        :error-messages="validationErrors.email"
        v-model="formData.email"
        label="Email"
      />
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        :error-messages="validationErrors.phone_1"
        v-model="formData.phone_1"
        label="No. Handphone 1"
      />
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        :error-messages="validationErrors.phone_2"
        v-model="formData.phone_2"
        label="No. Handphone 2"
      />
    </VCol>
    
    <VCol cols="12" md="12">
      <VTextarea
        :error-messages="validationErrors.address"
        v-model="formData.address"
        label="Alamat"
        rows="2"
      />
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol cols="12" md="6">
              <VBtn @click="dialogSave.show()" color="primary">
                <VIcon end icon="ri-add-fill" />
                Tambah Data
              </VBtn>
            </VCol>
            <VCol cols="12" md="3" style="margin-top: 5px;">
              <VAutocomplete
                v-model="kelas_id"
                label="Kelas"
                density="compact"
                placeholder="Pilih Kelas"
                :items="kelas"
                item-title="text"
                item-value="id"
                required
                clearable
                clear-icon="ri-close-line"
              />
            </VCol>
            <VCol cols="12" md="3" style="margin-top: 5px;">
              <VAutocomplete
                v-model="gender"
                label="Jenis Kelamin"
                density="compact"
                placeholder="Pilih Jenis Kelamin"
                :items="genders"
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
        :with-actions="true"
        :kelas_id="kelas_id"
        :gender="gender"
        :headers="[
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
            title: 'Agama',
            key: 'religion',
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
              @click="dialogSave.show({ ...item  })"
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus Mahasiswa',
                  message: `Anda yakin ingin menghapus Mahasiswa ${
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
