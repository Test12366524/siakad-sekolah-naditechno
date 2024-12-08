<script lang="ts" setup>
import { ref } from "vue"; // Tambahkan nextTick dari Vue

const route = useRoute();

const formRef = ref();
const currentTab = ref(0);
const marketings = ref([]);
const cabangs = ref([]);
const previewKTP = ref("");

const anggota = ref({});

const form = {};

const error = useError();

onMounted(() => {
  useApi(`anggota/${route.params.id}`).then(({ data, message, success }) => {
    if (!success) {
      error.value = {
        statusCode: 404,
      } as any;
    } else {
      anggota.value = {
        ...data,
      };
      formRef.value?.init(anggota.value);
      formRef.value?.setEditingMode(true);
      console.log("DATA", data);
    }
  });
});

// onMounted(() => {
//   watch(
//     anggota,
//     () => {
//       if (formRef.value) {
//         formRef.value.init(anggota.value);
//       }
//     },
//     {
//       deep: true,
//     }
//   );
// });
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem class="pb-3">
          <VCardTitle>Edit Pelanggan</VCardTitle>
        </VCardItem>

        <VDivider />

        <VCardText>
          <VContainer>
            <SaveForm
              v-if="anggota"
              ref="formRef"
              v-slot="{ formData, validationErrors }"
              path="anggota"
              :default-form="form"
              @saved="() => navigateTo('/pelanggan/data')"
            >
              <AnggotaForm
                v-if="formData"
                :form-data="formData"
                :validation-errors="validationErrors"
              />
            </SaveForm>
          </VContainer>
          <!-- 👉 Form -->
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
