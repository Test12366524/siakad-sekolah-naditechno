<script lang="ts" setup>
import type { VForm } from "vuetify/lib/components/index.mjs";

const props = defineProps({
  path: String,
  title: String,
  editTitle: String,
  detailTitle: String,
  refreshCallback: Function,
  defaultForm: Object,
  width: null || Number,
  itemKey: null || String,
  isDataNotValid: null || Boolean,
});

const emits = defineEmits(["update:modelValue", "saved", "save-single"]);

const refVForm = ref<VForm>();

const modalTitle = ref(props.title);
const isEditing = ref(false);
const isDetailForm = ref(false);
const isShow = ref(false);
const formData = ref({ ...props.defaultForm });
const validationErrors = ref({});
const isSingleData = ref(false);

const save = () => {
  isSingleData.value ? emits("save-single", formData.value.id) : emits("saved");
};

const isDataNotValidComputed = computed(() => props.isDataNotValid);

defineExpose({
  show(currentItem: typeof props.defaultForm, isDetail: boolean = false) {
    isShow.value = true;
    isDetailForm.value = isDetail;
    validationErrors.value = {};

    if (currentItem) {
      console.log("currentItem", currentItem);
      isSingleData.value = true;
      modalTitle.value = props.editTitle;
      formData.value = currentItem;
    } else {
      isSingleData.value = false;
      modalTitle.value = props.title;
      formData.value = {};
    }
  },
  hide() {
    isShow.value = false;
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
              :is-single-data="isSingleData"
            />
          </VRow>
        </VCardText>

        <VDivider />

        <VCardText class="overflow-visible d-flex justify-end flex-wrap gap-4">
          <VBtn type="submit" :disabled="isDataNotValidComputed">
            {{ isEditing ? "Update" : "Create" }}
          </VBtn>
        </VCardText>
      </VCard>
    </VForm>
  </VDialog>
</template>
