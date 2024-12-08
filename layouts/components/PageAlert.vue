<script setup lang="ts">
const { snackbar, hideSnackbar } = useCommonStore();
</script>

<template>
  <VSnackbar
    v-model="snackbar.show"
    transition="fade-transition"
    :color="snackbar.color"
    timeout="3000"
    location="top center"
  >
    <VIcon v-if="snackbar.color == 'info'" left>ri-information-fill</VIcon>
    <VIcon v-else-if="snackbar.color == 'error'" left
      >ri-error-warning-fill</VIcon
    >
    {{ snackbar.message }}
  </VSnackbar>
</template>
