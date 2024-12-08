<script setup lang="ts">
import AppSnackbar from "@/components/AppSnackbar.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import PageLoaderDialog from "@/components/PageLoaderDialog.vue";
import initCore from "@core/initCore";
import { initConfigStore, useConfigStore } from "@core/stores/config";
import { hexToRgb } from "@layouts/utils";
import { useTheme } from "vuetify";

const { global } = useTheme();

// ℹ️ Sync current theme with initial loader theme
initCore();
initConfigStore();

const pending = ref(true);
const configStore = useConfigStore();
const { setConfirmDialog, setSnackbar, setPageLoader } = useCommonStore();
const { isMobile } = useDevice();

if (isMobile) configStore.appContentLayoutNav = "vertical";

const confirmDialogRef = ref();
const snackbarRef = ref();
const pageLoaderDialogRef = ref();

watchEffect(() => {
  if (confirmDialogRef.value) {
    setConfirmDialog(confirmDialogRef.value);
  }

  if (snackbarRef.value) {
    setSnackbar(snackbarRef.value);
  }

  if (pageLoaderDialogRef.value) {
    setPageLoader(pageLoaderDialogRef.value);
  }
});

onMounted(() => {
  if (process.client) {
    pending.value = false;
  }
});
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL" v-if="!pending">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp
      :style="`--v-global-theme-primary: ${hexToRgb(
        global.current.value.colors.primary
      )}`"
    >
      <NuxtLayout>
        <ConfirmDialog ref="confirmDialogRef" />

        <!-- page loader -->
        <PageLoaderDialog ref="pageLoaderDialogRef"></PageLoaderDialog>

        <!-- popup -->
        <AppSnackbar ref="snackbarRef"></AppSnackbar>

        <NuxtPage
          v-if="confirmDialogRef && snackbarRef && pageLoaderDialogRef"
        />
      </NuxtLayout>
      <!-- <ScrollToTop /> -->
    </VApp>
  </VLocaleProvider>
</template>
