<script setup lang="ts">
const runtime = useRuntimeConfig();

const props = defineProps({
  path: String,
});
</script>

<template>
  <VBtn
    variant="text"
    target="_blank"
    :href="`${runtime.public.websiteURL}${props.path ?? ''}`"
  >
    Preview
  </VBtn>
</template>
