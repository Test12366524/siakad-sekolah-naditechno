<script setup lang="ts">
import { useAuthStore } from "@/stores/auth"; // Sesuaikan dengan path store Anda
import { useCommonStore } from "@/stores/common"; // Sesuaikan dengan path store Anda
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const { confirmDialog } = useCommonStore();
const route = useRoute();
const kusionerId = computed(() => route.query.id);
const questions = ref([]);
useApi("kuisioner-detail?kuisioner_id=" + kusionerId.value).then(({ data }) => {
  if (data.items) {
    // Assign nilai items ke questions
    questions.value = data.items.map((item: any) => ({
      id: item.id,
      kuisioner_id: item.kuisioner_id,
      nomer: item.nomer,
      soal: item.soal,
      jawaban_a: item.jawaban_a,
      jawaban_b: item.jawaban_b,
      jawaban_c: item.jawaban_c,
      jawaban_d: item.jawaban_d,
      jawaban_e: item.jawaban_e,
      jawaban_benar: item.jawaban_benar || null, // Null jika tidak tersedia
      created_at: item.created_at || null,
      updated_at: item.updated_at || null,
      kuisioner_title: item.kuisioner_title || "",
      kuisioner_description: item.kuisioner_description || "",
      mata_pelajaran_name: item.mata_pelajaran_name || "",
    }));
    
  }
});


const selectedAnswers = ref({});
const currentQuestionIndex = ref(0);
const { user } = useAuthStore();

const submitAnswers = async () => {
  const url = `/kuisioner-siswa`;

  const payload = {
    kuisioner_id: kusionerId.value,
    user_id: user.id,
  }
  const { errors, success, data: responseData } = await useApi(url, {
    withNotif: true,
    method: "POST",
    data: payload,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (success) {
    const kuisionerSiswaId = responseData?.id || null; // Mengambil ID dari response

    if (!kuisionerSiswaId) {
      console.error("ID kuisioner siswa tidak ditemukan.");
      return;
    }

    // Looping `selectedAnswers` untuk memproses detail
    for (const [kuisionerDetailId, jawaban] of Object.entries(selectedAnswers.value)) {
      const url_detail = '/kuisioner-siswa-detail';

      const detailPayload = {
        kuisioner_siswa_id: kuisionerSiswaId,
        kuisioner_detail_id: kuisionerDetailId,
        jawaban: jawaban,
      };

      const { errors: detailErrors, success: detailSuccess } = await useApi(url_detail, {
        withNotif: true,
        method: "POST",
        data: detailPayload,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!detailSuccess) {
        console.error(`Gagal mengirim detail untuk kuisioner_detail_id: ${kuisionerDetailId}`, detailErrors);
        navigateTo('/kuisioner-siswa');
      } else {
        console.log(`Berhasil mengirim jawaban untuk kuisioner_detail_id: ${kuisionerDetailId}`);
        navigateTo('/kuisioner-siswa');
      }
    }
  }
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1)
    currentQuestionIndex.value++;
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) currentQuestionIndex.value--;
};

const progress = computed(() => {
  return ((currentQuestionIndex.value + 1) / questions.value.length) * 100;
});
</script>

<template>
  <VContainer>
    <VRow v-if="questions.length > 0">
      <VCol cols="12">
        <VCard class="pt-3 pb-4" >
          <VCardTitle>
            {{ questions[0].kuisioner_title }}
          </VCardTitle>
          <VCardSubtitle>
            Mata Pelajaran: {{ questions[0].mata_pelajaran_name }}
          </VCardSubtitle>
        </VCard>
      </VCol>
    </VRow>
    <VRow v-if="questions.length > 0">
      <VCol cols="12">
        <VProgressLinear
          :model-value="progress"
          color="primary"
          height="10"
          striped
        />
      </VCol>
    </VRow>
    <VRow v-if="questions.length > 0">
      <VCol cols="12">
        <VCard>
          <VCardText>
            <h3>
              {{ questions[currentQuestionIndex].nomer }}.
              {{ questions[currentQuestionIndex].soal }}
            </h3>
            <VRadioGroup
              v-model="selectedAnswers[questions[currentQuestionIndex].id]"
              :name="`question-${questions[currentQuestionIndex].id}`"
            >
              <VRadio
                :label="questions[currentQuestionIndex].jawaban_a"
                value="A"
              />
              <VRadio
                :label="questions[currentQuestionIndex].jawaban_b"
                value="B"
              />
              <VRadio
                :label="questions[currentQuestionIndex].jawaban_c"
                value="C"
              />
              <VRadio
                :label="questions[currentQuestionIndex].jawaban_d"
                value="D"
              />
              <VRadio
                :label="questions[currentQuestionIndex].jawaban_e"
                value="E"
              />
            </VRadioGroup>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="6">
        <VBtn
          color="secondary"
          :disabled="currentQuestionIndex === 0"
          @click="prevQuestion"
        >
          Sebelumnya
        </VBtn>
      </VCol>
      <VCol
        v-if="currentQuestionIndex === questions.length - 1"
        cols="6"
        class="text-right"
      >
        <VBtn color="success" @click="submitAnswers"> Kirim Jawaban </VBtn>
      </VCol>
      <VCol v-else cols="6" class="text-right">
        <VBtn
          color="primary"
          :disabled="currentQuestionIndex === questions.length - 1"
          @click="nextQuestion"
        >
          Selanjutnya
        </VBtn>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
/* Tambahkan gaya CSS jika diperlukan */
</style>
