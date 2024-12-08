<script lang="ts" setup>
interface Args {
  title: string;
  message: string;
  onConfirm?: Function;
  onCancel?: Function;
}

const isDialogVisible = ref(false);
const options = ref<Args>({} as any);

const onCancel = () => {
  if (options.value.onCancel) {
    options.value.onCancel();
  }

  isDialogVisible.value = false;
};

const onConfirm = () => {
  if (options.value.onConfirm) {
    options.value.onConfirm();
  }

  isDialogVisible.value = false;
};

defineExpose({
  show(args: Args) {
    isDialogVisible.value = true;
    options.value = { ...args };
  },
});
</script>

<template>
  <VDialog v-model="isDialogVisible" persistent class="v-dialog-sm">
    <!-- Dialog Content -->
    <VCard :title="options.title">
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="isDialogVisible = false"
      />

      <VCardText>
        {{ options.message }}
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-4">
        <VBtn color="error" @click="onCancel">No</VBtn>
        <VBtn color="success" @click="onConfirm">Yes</VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
