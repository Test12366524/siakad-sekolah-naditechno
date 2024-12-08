<script setup lang="ts">
const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

const genders = ref([
  { id: "M", name: "Laki-laki" },
  { id: "F", name: "Perempuan" },
]);

const userForm = {
  name: "",
  role: "participant",
  email: "",
  password: "123456",
  phone_number: "",
  gender: "",
  address: "",
  categoryId: 1,
};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <NuxtLink to="/anggota/create">
            <VBtn color="primary">
              <VIcon end icon="ri-add-fill" />
              Tambah Data
            </VBtn>
          </NuxtLink>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Daftar Anggota"
        path="anggota"
        :with-actions="true"
        :headers="[
          {
            title: 'id anggota',
            key: 'code',
            sortable: false,
          },
          {
            title: 'nama anggota',
            key: 'name',
            sortable: false,
          },
          {
            title: 'kategori',
            key: 'category',
            sortable: false,
          },
          {
            title: 'status',
            key: 'status_desc',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn :href="`/anggota/detail/${item.id}`" size="small">
              <VIcon icon="ri-eye-line" />
            </IconBtn>
            <IconBtn :href="`/anggota/edit/${item.id}`" size="small">
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus anggota',
                  message: `Anda yakin ingin menghapus anggota ${
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
