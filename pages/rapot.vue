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
  
  useApi("auth/me").then(({ data }) => {
    useApi("mahasiswa/getID/" + data.id).then(({ data }) => {
        const mahasiswa_id = data;
        useApi("rapot/" + mahasiswa_id).then(({ data }) => {
            form.value.name = data.mahasiswa.mahasiswa_name;
            form.value.nim = data.mahasiswa.mahasiswa_nim;
            form.value.periode = data.mahasiswa.periode_name;
            form.value.semester = data.mahasiswa.semester_name;
            // Simpan data rapot
            rapots.value = data.rapot;
        });
    })
  });
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
            <VCardTitle>Biodata Mahasiswa</VCardTitle>
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
                <VCardTitle>Nilai Mata Kuliah</VCardTitle>
            </VCardItem>
            <VCardText>
                <VRow v-for="rapot in rapots" :key="rapot.id">
                    <VCol cols="12" md="3">
                        <VTextField
                            :model-value="rapot.dosen_name"
                            label="Dosen"
                            :disabled="true"
                        />
                    </VCol>
                    <VCol cols="12" md="3">
                        <VTextField
                            :model-value="rapot.mata_kuliah_name"
                            label="Mata Kuliah"
                            :disabled="true"
                        />
                    </VCol>
                    <VCol cols="12" md="2">
                        <VTextField
                            :model-value="rapot.mata_kuliah_minimal_predikat"
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
