<script lang="ts" setup>
import type { VForm } from "vuetify/lib/components/index.mjs";

const props = defineProps({
  path: String,
  title: String,
  editTitle: String,
  detailTitle: String,
  refreshCallback: Function,
  defaultForm: Object,
  width: Number,
  itemKey: String,
});

const emits = defineEmits(["update:modelValue", "saved"]);

const refVForm = ref<VForm>();

const modalTitle = ref(props.title);
const isEditing = ref(false);
const isDetailForm = ref(false);
const isShow = ref(false);

const formData = ref({ ...props.defaultForm });
const validationErrors = ref({});

const save = async () => {
  refVForm.value?.validate().then(async ({ valid }) => {
    if (!valid) return;
    const payload = { ...formData.value };

    const url = isEditing.value
      ? `${props.path}/${formData.value[props.itemKey || "id"]}`
      : (props.path as string);

    if (payload.image && typeof payload.image === "string")
      payload.image = null;

    if (payload.cover && typeof payload.cover === "string")
      payload.cover = null;
    if (payload.photo && typeof payload.photo === "string")
      payload.photo = null;

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
  show(currentItem: typeof props.defaultForm, isDetail: boolean = false) {
    isShow.value = true;
    isDetailForm.value = isDetail;
    validationErrors.value = {};
    if (currentItem) {
      formData.value = currentItem;
      modalTitle.value = isDetail
        ? props.detailTitle || "Detail Item"
        : props.editTitle || "Edit Item";
      isEditing.value = true;
    } else {
      modalTitle.value = props.title || "Add Item";
      formData.value = { ...props.defaultForm };
      isEditing.value = false;
    }
    console.log("isDetailFORM", isDetailForm.value);
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
          <VCardTitle>{{ modalTitle }}</VCardTitle>
        </VCardItem>

        <DialogCloseBtn variant="text" size="default" @click="isShow = false" />

        <VDivider />

        <VCardText class="py-6">
          <VRow>
            <slot
              :is-editing="isEditing"
              :form-data="formData"
              :validation-errors="validationErrors"
              :is-detail="isDetailForm"
            />
          </VRow>
        </VCardText>

        <VDivider />

        <VCardText
          v-if="!isDetailForm"
          class="overflow-visible d-flex justify-end flex-wrap gap-4"
        >
          <VBtn type="submit">
            {{ isEditing ? "Update" : "Create" }}
          </VBtn>
        </VCardText>
      </VCard>
    </VForm>
  </VDialog>
</template>
