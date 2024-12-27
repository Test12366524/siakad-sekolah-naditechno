<script setup lang="ts">
import { VCol, VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();
const tableRef = ref();

const form = {
  book_id: "",
  user_id: "",
  borrow_date: "",
  return_date: "",
};

const books = ref();
const users = ref();

useApi("book/all").then(({ data }) => {
  books.value = data;
})

useApi("user/all-user").then(({ data }) => {
  users.value = data;
});

const handleAction = async (data: any) => {
  const url = `book/borrow/return/${data.id}`;

  const { errors, success } = await useApi(url, {
    withNotif: true,
    method: "PUT",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (success) tableRef.value.refresh();
};

onMounted(() => {
  useApi("auth/me").then(({ data }) => {
    useApi(`perpustakaan/pinjam/${data.role_id}`).then(({ data }) => {
      if(data == 0){
        navigateTo(`/not-authorized`);
      }
    });
  });
});
</script>

<template>
  <SaveFileDialog
    v-if="tableRef"
    v-slot="{ formData, validationErrors, isDetail }"
    ref="dialogSave"
    width="1200"
    path="book/borrow"
    title="Tambah Pinjam Buku"
    edit-title="Edit Pinjam Buku"
    detail-title="Detail Buku"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.book_id"
        label="Buku"
        density="compact"
        :error-messages="validationErrors.book_id"
        placeholder="Pilih Buku"
        :items="books"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VAutocomplete
        v-model="formData.user_id"
        label="Siswa / Guru"
        density="compact"
        :error-messages="validationErrors.user_id"
        placeholder="Pilih Siswa / Guru"
        :items="users"
        item-title="text"
        item-value="id"
        required
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.borrow_date"
        type="date"
        :error-messages="validationErrors.borrow_date"
        label="Tanggal Pinjam"
        :readonly="isDetail"
      />
    </VCol>

    <VCol cols="12" md="6">
      <VTextField
        v-model="formData.return_date"
        type="date"
        :error-messages="validationErrors.return_date"
        label="Tanggal Dikembalikan"
        :readonly="isDetail"
      />
    </VCol>
  </SaveFileDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VRow>
            <VCol>
              <VBtn color="primary" @click="dialogSave.show()">
                <VIcon end icon="ri-add-fill" />
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
        title="Data Pinjaman Buku"
        path="book/borrow"
        :with-actions="true"
        :headers="[
          {
            title: 'Nama',
            key: 'user_name',
            sortable: false,
          },
          {
            title: 'Buku',
            key: 'book_title',
            sortable: false,
          },
          {
            title: 'Tanggal Pinjam',
            key: 'borrow_date',
            sortable: false,
          },
          {
            title: 'Tanggal Dikembalikan',
            key: 'return_date',
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
            <VBtn
              v-if="item.status_desc == 'Dipinjam'"
              size="x-small"
              style="border-radius: 0.375rem !important"
              @click="
                () => {
                  confirmDialog.show({
                    title: 'Dikembalikan',
                    message: `Anda yakin ingin mengubah status jadi dikembalikan?`,
                    onConfirm: () => handleAction(item),
                  });
                }
              "
            >
              <VIcon start icon="ri-checkbox-circle-line" />
              Dikembalikan
            </VBtn>
            <IconBtn
              v-if="item.status_desc == 'Dipinjam'"
              size="small" 
              @click="
                () => {
                  const payload = { ...item };
                  payload.borrow_date = new Date(payload.borrow_date)
                    .toISOString()
                    .substring(0, 10);
                  payload.return_date = new Date(payload.return_date)
                    .toISOString()
                    .substring(0, 10);
                  dialogSave.show(payload);
                }
              ">
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              v-if="item.status_desc == 'Dipinjam'"
              size="small"
              @click="
                confirmDialog.show({
                  title: 'Hapus Pinjaman',
                  message: `Anda yakin ingin menghapus Pinjaman ${
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
