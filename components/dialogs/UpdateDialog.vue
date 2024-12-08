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
const validationErrors = ref({ ...props.defaultForm });

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

    validationErrors.value = errors ?? { ...props.defaultForm };

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

    validationErrors.value = { ...props.defaultForm };

    if (currentItem) {
      const item = { ...currentItem };

      formData.value = item;
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
  <VDialog location="top center" v-model="isShow" :width="width ?? 800">
    <!-- Dialog Content -->
    <VCard :title="modalTitle">
      <DialogCloseBtn variant="text" size="default" @click="isShow = false" />

      <VForm ref="refVForm" @submit.prevent="save">
        <VCardText>
          <VRow>
            <slot
              :isEditing="isEditing"
              :formData="formData"
              :validationErrors="validationErrors"
            ></slot>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn type="submit">
            {{ isEditing ? "Update" : "Create" }}
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
