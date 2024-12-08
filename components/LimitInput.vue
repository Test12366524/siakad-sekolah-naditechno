<template>
  <VTextField
    ref="textField"
    v-model="numberValue"
    :label="label"
    :rules="rules"
    :error-messages="errorMessages"
    type="text"
    :min="min"
    :max="max"
    :minlength="minlength"
    :maxlength="maxlength"
    @input="onNumberInput"
  >
    <template v-slot:append-inner>
      {{ props.appendInner }}
    </template>
  </VTextField>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, onMounted, ref } from "vue";

// Define reactive number value
const numberValue = ref<string | null>(null);

const textField = ref(null);

// Define props
const props = defineProps({
  modelValue: Number,
  label: String,
  rules: Array<any>,
  min: Number, // Minimum value for input
  max: Number, // Maximum value for input
  minlength: Number, // Minimum length for input
  maxlength: Number, // Maximum length for input
  errorMessages: null,
  appendInner: String,
});

// Define emits
const emit = defineEmits([
  "update:modelValue",
  "change",
  "input",
  "input-maxlength",
]);

// Handle number input event
function onNumberInput(event: Event) {
  if (props.min && props.max) {
    const inputValue = parseInt(
      (event.target as HTMLInputElement).value ?? 0,
      10
    );
    // Ensure the input is a number within the defined range
    if (
      !isNaN(inputValue) &&
      inputValue >= props.min &&
      inputValue <= props.max
    ) {
      numberValue.value = inputValue.toString();
      emit("update:modelValue", inputValue);
    } else {
      // Reset value if it goes out of range
      numberValue.value = "";
      emit("update:modelValue", "");
    }
  } else {
    numberValue.value =
      numberValue.value?.toString().replace(/[^0-9\.]/g, "") ?? "";
    emit("update:modelValue", numberValue.value);
  }

  if (props.maxlength && numberValue.value.length >= props.maxlength) {
    emit("input-maxlength", "");
  } else {
    emit("input", "");
  }
}

onMounted(() => {
  numberValue.value = props.modelValue as any;
});
</script>
