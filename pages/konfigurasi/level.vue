<script setup lang="ts">
import { VTextField } from "vuetify/lib/components/index.mjs";

const { confirmDialog } = useCommonStore();

const dialogSave = ref();

const tableRef = ref();

// 👉 Permission List
const permissions = ref([]);

const form = {
  name: "",
  permissions: [],
};

const handleEdit = (item: any) => {
  useApi(`/level/permission/${item.id}`).then(({ data }) => {
    dialogSave.value.show({
      ...item,
      permissions: data.map((val: any) => val.permission),
    });
  });
};

onMounted(() => {
  useApi("/menu").then(({ data }) => {
    permissions.value = data;
  });
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    width="1200"
    path="level"
    title="Tambah Level"
    edit-title="Edit Level"
    v-slot="{ formData, validationErrors }"
    ref="dialogSave"
    :default-form="form"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12">
      <VTextField
        :error-messages="validationErrors.name"
        v-model="formData.name"
        label="Level"
      />
    </VCol>

    <VCol cols="12">
      <h5 class="text-h5 my-6">Akses</h5>

      <!-- 👉 Role Permissions -->
      <VTable class="permission-table">
        <PermissionMenu
          v-for="menu in permissions"
          v-model="formData.permissions"
          :key="menu.id"
          :menu="menu"
        ></PermissionMenu>
      </VTable>
    </VCol>
  </SaveDialog>

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VBtn @click="dialogSave.show()" color="primary">
            <VIcon end icon="ri-add-fill" />
            Tambah Data
          </VBtn>
        </VCardItem>
      </VCard>
    </VCol>

    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Data Level"
        path="level"
        :with-actions="true"
        :headers="[
          {
            title: 'Level',
            key: 'name',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn @click="() => handleEdit(item)" size="small">
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
            <IconBtn
              @click="
                confirmDialog.show({
                  title: 'Hapus Level',
                  message: `Anda yakin ingin menghapus zona cabang ${
                    (item as any).code || (item as any).name
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

<style lang="scss">
.permission-table {
  td {
    border-block-end: 1px solid
      rgba(var(--v-border-color), var(--v-border-opacity));
    padding-block: 0.625rem;

    .v-checkbox {
      min-inline-size: 4.75rem;
    }

    &:not(:first-child) {
      padding-inline: 0.75rem;
    }

    .v-label {
      white-space: nowrap;
    }
  }
}
</style>
