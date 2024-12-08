<script lang="ts" setup>
interface Args {
  title: string;
  message: string;
  color: string;
}

const isShow = ref(false);

const options = ref<Args>({} as any);

defineExpose({
  show(args: Args) {
    isShow.value = true;
    options.value = { ...args };
  },
});
</script>

<template>
  <VSnackbar
    v-model="isShow"
    transition="fade-transition"
    :color="options.color"
    timeout="3000"
    location="top center"
    @timeout="isShow = false"
  >
    <VIcon v-if="options.color == 'info'" left>ri-information-fill</VIcon>
    <VIcon v-else-if="options.color == 'error'" left
      >ri-error-warning-fill</VIcon
    >
    {{ options.message }}
  </VSnackbar>
</template>
