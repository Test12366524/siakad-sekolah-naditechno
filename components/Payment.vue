<script setup lang="ts">
const DEFAULT_FORM = {
  bank: "",
  bank_owner: "",
  amount: 0,
  payment_proof: undefined,
  category: "",
  price: 0,
};

const formData = ref({ ...DEFAULT_FORM });
const paymentData = ref({ ...DEFAULT_FORM });
const validationErrors = ref({ ...DEFAULT_FORM });
const { confirmDialog } = useCommonStore();
let value_img = ref();
const fetch = async () => {
  const { data } = await useApi("/payment/detail");

  paymentData.value = data;
  value_img = paymentData.value.payment.payment_proof;
};

const fetchUser = async () => {
  const { data } = await useApi("/user/detailUser");
  fetchPayment(data.user.categoryId);
};

const fetchPayment = async (id) => {
  const { data } = await useApi(`/category/${id}`);
  formData.value = {
    category: data.category.name,
    price: data.category.price,
  };
};


onMounted(() => {
  fetch();
  fetchUser();
});

const save = async () => {
  const { errors } = await useApi("/payment", {
    withNotif: true,
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData.value,
  });

  validationErrors.value = errors ?? DEFAULT_FORM;
};



const slotProps = {
  errors: validationErrors,
  formData,
  paymentData,
  value_img,
  save,
  refresh: fetch,
};
</script>

<template>
  <slot v-bind="slotProps"></slot>

  <div v-if="$slots.default" class="header-tools bg-surface elevation-10">
    <div class="d-flex align-items-center justify-end">
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
  z-index: 10;
  padding: 0.7rem;
  inset-block-end: 0;
  margin-block: 0.35rem;
  margin-inline: 0;
}
</style>
