<script lang="ts" setup>
import { themeConfig } from "@themeConfig";

// Components
import Footer from "@/layouts/components/Footer.vue";

// import NavbarShortcuts from '@/layouts/components/NavbarShortcuts.vue'
import { getMenus } from "@/composables/common";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import UserProfile from "@/layouts/components/UserProfile.vue";
import { HorizontalNavLayout } from "@layouts";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";

const menus = getMenus();
</script>

<template>
  <HorizontalNavLayout :nav-items="menus">
    <!-- 👉 navbar -->
    <template #navbar>
      <NuxtLink to="/" class="app-logo">
        <VNodeRenderer :nodes="themeConfig.app.logo" />

        <h1 class="app-logo-title leading-normal">
          {{ themeConfig.app.title }}
        </h1>
      </NuxtLink>
      <VSpacer />

      <NavbarThemeSwitcher />
      <UserProfile />
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </HorizontalNavLayout>
</template>

<style lang="scss" scoped>
.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;

  .app-logo-title {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.75rem;
    text-transform: capitalize;
  }
}
</style>
