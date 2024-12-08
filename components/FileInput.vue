<template>
  <div>
    <VFileInput
      v-model="files"
      :accept="accept"
      :label="label"
      :rules="rules"
      :multiple="multiple"
      small-chips
      chips
      :error-messages="errorMessages"
      @change="onFileChange"
      @click:clear="() => emit('change', { previewImageUrl: null })"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watchEffect } from "vue";

const files = ref<File[]>([]);

// Define props
const props = defineProps({
  modelValue: null, // Model can be a File or an Array of Files
  accept: String,
  label: String,
  rules: Array<any>,
  multiple: Boolean, // Prop to determine if multiple files are allowed
  errorMessages: null,
  previewImage: String, // Parent will bind this for image preview URL
});

// Define emits
const emit = defineEmits([
  "update:modelValue",
  "change",
  "update:previewImage",
]);

// Handle file change event
function onFileChange() {
  const previewImageUrl = URL.createObjectURL(files.value[0]);
  if (!props.multiple) {
    emit("update:modelValue", files.value[0]);
    emit("change", {
      previewImageUrl,
      ...files.value[0],
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

// Clean up object URLs to prevent memory leaks
watchEffect(() => {
  return () => {
    if (props.previewImage) {
      URL.revokeObjectURL(props.previewImage);
    }
  };
});
</script>
