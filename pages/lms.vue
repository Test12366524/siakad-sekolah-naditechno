<script setup lang="ts">
import { ref } from 'vue';
import { VCol, VTextarea, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();
const dosen = ref();
const mata_kuliah = ref();

const form = {
  mata_kuliah_id: "",
  dosen_id: "",
  title: "",
  subtitle: "",
  file_pdf: "",
  file_image: "",
  link: "",
  description: "",
  start_date: "",
  until_date: "",
  order: "",
  status: "",
};

useApi("master/dosen/all").then(({ data }) => {
    dosen.value = data;
});

useApi("master/mata-kuliah/all").then(({ data }) => {
    mata_kuliah.value = data;
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

const mata_kuliah_id = ref<number | null>(null);
const dosen_id = ref<number | null>(null);

</script>

<template>
  <SaveFileDialog
    width="1200"
    v-if="tableRef"
    path="lms"
    title="Tambah LMS"
    edit-title="Edit LMS"
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
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.title"
        v-model="formData.title"
        label="Judul"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        :error-messages="validationErrors.subtitle"
        v-model="formData.subtitle"
        label="Sub Judul"
      />
    </VCol>

    <VCol cols="12" md="6">
      <FileInput
        v-model="formData.file_image"
        accept="image/*"
        label="File Gambar"
        small-chips
        chips
      />
    </VCol>

    <VCol cols="12" md="6">
      <FileInput
        v-model="formData.file_pdf"
        accept="pdf/*"
        label="Foto PDF"
        small-chips
        chips
      />
    </VCol>

    <VCol cols="12" md="12">
      <VTextField
        :error-messages="validationErrors.link"
        v-model="formData.link"
        label="Link"
      />
    </VCol>
    <VCol cols="12" md="12">
      <VTextarea
        v-model="formData.description"
        label="Deskripsi"
      />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField
        type="date"
        :error-messages="validationErrors.start_date"
        v-model="formData.start_date"
        label="Tanggal Mulai"
      />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField
        type="date"
        :error-messages="validationErrors.until_date"
        v-model="formData.until_date"
        label="Tanggal Akhir"
      />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField
        type="number"
        :error-messages="validationErrors.order"
        v-model="formData.order"
        label="Urutan"
      />
    </VCol>
    <VCol cols="12" md="3">
      <VLabel>Status</VLabel>
      <VRadioGroup
        inline
        v-model="formData.status"
        :error-messages="validationErrors.status"
      >
      <VRadio label="Draft" :value="0"></VRadio>
      <VRadio label="Publish" :value="1"></VRadio>
      <VRadio label="Unpublish" :value="2"></VRadio>
      </VRadioGroup>
    </VCol>
  </SaveFileDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol cols="12" md="6">
              <VBtn v-if="role_id == 1 || role_id == 2" @click="dialogSave.show()" color="primary">
                <VIcon end icon="ri-add-fill" />
                Tambah Data
              </VBtn>
            </VCol>
            <VCol cols="12" md="3" style="margin-top: 5px;">
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
            <VCol cols="12" md="3" style="margin-top: 5px;">
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
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data LMS"
        path="lms"
        :dosen_id = "dosen_id"
        :mata_kuliah_id = "mata_kuliah_id"
        :with-actions="status_action"
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
            title: 'Judul',
            key: 'title',
            sortable: false,
          },
          {
            title: 'Sub Judul',
            key: 'subtitle',
            sortable: false,
          },
          {
            title: 'Tanggal Mulai',
            key: 'start_date',
            sortable: false,
          },
          {
            title: 'Tanggal Selesai',
            key: 'until_date',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              v-if="role_id == 1 || role_id == 2"
              @click="dialogSave.show({ ...item })"
              size="small"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              v-if="role_id == 1 || role_id == 2"
              @click="
                confirmDialog.show({
                  title: 'Hapus LMS',
                  message: `Anda yakin ingin menghapus LMS ${
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
