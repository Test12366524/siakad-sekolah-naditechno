<script lang="ts" setup>
import { ref } from "vue"; // Tambahkan nextTick dari Vue

const route = useRoute();

const formRef = ref();
const marketings = ref([]);
const cabangs = ref([]);

const anggota = ref({});

const form = {};

const error = useError();

onMounted(() => {

  useApi("marketing/all").then(({ data }) => {
    marketings.value = data;
  });

  useApi("cabang/all").then(({ data }) => {
    cabangs.value = data;
  });

  useApi(`anggota/${route.params.id}`).then(({ data, message, success }) => {
    if (!success) {
      error.value = {
        statusCode: 404,
      } as any;
    } else {
      anggota.value = {
        ...data,
      };

      console.log(anggota.value);
    }
  });
});

onMounted(() => {
  watch(
    anggota,
    () => {
      if (formRef.value) {
        formRef.value.init(anggota.value);
      }
    },
    {
      deep: true,
    }
  );
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem class="pb-3">
          <VCardTitle>Detail Pelanggan</VCardTitle>
        </VCardItem>

        <VDivider></VDivider>

        <VCardText>
          <VContainer>
            <SaveForm
              v-if="anggota"
              viewOnly
              path="anggota"
              ref="formRef"
              :default-form="form"
              v-slot="{ formData, validationErrors }"
              @saved="() => navigateTo('/pelanggan/data')"
            >
              <AnggotaForm
                viewOnly
                v-if="formData"
                :formData="formData"
                :validationErrors="validationErrors"
              ></AnggotaForm>
            </SaveForm>
          </VContainer>
          <!-- 👉 Form -->
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
