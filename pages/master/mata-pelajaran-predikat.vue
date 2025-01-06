<script setup lang="ts">
import { VCol, VTextField } from 'vuetify/lib/components/index.mjs'

const { confirmDialog } = useCommonStore()

const dialogSave = ref()
const tableRef = ref()
const mataPelajaranList = ref([])

const form = {
  mata_pelajaran_id: null,
  min_nilai: null,
  max_nilai: null,
  predikat: '',
  description: '',
  status: 1,
}

const predikatList = ['A', 'B', 'C', 'D', 'E']

useApi('master/mata-pelajaran/all').then(({ data }) => {
  mataPelajaranList.value = data
})

const { user } = useAuthStore()

onMounted(() => {
  useApi(`level/master-mata-pelajaran-predikat/${user.role_id}`).then(({ data }) => {
    if(data == 0){
      navigateTo(`/not-authorized`);
    }
  });
})
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isEditing }"
    ref="dialogSave"
    path="master/mata-pelajaran-predikat"
    title="Tambah Mata Pelajaran Predikat"
    edit-title="Edit Mata Pelajaran Predikat"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
    :request-form="form"
  >
    <VCol cols="12">
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
      />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        v-model="formData.min_nilai"
        :error-messages="validationErrors.min_nilai"
        label="Nilai Minimum"
        type="number"
      />
    </VCol>
    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        v-model="formData.max_nilai"
        :error-messages="validationErrors.max_nilai"
        label="Nilai Maximum"
        type="number"
      />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VAutocomplete
        v-model="formData.predikat"
        label="Predikat"
        :error-messages="validationErrors.predikat"
        placeholder="Pilih Predikat"
        :items="predikatList"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        v-model="formData.description"
        :error-messages="validationErrors.description"
        label="Deskripsi"
      />
    </VCol>

    <VCol cols="12">
      <VLabel>Status</VLabel>
      <VRadioGroup
        v-model="formData.status"
        inline
        :error-messages="validationErrors.status"
      >
        <VRadio
          label="Aktif"
          :value="1"
        />
        <VRadio
          label="Nonaktif"
          :value="0"
        />
      </VRadioGroup>
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol>
              <VBtn
                color="primary"
                @click="dialogSave.show()"
              >
                <VIcon
                  end
                  icon="ri-add-fill"
                />
                Tambah Data
              </VBtn>
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Mata Pelajaran Predikat"
        path="master/mata-pelajaran-predikat"
        :with-actions="true"
        :headers="[
          {
            title: 'Mata Pelajaran',
            key: 'mata_pelajaran_name',
            sortable: false,
          },
          {
            title: 'Predikat',
            key: 'predikat',
            sortable: false,
          },
          {
            title: 'Nilai Minimal',
            key: 'min_nilai',
            sortable: false,
          },
          {
            title: 'Nilai Maximal',
            key: 'max_nilai',
            sortable: false,
          },
          {
            title: 'Deskripsi',
            key: 'description',
            sortable: false,
          },
          {
            title: 'Status',
            key: 'status_desc',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn
              size="small"
              @click="dialogSave.show({ ...item, status_desc: undefined })"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Mata Pelajaran Predikat',
                  message: `Anda yakin ingin menghapus Mata Pelajaran Predikat ${
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
