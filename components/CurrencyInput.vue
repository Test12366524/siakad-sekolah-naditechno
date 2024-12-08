<script setup>
import numeral from "numeral";
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [Number, String],
    required: true,
  },
  errorMessages: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

// Computed property to format the input with dots
const formattedValue = computed({
  get() {
    return numeral(props.modelValue).format("0,0").replace(/,/g, ".");
  },
  set(value) {
    // Replace all characters except numbers and dots
    const cleanedValue = value.replace(/[^0-9.]/g, "");
    const numericValue = Number(
      cleanedValue.replace(/\./g, "").replace("Rp", "")
    );
    emit("update:modelValue", numericValue);
  },
});
</script>

<template>
  <VTextField
    v-model="formattedValue"
    :error-messages="errorMessages"
    :label="label"
  >
    <template #prepend-inner>Rp.</template>
  </VTextField>
</template>
