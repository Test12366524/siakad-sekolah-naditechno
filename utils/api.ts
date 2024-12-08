import type { ApiResponse } from "@/interfaces";
import type { AxiosRequestConfig } from "axios";
import axios, { AxiosError } from "axios";
import { defu } from "defu";

export const $api = $fetch.create({
  // Request interceptor
  async onRequest({ options }) {
    // Set baseUrl for all API calls
    options.baseURL = useRuntimeConfig().public.apiBaseURL || "/api";

    const accessToken = useCookie("accessToken").value;
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
  },
});

export const useApi = async <T = any>(
  url: string,
  options: AxiosRequestConfig & {
    isContentApi?: boolean;
    withLoader?: boolean;
    withNotif?: boolean;
    scrollToTopAfterSuccess?: boolean;
  } = {}
): Promise<ApiResponse<T>> => {
  const { snackbar, pageLoader } = useCommonStore();
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const accessToken = authStore.token;

  options = {
    isContentApi: true,
    withLoader: true,
    scrollToTopAfterSuccess: false,
    ...options,
  };

  const defaults: AxiosRequestConfig = {
    baseURL: options.isContentApi
      ? config.public.apiContentBaseURL
      : config.public.apiBaseURL,
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  };

  // Merge defaults with provided options using Object.assign or a deep merge utility
  const params = defu(options, defaults); // Alternatively, you can use deepmerge if needed

  try {
    if (options.withLoader) pageLoader.show();

    const res = await axios({
      url,
      ...params,
      data:
        params.headers?.["Content-Type"] == "multipart/form-data"
          ? objectToFormData(params.data ?? {})
          : params.data,
    });

    const resData = res.data as ApiResponse;

    if (options.withNotif) {
      snackbar.show({
        message: resData.message,
        color: resData.success ? "info" : "error",
      });
    }

    if (options.scrollToTopAfterSuccess) {
      try {
        window.scrollTo({
          behavior: "instant",
          top: 0,
        });
      } catch (error) {}
    }

    if (options.withLoader) pageLoader.hide();

    return resData;
  } catch (error) {
    if (options.withLoader) pageLoader.hide();

    if (error instanceof AxiosError && error.response?.data) {
      const resData = error.response?.data;

      if (options.withNotif) {
        snackbar.show({
          message: resData.message,
          color: resData.success ? "info" : "error",
        });
      }

      return error.response?.data;
    }

    throw error;
  }
};

export const objectToParams = (obj: any) => {
  return `?${Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join("&")}`;
};
