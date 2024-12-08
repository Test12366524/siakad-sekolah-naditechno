<script lang="ts" setup>
const props = defineProps({
  url: String,
  modelValue: Boolean,
  withImg: null || Boolean,
  width: String,
  imgW: null || Number,
  imgH: null || Number,
  title: String,
  editTitle: String,
  refreshCallback: Function,
  defaultForm: Object,
  withOrder: Boolean,
  imgOnly: Boolean,
});

const modalTitle = ref(props.title);
const emits = defineEmits(["update:modelValue", "saved"]);

const isEditing = ref(false);
const isShow = ref(false);

const DEFAULT_FORM = props.defaultForm ?? {
  id: undefined,
  title: "",
  description: "",
  img: undefined,
};

const imgW = ref<any>(props.imgW ?? 48);
const imgH = ref<any>(props.imgH ?? 48);

const previewImage = ref(getDefaultImg(imgW.value, imgH.value));

const formData = ref({ ...DEFAULT_FORM });
const validationErrors = ref({ ...DEFAULT_FORM });

const save = async () => {
  const { errors, success } = await useApi(`${props.url}`, {
    withNotif: true,
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData.value,
  });

  validationErrors.value = errors ?? { ...DEFAULT_FORM };

  if (success) {
    isShow.value = false;

    if (props.refreshCallback) {
      props.refreshCallback();
    }

    emits("saved", true);
  }
};

defineExpose({
  show(currentItem: typeof DEFAULT_FORM) {
    isShow.value = true;

    validationErrors.value = { ...DEFAULT_FORM };

    previewImage.value = getDefaultImg(imgW.value, imgH.value);

    if (currentItem) {
      const item = { ...currentItem };

      previewImage.value = item.img || getDefaultImg(imgW.value, imgH.value);

      delete item.img;

      formData.value = item;
      modalTitle.value = props.editTitle || "Edit Item";
      isEditing.value = true;
    } else {
      modalTitle.value = props.title || "Add Item";
      formData.value = { ...DEFAULT_FORM };
      isEditing.value = false;
    }
  },
});

const propsSlot = {
  formData,
  validationErrors,
  previewImage,
};
</script>

<template>
  <VDialog location="top center" v-model="isShow" :width="width ?? '600'">
    <!-- Dialog Content -->
    <VCard :title="modalTitle">
      <DialogCloseBtn variant="text" size="default" @click="isShow = false" />

      <VForm @submit.prevent="save">
        <VCardText>
          <VRow v-if="!$slots.custom">
            <VCol cols="12" v-if="withOrder">
              <VTextField
                :error-messages="validationErrors.number"
                v-model="formData.number"
                label="Number"
                type="number"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                :error-messages="validationErrors.title"
                v-model="formData.title"
                label="Title"
              />
            </VCol>
            <VCol cols="12">
              <VTextarea
                :error-messages="validationErrors.description"
                v-model="formData.description"
                label="Description"
              />
            </VCol>
            <VCol cols="12" v-if="withImg">
              <div class="d-flex flex-column ga-2 justify-content-center">
                <VImg
                  color="primary"
                  class="mx-auto mb-3"
                  :width="imgW"
                  :height="imgH"
                  cover
                  :src="previewImage"
                ></VImg>
                <FileInput
                  @change="({previewImageUrl}: any) => {
                    previewImage = previewImageUrl
                  }"
                  accept="image/*"
                  label="Upload Image"
                  small-chips
                  v-model="formData.img"
                  :error-messages="validationErrors.img"
                  chips
                />
              </div>
            </VCol>

            <slot v-bind="propsSlot"></slot>
          </VRow>

          <slot name="custom" v-bind="propsSlot"></slot>
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
