<script setup lang="ts">
const DEFAULT_FORM = {
  banner_title: "",
  banner_img: undefined,
  reward_title: "",
  reward_img: undefined,
  about_title: "",
  about_description: "",
  about_img: undefined,
};

const DEFAULT_HOME_DATA = {
  home: { ...DEFAULT_FORM },
  ref: [],
  partner: [],
};

const homeData = ref<any>({ ...DEFAULT_HOME_DATA });

const formData = ref({ ...DEFAULT_FORM });
const validationErrors = ref({ ...DEFAULT_FORM });
const { confirmDialog } = useCommonStore();

const fetch = async () => {
  const { data } = await useApi("/home");

  homeData.value = data;

  formData.value = {
    ...(homeData.value.home as any),
    hero_img: undefined,
    reward_img: undefined,
    about_img: undefined,
  };
};

const removeContent = async (contentName: string, id: number) => {
  confirmDialog.show({
    title: "Delete Item",
    message: "Are you sure want to delete selected item?",
    async onConfirm() {
      const { success } = await useApi(`/home/remove/${contentName}/${id}`, {
        withNotif: true,
        method: "DELETE",
      });

      if (success) {
        homeData.value = { ...DEFAULT_HOME_DATA };

        await nextTick();

        fetch();
      }
    },
  });
};

const save = async () => {
  const { errors } = await useApi("/home", {
    withNotif: true,
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData.value,
  });

  validationErrors.value = errors ?? DEFAULT_FORM;
};

onMounted(() => {
  fetch();
});

const slotProps = {
  errors: validationErrors,
  formData,
  homeData,
  save,
  removeContent,
  refresh: fetch,
};
</script>

<template>
  <slot v-bind="slotProps"></slot>

  <div v-if="$slots.default" class="header-tools bg-surface elevation-10">
    <div class="d-flex align-items-center justify-end">
      <WebsiteLinkPreview> Preview </WebsiteLinkPreview>
      <VBtn color="primary" @click="save"> Save </VBtn>
    </div>
  </div>

  <slot name="afterSave" v-bind="slotProps"></slot>
</template>

<style scoped>
.ProseMirror:focus {
  outline: none;
}
.header-tools {
  position: sticky;
  bottom: 0px;
  z-index: 10;
  padding: 0.7rem;
  margin: 0.35rem 0;
}
</style>
