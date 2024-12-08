import { useApi } from "@/utils/api";

const DEFAULT_USER = {
  id: "",
  email: "",
  name: "",
  role: "",
};

export const useAuthStore = defineStore("auth", () => {
  const token = ref();

  const authenticated = ref(false);
  const user = ref({ ...DEFAULT_USER });
  const menus = ref([]);

  async function logout() {
    const { message, success } = await useApi("/auth/logout", {
      method: "POST",
    });

    if (!success) {
      throw message;
    }

    token.value = "";
    localStorage.removeItem(SESSION_TOKEN);

    return success;
  }

  async function fetchMenus() {
    const { data, success } = await useApi("/auth/menu", {
      withLoader: false,
    });

    menus.value = data ?? [];
  }

  async function validateLogin() {
    token.value = localStorage.getItem(SESSION_TOKEN);

    if (!token.value) return false;

    const { data, success } = await useApi("/auth/me", {
      withLoader: false,
    });

    authenticated.value = success;
    user.value = { ...data };

    if (!success) {
      localStorage.removeItem(SESSION_TOKEN);
      user.value = { ...DEFAULT_USER };
      return false;
    }

    await fetchMenus();

    user.value = data;
    return true;
  }

  async function login(credentials: { email: string; password: string }) {
    const { data, message, success } = await useApi("/auth/login", {
      method: "POST",
      data: credentials,
    });

    if (!success) {
      throw message;
    }

    localStorage.setItem(SESSION_TOKEN, data.token);
    user.value = data.user;
    authenticated.value = true;
    token.value = data.token;

    return data;
  }

  return { token, authenticated, user, login, validateLogin, logout, menus };
});
