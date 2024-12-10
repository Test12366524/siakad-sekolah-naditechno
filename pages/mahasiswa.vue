<script setup lang="ts">
import { ref } from "vue";
import { VCol, VTextField, VTextarea } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const fakultas = ref();
const kelas = ref();

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
const gender = ref("");

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
    v-slot="{ formData, validationErrors, isDetail }"
    ref="dialogSave"
    path="mahasiswa"
    title="Tambah Mahasiswa"
    edit-title="Edit Mahasiswa"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="6">
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
    <VCol cols="12" md="6">
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

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.education_level"
        :error-messages="validationErrors.education_level"
        label="Edukasi Level"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
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

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.name"
        :error-messages="validationErrors.name"
        label="Nama"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
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

    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.birth_date"
        type="date"
        :error-messages="validationErrors.birth_date"
        label="Tanggal Lahir"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.place_of_birth"
        :error-messages="validationErrors.place_of_birth"
        label="Tempat Lahir"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
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

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.nik"
        :error-messages="validationErrors.nik"
        label="NIK"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.entrance_date"
        type="date"
        :error-messages="validationErrors.entrance_date"
        label="Tanggal Masuk"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.email"
        type="email"
        :error-messages="validationErrors.email"
        label="Email"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.phone_1"
        :error-messages="validationErrors.phone_1"
        label="No. Handphone 1"
        type="number"
        :disabled="isDetail"
      />
    </VCol>

    <VCol cols="12" md="3">
      <VTextField
        v-model="formData.phone_2"
        :error-messages="validationErrors.phone_2"
        label="No. Handphone 2"
        type="number"
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
              <VBtn color="primary" @click="dialogSave.show()">
                <VIcon end icon="ri-add-fill" />
                Tambah Data
              </VBtn>
            </VCol>
            <VCol cols="12" md="3" style="margin-block-start: 5px">
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
            <VCol cols="12" md="3" style="margin-block-start: 5px">
              <VAutocomplete
                v-model="gender"
                label="Jenis Kelamin"
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
              size="small"
              title="Detail"
              @click="dialogSave.show({ ...item }, true)"
            >
              <VIcon icon="ri-eye-line" />
            </IconBtn>
            <IconBtn
              size="small"
              title="Edit"
              @click="dialogSave.show({ ...item })"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
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
