export const useUserStore = defineStore("user", {
  state: () => ({ waliKelasData: null }),
  actions: {
    setWaliKelasData(data) {
      this.waliKelasData = data;
    },
  },
});
