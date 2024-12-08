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
  customButtonText: null || String,
  formOrder: null || Array,
});

const emits = defineEmits(["update:modelValue", "saved"]);

const refVForm = ref<VForm>();

const modalTitle = ref(props.title);
const isEditing = ref(false);
const isShow = ref(false);

const formData = ref({ ...props.defaultForm });
const validationErrors = ref({});

const action = async () => {
  const url = `${props.path}/${formData.value[props.itemKey || "id"]}`;

  const { errors, success } = await useApi(url, {
    withNotif: true,
    method: "PUT",
    data: {
      payment: formData.value.pay_order,
    },
  });

  if (success) {
    isShow.value = false;

    if (props.refreshCallback) props.refreshCallback();

    emits("saved", true);
  }
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
    v-model="isShow"
    scrollable
    location="top center"
    :width="width ?? 800"
  >
    <!-- Dialog Content -->
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
          />
        </VRow>
      </VCardText>

      <VDivider />

      <VCardText class="d-flex justify-end flex-wrap gap-4">
        <VBtn @click="action"> Pay </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
