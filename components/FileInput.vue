<script setup lang="ts">
import axios from 'axios';
import { defineEmits, defineProps, ref, watchEffect } from "vue";

const config = useRuntimeConfig();
const url = config.public.fileUploadUrl

// Define props
const props = defineProps({
  modelValue: null, // Model can be a File or an Array of Files
  accept: String,
  label: String,
  rules: Array<any>,
  multiple: Boolean, // Prop to determine if multiple files are allowed
  errorMessages: null,
  previewImage: String, // Parent will bind this for image preview URL
  showPreview: Boolean,
  disabled: Boolean,
  readonly: Boolean,
});

// Define emits
const emit = defineEmits([
  "update:modelValue",
  "change",
  "update:previewImage",
]);

const files = ref<File[]>([]);

// Handle file change event
async function onFileChange() {
  let previewImageUrl = null;
  let file = null;
  if (!props.multiple) {

    const formDataUpload = new FormData();
    formDataUpload.append('file', files.value[0]); // Perhatikan nama 'file' ini!
    try {
      
      const response = await axios.post(url + '/', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data', // Wajib!
        }
      });

      console.log('File berhasil diupload:', response.data);
      previewImageUrl = url + '/' + response.data;
      file = response.data;
    } catch (error) {
      console.error('Gagal mengupload file:', error);
    }
    emit("update:modelValue", file);
    emit("change", {
      previewImageUrl,
      file,
    });
  } else {
    emit("update:modelValue", files.value);
    emit("change", files.value);
  }

  // Generate a preview URL and emit it to the parent
  // if (files.value.length > 0) {
  //   const previewImageUrl = URL.createObjectURL(files.value[0]);
  //   emit("update:previewImage", previewImageUrl);
  // } else {
  //   emit("update:previewImage", ""); // Clear the preview URL if no file selected
  // }
}

const getLabel = computed(() =>
  typeof props.modelValue === "string" ? props.modelValue : props.label
);

// Clean up object URLs to prevent memory leaks
watchEffect(() => {
  return () => {
    if (props.previewImage) URL.revokeObjectURL(props.previewImage);
  };
});
</script>

<template>
  <div class="d-flex justify-center items-center gap-2">
    <VFileInput
      v-model="files"
      :accept="accept"
      :label="label"
      :rules="rules"
      :multiple="multiple"
      :disabled="disabled"
      :readonly="readonly"
      small-chips
      chips
      :error-messages="errorMessages"
      @change="onFileChange"
      @click:clear="() => emit('change', { previewImageUrl: null })"
    />
    <VBtn
      v-if="showPreview && props.modelValue"
      size="small"
      class="d-flex justify-center items-center mt-2"
      @click="
        () => {
          console.log('files', files);
          openFileHandler(props.modelValue);
        }
      "
    >
      <VIcon icon="ri-eye-line" class="mr-2" /> Lihat
    </VBtn>
  </div>
</template>
