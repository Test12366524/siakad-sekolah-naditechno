<template>
  <div
    class="h-100 d-flex align-center justify-space-between text-medium-emphasis"
  >
    <!-- 👉 Footer: left content -->
    <div class="d-flex align-center text-base">
      &copy;
      {{ new Date().getFullYear() }}
      PKU MUI Jakarta
    </div>
    <!-- 👉 Footer: right content -->
    <span
      class="d-md-flex gap-x-4 text-primary d-none"
      style="display: none !important"
    >
      <a href="" target="noopener noreferrer">Shopee</a>
      <a href="" target="noopener noreferrer">Tiktok</a>
      <a href="" target="noopener noreferrer">Instagram</a>
      <a href="" target="noopener noreferrer">Website</a>
    </span>
  </div>
</template>
