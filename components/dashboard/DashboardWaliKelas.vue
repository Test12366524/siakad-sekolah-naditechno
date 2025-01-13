<script setup lang="ts"></script>

<template>
  <VCard max-height="400">
    <!-- SECTION Card Header and Menu -->
    <VCardItem>
      <!-- 👉 Title -->
      <VCardTitle class="mb-4">
        <VIcon size="20" start icon="ri-user-star-line" /> Wali Kelas
      </VCardTitle>
      <VDivider class="mb-5" />
      <VRow>
        <VCol cols="12" md="6" class="d-flex align-center gap-4">
          <VBtn
            color="primary"
            @click="
              () => {
                navigateTo('/kelas-wali-kelas');
              }
            "
          >
            <VIcon start icon="ri-calendar-todo-fill" />
            Kelas
          </VBtn>

          <VBtn
            color="primary"
            @click="
              () => {
                navigateTo('/absensi-wali-kelas');
              }
            "
          >
            <VIcon start icon="ri-calendar-check-line" />
            Absensi
          </VBtn>
        </VCol>
      </VRow>
    </VCardItem>
  </VCard>
</template>

<style lang="scss" scoped></style>
