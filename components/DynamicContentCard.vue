<script setup lang="ts">
defineProps({
  row: null,
  imgW: null,
  imgH: null,
  withImg: null || Boolean,
  onEdit: Function,
  onRemove: Function,
});
</script>

<template>
  <VCard class="fill-height">
    <VCardText v-if="withImg">
      <VImg
        :src="row.img || getDefaultImg(imgW, imgH)"
        :width="imgW"
        :height="imgH"
      />
    </VCardText>

    <VCardText>
      <div class="on-primary text-xl">{{ row.title }}</div>
    </VCardText>

    <VCardText> {{ row.description }} </VCardText>

    <slot></slot>

    <VCardActions>
      <VBtn @click="onEdit" color="warning">
        <VIcon>ri-edit-fill</VIcon>
        Edit
      </VBtn>

      <VBtn @click="onRemove" color="error">
        <VIcon>ri-close-fill</VIcon>
        Delete
      </VBtn>
    </VCardActions>
  </VCard>
</template>
