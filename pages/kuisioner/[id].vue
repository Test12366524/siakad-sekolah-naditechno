<script setup lang="ts">
import { VTextarea, VTextField } from 'vuetify/lib/components/index.mjs';

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const route = useRoute();

const kusionerId = computed(() => route.params.id);

const form = ref({
  kuisioner_id : kusionerId.value, // guruid
  nomer: "",
  soal: "",
  soal_image: "",
  jawaban_a: "",
  jawaban_a_image: "",
  jawaban_b: "",
  jawaban_b_image: "",
  jawaban_c: "",
  jawaban_c_image: "",
  jawaban_d: "",
  jawaban_d_image: "",
  jawaban_e: "",
  jawaban_e_image: "",
  jawaban_benar: "",
});

const jawaban = ref([
  { id: "A", text: "A" },
  { id: "B", text: "B" },
  { id: "C", text: "C" },
  { id: "D", text: "D" },
  { id: "E", text: "E" },
]);
const url_table = 'kuisioner-detail?kuisioner_id=' + kusionerId.value;

onMounted(() => {
  const { user } = useAuthStore();
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="kuisioner-detail"
    title="Tambah Pilihan Ganda Kuisioner"
    edit-title="Edit Pilihan Ganda Kuisioner"
    :default-form="form"
    :request-form="form"
    :refresh-callback="tableRef.refresh"
    width="1200"
  >
    <VCol cols="12" md="2">
        <VTextField
            type="number"
            v-model="formData.nomer"
            :error-messages="validationErrors.nomer"
            label="Nomer"
        />
    </VCol>
    <VCol cols="12" md="2">
        <VAutocomplete
            v-model="formData.jawaban_benar"
            label="Jawaban Benar"
            :error-messages="validationErrors.jawaban_benar"
            placeholder="Pilih Jawaban Benar"
            :items="jawaban"
            item-title="text"
            item-value="text"
            required
            clearable
            clear-icon="ri-close-line"
        />
    </VCol>
    <VCol cols="12" md="8">
      <FileInput
        v-model="formData.soal_image"
        accept="image/*"
        label="Soal (File Gambar)"
        small-chips
        chips
        show-preview
      />
    </VCol>
    <VCol cols="12" md="12">
      <VTextarea
        v-model="formData.soal"
        :error-messages="validationErrors.soal"
        label="Soal"
        rows="2"
      />
    </VCol>
    <VCol cols="12" md="6">
        <VTextField
            v-model="formData.jawaban_a"
            :error-messages="validationErrors.jawaban_a"
            label="Jawaban A"
        />
    </VCol>
    <VCol cols="12" md="6">
      <FileInput
        v-model="formData.jawaban_a_image"
        accept="image/*"
        label="Jawaban A (File Gambar)"
        small-chips
        chips
        show-preview
      />
    </VCol>
    <VCol cols="12" md="6">
        <VTextField
          v-model="formData.jawaban_b"
          :error-messages="validationErrors.jawaban_b"
          label="Jawaban B"
        />
    </VCol>
    <VCol cols="12" md="6">
      <FileInput
        v-model="formData.jawaban_b_image"
        accept="image/*"
        label="Jawaban B (File Gambar)"
        small-chips
        chips
        show-preview
      />
    </VCol>
    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.jawaban_c"
        :error-messages="validationErrors.jawaban_c"
        label="Jawaban C"
      />
    </VCol>
    <VCol cols="12" md="6">
      <FileInput
        v-model="formData.jawaban_c_image"
        accept="image/*"
        label="Jawaban C (File Gambar)"
        small-chips
        chips
        show-preview
      />
    </VCol>
    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.jawaban_d"
        :error-messages="validationErrors.jawaban_d"
        label="Jawaban D"
      />
    </VCol>
    <VCol cols="12" md="6">
      <FileInput
        v-model="formData.jawaban_d_image"
        accept="image/*"
        label="Jawaban D (File Gambar)"
        small-chips
        chips
        show-preview
      />
    </VCol>
    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.jawaban_e"
        :error-messages="validationErrors.jawaban_e"
        label="Jawaban E"
      />
    </VCol>
    <VCol cols="12" md="6">
      <FileInput
        v-model="formData.jawaban_e_image"
        accept="image/*"
        label="Jawaban E (File Gambar)"
        small-chips
        chips
        show-preview
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

    <VCol cols="12" v-if="kusionerId">
      <AppTable
        ref="tableRef"
        title="Daftar Pilihan Ganda Kusioner"
        :path="url_table"
        :kusioner_id="kusionerId"
        :with-actions="true"
        :headers="[
          {
            title: 'Nomor',
            key: 'nomer',
            sortable: false,
          },
          {
            title: 'Soal',
            key: 'soal',
            sortable: false,
          },
          {
            title: 'Jawaban Benar',
            key: 'jawaban_benar',
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
