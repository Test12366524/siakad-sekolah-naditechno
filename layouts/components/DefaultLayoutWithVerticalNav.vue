<script lang="ts" setup>
import { useConfigStore } from "@core/stores/config";

// Components
import Footer from "@/layouts/components/Footer.vue";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import UserProfile from "@/layouts/components/UserProfile.vue";

// @layouts plugin
import { VerticalNavLayout } from "@layouts";

const configStore = useConfigStore();
const router = useRouter();

// ℹ️ Provide animation name for vertical nav collapse icon.
const verticalNavHeaderActionAnimationName = ref<
  null | "rotate-back-180" | "rotate-180"
>(null);

watch(
  [() => configStore.isVerticalNavCollapsed, () => configStore.isAppRTL],
  (val) => {
    if (configStore.isAppRTL) {
      verticalNavHeaderActionAnimationName.value = val[0]
        ? "rotate-back-180"
        : "rotate-180";
    } else {
      verticalNavHeaderActionAnimationName.value = val[0]
        ? "rotate-180"
        : "rotate-back-180";
    }
  },
  { immediate: true }
);

const menus = getMenus();
</script>

<template>
  <VerticalNavLayout :nav-items="menus">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn
          id="vertical-nav-toggle-btn"
          class="ms-n2 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="ri-menu-line" />
        </IconBtn>

        <VSpacer />

        <NavbarThemeSwitcher />
        <!-- <NavBarNotifications class="me-2" /> -->
        <UserProfile />
      </div>
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
     <!-- 👉 Customizer -->
    <TheCustomizer />
    <!-- <TheCustomizer /> -->
  </VerticalNavLayout>
</template>

<style lang="scss">
@keyframes rotate-180 {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(180deg);
  }
}

@keyframes rotate-back-180 {
  from {
    transform: rotate(180deg);
  }

  to {
    transform: rotate(0deg);
  }
}

.layout-vertical-nav {
  .nav-header {
    .header-action {
      animation-duration: 0.35s;
      animation-fill-mode: forwards;
      animation-name: v-bind(verticalNavHeaderActionAnimationName);
      transform: rotate(0deg);
    }
  }
}
</style>
