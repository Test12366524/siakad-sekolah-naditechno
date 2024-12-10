export function objectToFormData(
  obj: any,
  formData: FormData = new FormData(),
  parentKey: string | null = null
): FormData {
  // Iterasi objek dan array
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const fullKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value instanceof File || value instanceof Blob) {
      // Jika File atau Blob, langsung append
      formData.append(fullKey, value);
    } else if (Array.isArray(value)) {
      // Jika array, tambahkan rekursi untuk setiap elemen
      value.forEach((item, index) => {
        const arrayKey = `${fullKey}[${index}]`; // Membuat key dengan notasi [index]

        if (item instanceof File || item instanceof Blob) {
          formData.append(arrayKey, item);
        } else if (typeof item === "object" && value !== null) {
          // Jika objek, rekursif untuk nested object
          objectToFormData(value, formData, fullKey);
        } else {
          formData.append(arrayKey, item);
        }
      });
    } else if (typeof value === "object" && value !== null) {
      // Jika objek, rekursif untuk nested object
      objectToFormData(value, formData, fullKey);
    } else {
      if (value !== undefined) {
        // Jika tipe data dasar (string, number, boolean, dll)
        formData.append(fullKey, value);
      }
    }
  });

  return formData;
}

export function getDefaultImg(w: string | number, h: string | number) {
  return `https://placehold.co/${w}x${h}`;
}

export const rupiahFormater = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export const openFileHandler = (file) => {
  const fileUrl =
    typeof file !== "string"
      ? URL.createObjectURL(file)
      : `https://apinestsiakad.sonisetiawan.my.id/assets/public/${file}`;

  window.open(fileUrl, "_blank");
};
