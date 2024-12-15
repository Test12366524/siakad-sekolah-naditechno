<script lang="ts" setup>
const route = useRoute("pages-lms");

definePageMeta({
  navActiveLink: "pages-lms",
});

const activeTab = computed({
  get: () => route.query.form || tabs[0].tab,
  set: () => route.query.form,
});

// tabs
const tabs = [
  { title: "Tugas", icon: "ri-task-line", tab: "tugas" },
  { title: "Jawaban", icon: "ri-question-answer-line", tab: "jawaban" },
];
</script>

<template>
  <div>
    <VTabs v-model="activeTab" class="v-tabs-pill">
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
        :to="{
          path: '/lms',
          query: { form: item.tab },
        }"
      >
        <VIcon start :icon="item.icon" />
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider class="my-4" />
    <ClientOnly>
      <VWindow v-model="activeTab" class="mt-6" :touch="false">
        <VWindowItem value="tugas">
          <LmsTugas />
        </VWindowItem>
        <VWindowItem value="jawaban">
          <LmsJawaban />
        </VWindowItem>
      </VWindow>
    </ClientOnly>
  </div>
</template>
