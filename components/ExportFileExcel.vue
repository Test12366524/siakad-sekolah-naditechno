<script setup>
const props = defineProps({
  path: String,
});

const emit = defineEmits(["done"]);

function exportExcel() {
  useApi(props.path, {
    method: "POST",
  }).then(({ data, success }) => {
    if (success) {
      window.open(data);
    }
  });
}
</script>

<template>
  <VBtn @click="exportExcel" color="success-darken-1">
    <VIcon end icon="ri-upload-fill" />
    Export Data
  </VBtn>
</template>
