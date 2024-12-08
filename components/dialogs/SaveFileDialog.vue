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

const refVForm = ref<VForm>();

const modalTitle = ref(props.title);
const emits = defineEmits(["update:modelValue", "saved"]);

const isEditing = ref(false);
const isShow = ref(false);

const formData = ref({ ...props.defaultForm });
const validationErrors = ref({});

const save = async () => {
  refVForm.value?.validate().then(async function ({ valid }) {
    if (!valid) return;

    const url = isEditing.value
      ? `${props.path}/${formData.value[props.itemKey || "id"]}`
      : (props.path as string);

    const { errors, success } = await useApi(url, {
      withNotif: true,
      method: isEditing.value ? "PUT" : "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData.value,
    });

    validationErrors.value = errors ?? {};

    if (success) {
      isShow.value = false;

      if (props.refreshCallback) {
        props.refreshCallback();
      }

      emits("saved", true);
    }
  });
};

defineExpose({
  show(currentItem: typeof props.defaultForm) {
    isShow.value = true;

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
    scrollable
    location="top center"
    v-model="isShow"
    :width="width ?? 800"
  >
    <!-- Dialog Content -->
    <VForm ref="refVForm" @submit.prevent="save">
      <VCard>
        <VCardItem class="pb-3">
          <VCardTitle>{{ modalTitle }}</VCardTitle>
        </VCardItem>

        <DialogCloseBtn variant="text" size="default" @click="isShow = false" />

        <VDivider></VDivider>

        <VCardText class="py-6">
          <VRow>
            <slot
              :isEditing="isEditing"
              :formData="formData"
              :validationErrors="validationErrors"
            ></slot>
          </VRow>
        </VCardText>

        <VDivider></VDivider>

        <VCardText class="overflow-visible d-flex justify-end flex-wrap gap-4">
          <VBtn type="submit">
            {{ isEditing ? "Update" : "Create" }}
          </VBtn>
        </VCardText>
      </VCard>
    </VForm>
  </VDialog>
</template>
