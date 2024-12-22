const { user } = useAuthStore();

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.client) {
    const authStore = useAuthStore();
    const authenticated = await authStore.validateLogin();

    if (!to.meta.unauthenticatedOnly) {
      if (!authenticated) {
        return navigateTo("/login");
      }
    } else {
      if (authenticated) {
        return navigateTo("/");
      }
    }
  }
  
});
