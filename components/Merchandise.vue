<script setup lang="ts">
const DEFAULT_FORM = {
  status_merchandise: undefined,
};

const formData = ref({ ...DEFAULT_FORM });
const userData = ref({});
const paymentData = ref({ ...DEFAULT_FORM });
const validationErrors = ref({ ...DEFAULT_FORM });
const { confirmDialog } = useCommonStore();
let value_img = ref();
const fetch = async () => {
  const { data } = await useApi("/payment/detail");

  paymentData.value = data;
  if(paymentData.value.payment.status_merchandise == 1){
    formData.value = {
      status_merchandise: 'Sudah diambil',
    };
  }else{
    formData.value = {
      status_merchandise: 'Belum diambil',
    };
  }
  
};

const fetchUser = async () => {
  const { data } = await useApi("/user/detailUser");
  userData.value = {
    code: data.user.code,
    name: data.user.name,
    email: data.user.email,
    phone_number: data.user.phone_number,
  };
  
};

onMounted(() => {
  fetch();
  fetchUser();
});



const slotProps = {
  errors: validationErrors,
  formData,
  userData,
  refresh: fetch,
};
</script>

<template>
  <slot v-bind="slotProps"></slot>

  <slot name="afterSave" v-bind="slotProps"></slot>
</template>

<style scoped>
.ProseMirror:focus {
  outline: none;
}

.header-tools {
  position: sticky;
  z-index: 10;
  padding: 0.7rem;
  inset-block-end: 0;
  margin-block: 0.35rem;
  margin-inline: 0;
}
</style>
