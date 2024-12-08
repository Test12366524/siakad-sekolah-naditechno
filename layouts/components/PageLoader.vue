<script setup lang="ts">
const { pageLoader } = useCommonStore();
</script>

<template>
  <VDialog v-model="pageLoader" width="300">
    <VCard color="primary" width="300">
      <VCardText class="pt-3 text-white">
        Loading
        <VProgressLinear indeterminate class="mt-4" color="#fff" />
      </VCardText>
    </VCard>
  </VDialog>
</template>
