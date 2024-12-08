<script lang="ts" setup>
import type { VForm } from "vuetify/lib/components/index.mjs";

const props = defineProps({
  path: String,
  title: String,
  editTitle: String,
  refreshCallback: Function,
  defaultForm: Object,
  width: null || Number,
  itemKey: null || String,
});

const emits = defineEmits(["update:modelValue", "saved"]);

const refVForm = ref<VForm>();

const modalTitle = ref(props.title);
const isEditing = ref(false);
const isShow = ref(false);
const isTransasction = ref(false);

const formData = ref({ ...props.defaultForm });
const validationErrors = ref({});

const save = async () => {
  refVForm.value?.validate().then(async ({ valid }) => {
    if (!valid) return;

    const urlCreateUpdate = isEditing.value
      ? `${props.path}/${formData.value[props.itemKey || "id"]}`
      : (props.path as string);

    const urlHistory = `/package-anggota/transaction/${formData.value.id}`; // tulis disini url untuk history
    const url = isTransasction.value ? urlHistory : urlCreateUpdate;

    const payload = isTransasction.value
      ? {
          date_history: formData.value.date_history,
          note: formData.value.note,
          qty_use: 1,
        }
      : formData.value;

    const { errors, success } = await useApi(url, {
      withNotif: true,
      method: isEditing.value ? "PUT" : "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: payload,
    });

    validationErrors.value = errors ?? {};

    if (success) {
      isShow.value = false;

      if (props.refreshCallback) props.refreshCallback();

      emits("saved", true);
    }
  });
};

defineExpose({
  show(currentItem: typeof props.defaultForm, showHistory = false) {
    isShow.value = true;
    isTransasction.value = showHistory;
    validationErrors.value = {};

    if (currentItem) {
      formData.value = currentItem;
      modalTitle.value = props.editTitle || "Edit Item";
      isEditing.value = true;
    } else {
      modalTitle.value = props.title || "Add Item";
      formData.value = { ...props.defaultForm };
      isEditing.value = false;
    }
  },
});
</script>

<template>
  <VDialog
    v-model="isShow"
    scrollable
    location="top center"
    :width="width ?? 800"
  >
    <!-- Dialog Content -->
    <VForm ref="refVForm" @submit.prevent="save">
      <VCard>
        <VCardItem class="pb-3">
          <VCardTitle>
            {{ isTransasction ? "Pakai Kuota" : modalTitle }}
          </VCardTitle>
        </VCardItem>

        <DialogCloseBtn variant="text" size="default" @click="isShow = false" />

        <VDivider />

        <VCardText class="py-6">
          <VRow>
            <slot
              :is-editing="isEditing"
              :form-data="formData"
              :validation-errors="validationErrors"
            />
          </VRow>
        </VCardText>

        <VDivider />

        <VCardText class="overflow-visible d-flex justify-end flex-wrap gap-4">
          <VBtn type="submit">
            {{ isEditing ? "Update" : "Tambah" }}
          </VBtn>
        </VCardText>
      </VCard>
    </VForm>
  </VDialog>
</template>
