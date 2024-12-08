<template>
  <VTextField
    v-model="formattedValue"
    :label="label"
    :rules="rules"
    :error-messages="errorMessages"
    type="text"
    :min="min"
    :max="max"
    @input="onNumberInput"
    @change="onChange"
  >
    <template v-slot:append-inner>
      {{ props.appendInner }}
    </template>
  </VTextField>
</template>
<script setup lang="ts">
import numeral from "numeral";
import { defineEmits, defineProps, ref } from "vue";

// Define props
const props = defineProps({
  modelValue: Number,
  label: String,
  rules: Array<any>,
  min: Number,
  max: Number,
  appendInner: String,
  errorMessages: null,
});

// Define emits
const emit = defineEmits(["update:modelValue", "change"]);

// Define reactive values
const numberValue = ref<number | null>(null);
const formattedValue = ref<string>(props.modelValue);

// Handle number input event
function onNumberInput(event: Event) {
  const inputValue = (event.target as HTMLInputElement).value;

  // Check for multiple periods (.) in the input
  const periodCount = (inputValue.match(/\./g) || []).length;

  if (periodCount > 1) {
    formattedValue.value = inputValue.substring(0, inputValue.length - 1);
  } else {
    formattedValue.value = inputValue.toString().replace(/[^0-9\.]/g, "");
  }

  emit("update:modelValue", formattedValue.value);
}

// Handle change event to emit final value
function onChange() {
  emit("change", numberValue.value);
}

// Format number using Numeral.js
function formatNumber(value: number | null): string {
  if (value === null) return "";
  return numeral(value).format("0,0.[00]"); // Format with commas for thousands and optional decimals
}
</script>
