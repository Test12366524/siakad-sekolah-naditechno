export function useAppTable(conf: {
  path: string;
  limit?: number;
  kelas_id?: string | number | null;
  gender?: string | number | null;
  dosen_id?: string | number | null;
  mata_kuliah_id?: string | number | null;
}) {
  const loading = ref(false);
  const limit = ref(conf.limit || 15);
  const total = ref(0);
  const currentPage = ref(1);
  const search = ref("");
  const items = ref();
  const kelas_id = ref(conf.kelas_id || "");
  const gender = ref(conf.gender || "");
  const dosen_id = ref(conf.dosen_id || "");
  const mata_kuliah_id = ref(conf.mata_kuliah_id || "");

  const { snackbar } = useCommonStore();

  async function removeRowBy(val: any) {
    const { success, message } = await useApi(`${conf.path}/${val}`, {
      withLoader: true,
      method: "DELETE",
    });

    snackbar.show({ message, color: success ? "info" : "error" });

    if (success) fetchItems(true);
  }

  async function fetchItems(reset?: boolean) {
    if (reset) currentPage.value = 1;

    loading.value = true;

    // Create params object dynamically
    const params: Record<string, any> = {
      itemsPerPage: limit.value,
      limit: limit.value,
      page: currentPage.value,
      search: search.value,
    };

    // Only add gender if it has a value
    if (gender.value && String(gender.value).trim() !== "")
      params.gender = gender.value;

    // Only add kelas_id if it has a valid value
    if (kelas_id.value && kelas_id.value !== "" && Number(kelas_id.value) > 0)
      params.kelas_id = kelas_id.value;

    // Only add kelas_id if it has a valid value
    if (dosen_id.value && dosen_id.value !== "" && Number(dosen_id.value) > 0)
      params.dosen_id = dosen_id.value;

    // Only add kelas_id if it has a valid value
    if (
      mata_kuliah_id.value &&
      mata_kuliah_id.value !== "" &&
      Number(mata_kuliah_id.value) > 0
    )
      params.mata_kuliah_id = mata_kuliah_id.value;

    const { data, success, message } = await useApi(conf.path, {
      withLoader: false,
      params,
    });

    if (!success) snackbar.show({ message, color: "error" });

    loading.value = false;
    items.value = data.items ?? [];
    total.value = data.total;
  }

  return {
    limit,
    total,
    currentPage,
    search,
    items,
    loading,
    fetchItems,
    removeRowBy,
    kelas_id,
    gender,
    dosen_id,
    mata_kuliah_id,
  };
}

export function getMenus() {
  const { menus } = useAuthStore();

  return menus;
}

/**
 * Format date to Indonesian locale with various options
 * @param {string | Date} date - Date to format
 * @returns {object} Various formatted date strings
 */
export const formatFullDate = (date) => {
  if (!date) return null;

  const dateObj = new Date(date);

  // Basic date formatting
  const dateOnly = dateObj.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }); // Example: "15 November 2024"

  const dateWithDay = dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }); // Example: "Jumat, 15 November 2024"

  const dateShort = dateObj.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }); // Example: "15 Nov 2024"

  // Time formatting
  const timeOnly = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }); // Example: "14:30"

  const timeWithSeconds = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }); // Example: "14:30:45"

  // Combined date and time
  const dateTime = dateObj.toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }); // Example: "15 November 2024 14:30"

  const dateTimeShort = dateObj.toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }); // Example: "15 Nov 2024 14:30"

  const dateTimeWithSeconds = dateObj.toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }); // Example: "15 November 2024 14:30:45"

  // Custom numeric format
  const numeric = `${dateObj.getDate().toString().padStart(2, "0")}-${(
    dateObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${dateObj.getFullYear()}`;

  // Example: "15-11-2024"

  return {
    dateOnly,
    dateWithDay,
    dateShort,
    timeOnly,
    timeWithSeconds,
    dateTime,
    dateTimeShort,
    dateTimeWithSeconds,
    numeric,
  };
};
