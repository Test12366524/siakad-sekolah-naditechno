export const useCommonStore = defineStore("commonStore", () => {
  const confirmDialog = ref();
  const pageLoader = ref();
  const snackbar = ref();

  return {
    pageLoader,
    snackbar,
    confirmDialog,
    setSnackbar(val: any) {
      snackbar.value = val;
    },
    setConfirmDialog(val: any) {
      confirmDialog.value = val;
    },
    setPageLoader(val: any) {
      pageLoader.value = val;
    },
  };
});
