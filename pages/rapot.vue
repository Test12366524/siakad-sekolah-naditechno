<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { VCard, VCardText, VCol, VRow, VTextField } from "vuetify/lib/components/index.mjs";

const rapots = ref([]);
const form = ref({
  name: "",
  nim: "",
  periode: "",
  semester: "",
});

const role_id = ref();
onMounted(() => {
  const { user } = useAuthStore();
//   useApi(`level/rapot/${user.role_id}`).then(({ data }) => {
//     if(data == 0){
//       navigateTo(`/not-authorized`);
//     }
//   });

  useApi("siswa/getID/" + user.id).then(({ data }) => {
    const siswa_id = data;
    useApi("rapot/" + siswa_id).then(({ data }) => {
      form.value.name = data.siswa.siswa_name;
      form.value.nim = data.siswa.siswa_nim;
      form.value.periode = data.siswa.periode_name;
      form.value.semester = data.siswa.semester_name;
      // Simpan data rapot
      rapots.value = data.rapot;
    });
  })
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
            <VCardTitle>Biodata Siswa</VCardTitle>
        </VCardItem>
        <VCardText>
            <VRow>
                <VCol cols="12" md="6">
                    <VTextField
                        v-model="form.nim"
                        label="NIM"
                        :disabled="true"
                    />
                </VCol>
                <VCol cols="12" md="6">
                    <VTextField
                        v-model="form.semester"
                        label="Semester"
                        :disabled="true"
                    />
                </VCol>
                <VCol cols="12" md="6">
                    <VTextField
                        v-model="form.name"
                        label="Nama"
                        :disabled="true"
                    />
                </VCol>
                <VCol cols="12" md="6">
                    <VTextField
                        v-model="form.periode"
                        label="Tahun Ajaran"
                        :disabled="true"
                    />
                </VCol>
            </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
        <VCard class="mt-4">
            <VCardItem>
                <VCardTitle>Nilai Mata Pelajaran</VCardTitle>
            </VCardItem>
            <VCardText>
                <VRow v-for="rapot in rapots" :key="rapot.id">
                    <VCol cols="12" md="3">
                        <VTextField
                            :model-value="rapot.guru_name"
                            label="Guru"
                            :disabled="true"
                        />
                    </VCol>
                    <VCol cols="12" md="3">
                        <VTextField
                            :model-value="rapot.mata_pelajaran_name"
                            label="Mata Pelajaran"
                            :disabled="true"
                        />
                    </VCol>
                    <VCol cols="12" md="2">
                        <VTextField
                            :model-value="rapot.mata_pelajaran_minimal_predikat"
                            label="Minimal Predikat"
                            :disabled="true"
                        />
                    </VCol>
                    <VCol cols="12" md="2">
                        <VTextField
                            :model-value="rapot.total"
                            label="Nilai Akhir"
                            :disabled="true"
                        />
                    </VCol>
                    <VCol cols="12" md="2">
                        <VTextField
                            :model-value="rapot.predikat"
                            label="Predikat"
                            :disabled="true"
                        />
                    </VCol>
                </VRow>
            </VCardText>
        </VCard>
    </VCol>
  </VRow>
</template>
