<script lang="ts" setup>
const isShow = ref(false);

defineExpose({
  show() {
    isShow.value = true;
  },
  hide() {
    isShow.value = false;
  },
});
</script>

<template>
  <VDialog v-model="isShow" width="300">
    <VCard color="primary" width="300">
      <VCardText class="pt-3 text-white">
        Loading
        <VProgressLinear indeterminate class="mt-4" color="#fff" />
      </VCardText>
    </VCard>
  </VDialog>
</template>
