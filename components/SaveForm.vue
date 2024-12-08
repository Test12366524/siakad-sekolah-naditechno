<script lang="ts" setup>
import type { VForm } from "vuetify/lib/components/index.mjs";

const props = defineProps({
  title: String,
  customPath: String,
  path: String,
  refreshCallback: Function,
  defaultForm: Object,
  width: null || Number,
  itemKey: null || String,
  viewOnly: {
    type: Boolean,
  },
});

const emits = defineEmits(["update:modelValue", "saved"]);

const refVForm = ref<VForm>();

const isEditing = ref(false);
const isShow = ref(false);

const formData = ref(props.defaultForm as any);
const validationErrors = ref<any>({});
const route = useRoute();

const save = async () => {
  if (props.viewOnly) return;

  refVForm.value?.validate().then(async ({ valid }) => {
    if (!valid) return;

    const url = props.customPath
      ? props.customPath
      : isEditing.value
      ? `${props.path}/${
          formData.value[props.itemKey || "id"] ?? route.params.id
        }`
      : (props.path as string);

    const { errors, success } = await useApi(url, {
      withNotif: true,
      method: isEditing.value ? "PUT" : "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData.value,
    });

    if (success) {
      formData.value = props.defaultForm ?? {};
      isShow.value = false;

      if (props.refreshCallback) props.refreshCallback();

      emits("saved", true);
    }

    validationErrors.value = errors ?? {};
  });
};

defineExpose({
  setEditingMode(val: boolean) {
    isEditing.value = val;
  },
  init(currentItem: typeof props.defaultForm) {
    isShow.value = true;

    validationErrors.value = {};

    if (currentItem) {
      formData.value = currentItem;
      isEditing.value = true;
    } else {
      formData.value = props.defaultForm as any;
      isEditing.value = false;
    }
  },
});
</script>

<template>
  <VForm ref="refVForm" @submit.prevent="save">
    <VRow class="py-2">
      <slot
        :is-editing="isEditing"
        :form-data="formData"
        :validation-errors="validationErrors"
      />

      <VCol v-if="!viewOnly" cols="12" class="pt-6 text-end">
        <VDivider class="pt-6" />
        <VBtn type="submit">
          {{ isEditing ? "Update" : "Create" }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
