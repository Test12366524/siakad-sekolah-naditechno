<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();

const form = {
  mata_pelajaran_id: null,
  name: "",
  nik: "",
  nuptk: "",
  nip: "",
  birth_date: "",
  place_of_birth: "",
  gender: "",
  email: "",
  phone: "",
  join_date: "",
  pendidikan_terakhir: "",
  tugas_tambahan_id: null,
  status_kepegawaian: "",
  address: "",
  photo: null,
};

const tugasTambahanList = ref([]);
const mataPelajaranList = ref([]);

const getTugasTambahan = () => {
  useApi("master/tugas-tambahan/all").then(({ data }) => {
    tugasTambahanList.value = data;
  });
};

const getMataPelajaran = () => {
  useApi("master/mata-pelajaran/all").then(({ data }) => {
    mataPelajaranList.value = data;
  });
};

const { user } = useAuthStore();
const role_id = ref();
const previewPhoto = ref("");

onMounted(() => {
  useApi(`level/guru/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  });
  role_id.value = user.role_id;
  getTugasTambahan();
  getMataPelajaran();
});
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isDetail }"
    ref="dialogSave"
    width="1200"
    path="master/guru"
    title="Tambah Guru"
    edit-title="Edit Guru"
    detail-title="Detail Guru"
    :request-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VRow>
      <VCol cols="12" md="3">
        <VCol cols="12" align-self="center">
          <VImg
            max-height="300"
            max-width="200"
            class="mb-3"
            rounded
            border
            :src="
              previewPhoto ||
              'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
            "
          />
          <FileInput
            v-if="!isDetail"
            v-model="formData.photo"
            accept="image/*"
            label="Upload Foto"
            @change="(data) => (previewPhoto = data.previewImageUrl)"
          />
        </VCol>
      </VCol>
      <VCol cols="12" md="9">
        <VCard>
          <VCardTitle class="mb-2"> Data Guru </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="formData.name"
                  :error-messages="validationErrors.name"
                  label="Nama Guru"
                  :readonly="isDetail"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="formData.nik"
                  type="number"
                  :error-messages="validationErrors.nik"
                  label="NIK"
                  :readonly="isDetail"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="formData.nuptk"
                  :error-messages="validationErrors.nuptk"
                  label="NUPTK"
                  :readonly="isDetail"
                  type="number"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="formData.nip"
                  :error-messages="validationErrors.nip"
                  label="NIP"
                  :readonly="isDetail"
                  type="number"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="formData.birth_date"
                  type="date"
                  :error-messages="validationErrors.birth_date"
                  label="Tanggal Lahir"
                  :readonly="isDetail"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="formData.place_of_birth"
                  :error-messages="validationErrors.place_of_birth"
                  label="Tempat Lahir"
                  :readonly="isDetail"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VLabel>Jenis Kelamin</VLabel>
                <VRadioGroup
                  v-model="formData.gender"
                  inline
                  :error-messages="validationErrors.gender"
                  :readonly="isDetail"
                >
                  <VRadio label="Laki-laki" value="L" />
                  <VRadio label="Perempuan" value="P" />
                </VRadioGroup>
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="formData.email"
                  type="email"
                  :error-messages="validationErrors.email"
                  label="Email"
                  :readonly="isDetail"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="formData.phone"
                  :error-messages="validationErrors.phone"
                  label="No. Handphone"
                  type="number"
                  :readonly="isDetail"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="formData.join_date"
                  type="date"
                  :error-messages="validationErrors.join_date"
                  label="Tanggal Bergabung"
                  :readonly="isDetail"
                />
              </VCol>
              <VCol cols="12">
                <VTextarea
                  v-model="formData.address"
                  :error-messages="validationErrors.address"
                  label="Alamat"
                  rows="2"
                  :readonly="isDetail"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <VCard class="mt-4">
          <VCardTitle class="mb-2"> Pendidikan dan Tugas </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="formData.pendidikan_terakhir"
                  :error-messages="validationErrors.pendidikan_terakhir"
                  label="Pendidikan Terakhir"
                  :readonly="isDetail"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VAutocomplete
                  v-model="formData.mata_pelajaran_id"
                  label="Mata Pelajaran"
                  :error-messages="validationErrors.mata_pelajaran_id"
                  placeholder="Pilih Mata Pelajaran"
                  :items="mataPelajaranList"
                  item-title="text"
                  item-value="id"
                  required
                  clearable
                  clear-icon="ri-close-line"
                  :readonly="isDetail"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VAutocomplete
                  v-model="formData.tugas_tambahan_id"
                  label="Tugas Tambahan"
                  :error-messages="validationErrors.tugas_tambahan_id"
                  placeholder="Pilih Tugas Tambahan"
                  :items="tugasTambahanList"
                  item-title="text"
                  item-value="id"
                  required
                  clearable
                  clear-icon="ri-close-line"
                  :readonly="isDetail"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="formData.status_kepegawaian"
                  :error-messages="validationErrors.status_kepegawaian"
                  label="Status Kepegawaian"
                  :readonly="isDetail"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </SaveFileDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol cols="12" md="6" class="d-flex align-center gap-4">
              <VBtn
                v-if="role_id == 1"
                color="primary"
                @click="
                  () => {
                    previewPhoto = null;
                    dialogSave.show();
                  }
                "
              >
                <VIcon end icon="ri-add-fill" />
                Tambah Data
              </VBtn>

              <ImportFileExcel
                @done="tableRef.refresh()"
                path="master/guru/import-excel"
              ></ImportFileExcel>
              <ExportFileExcel path="master/guru/export-excel" />
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Guru"
        path="master/guru"
        :with-actions="true"
        :headers="[
          {
            title: 'Nama',
            key: 'name',
            sortable: false,
          },
          {
            title: 'NIK',
            key: 'nik',
            sortable: false,
          },
          {
            title: 'NIP',
            key: 'nip',
            sortable: false,
          },
          {
            title: 'Email',
            key: 'email',
            sortable: false,
          },
          {
            title: 'No. Handphone',
            key: 'phone',
            sortable: false,
          },
          {
            title: 'Tanggal Masuk',
            key: 'join_date',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              size="small"
              title="Detail"
              @click="
                () => {
                  const payload = { ...item };
                  const birth_date = new Date(payload.birth_date);
                  birth_date.setDate(birth_date.getDate() + 1);
                  payload.birth_date = formatFullDate(birth_date).simpleDate;

                  const joinDate = new Date(payload.join_date);
                  joinDate.setDate(joinDate.getDate() + 1);
                  payload.join_date = formatFullDate(joinDate).simpleDate;
                  if (payload.photo) previewPhoto = getFileUrl(payload.photo);
                  dialogSave.show(payload, true);
                }
              "
            >
              <VIcon icon="ri-eye-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                () => {
                  const payload = { ...item };

                  const birth_date = new Date(payload.birth_date);
                  birth_date.setDate(birth_date.getDate() + 1);
                  payload.birth_date = formatFullDate(birth_date).simpleDate;

                  const joinDate = new Date(payload.join_date);
                  joinDate.setDate(joinDate.getDate() + 1);
                  payload.join_date = formatFullDate(joinDate).simpleDate;
                  
                  if (payload.photo) previewPhoto = getFileUrl(payload.photo);
                  dialogSave.show(payload);
                }
              "
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Guru',
                  message: `Anda yakin ingin menghapus Guru ${
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
