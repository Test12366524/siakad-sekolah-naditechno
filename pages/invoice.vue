<script setup lang="ts">
import { useCommonStore } from '@/stores/common'; // Sesuaikan path sesuai proyek Anda
import { onMounted, ref } from 'vue';

const { confirmDialog } = useCommonStore();

const tableRef = ref();
const dialogSave = ref();
const listStatus = ref([
  { id: 100, name: "Menunggu" },
  { id: 200, name: "Disetujui" },
  { id: 300, name: "Ditolak" }
]);

const paymentForm = {
  status: "",
};

const totalAmount = ref<number | null>(null);
const totalWaiting = ref<number | null>(null);
const totalApproved = ref<number | null>(null);
const totalRejected = ref<number | null>(null);

const card_color = 'info';
const card_icon = 'ri-money-dollar-box-line';

const fetch = async () => {
  try {
    const response = await useApi("/payment/countHeader");
    const data = response.data;
    console.log(data);
    if (data.items && data.items.length > 0) {
      totalAmount.value = data.items[0].total_amount;
      totalWaiting.value = data.items[0].total_waiting;
      totalApproved.value = data.items[0].total_approved;
      totalRejected.value = data.items[0].total_rejected;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // Tambahkan penanganan error sesuai kebutuhan
  }
};

onMounted(() => {
  fetch();
});
</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="payment/status"
    title="Update Status"
    edit-title="Update Status"
    v-slot="{ formData }"
    ref="dialogSave"
    :default-form="paymentForm"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12">
      <VSelect
        v-model="formData.status"
        label="Select Status"
        placeholder="Select Status"
        :rules="[requiredValidator]"
        :items="listStatus"
        item-value="id"
        item-title="name"
        clearable
        clear-icon="ri-close-line"
      />
    </VCol>
  </SaveDialog>
  <VRow style="margin-block-end: 10px;">
    <VCol cols="12" md="3" sm="6">
      <div>
        <VCard
          class="logistics-card-statistics cursor-pointer"
          :style="`border-block-end-color: rgb(var(--v-theme-${card_color}))`"
        >
          <VCardText>
            <div class="d-flex align-center gap-x-4 mb-2">
              <VAvatar variant="tonal" :color="card_color" rounded="lg">
                <VIcon :icon="card_icon" size="24" />
              </VAvatar>
              <h4 class="text-h4">
                {{ totalAmount !== null ? totalAmount : 'Loading...' }}
              </h4>
            </div>
            <div class="text-body-1 text-high-emphasis">
              Total Nominal
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>
    <VCol cols="12" md="3" sm="6">
      <div>
        <VCard
          class="logistics-card-statistics cursor-pointer"
          :style="`border-block-end-color: rgb(var(--v-theme-${card_color}))`"
        >
          <VCardText>
            <div class="d-flex align-center gap-x-4 mb-2">
              <VAvatar variant="tonal" :color="card_color" rounded="lg">
                <VIcon icon="ri-loader-2-line" size="24" />
              </VAvatar>
              <h4 class="text-h4">
                {{ totalWaiting !== null ? totalWaiting : 'Loading...' }}
              </h4>
            </div>
            <div class="text-body-1 text-high-emphasis">
              Total Waiting
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>
    <VCol cols="12" md="3" sm="6">
      <div>
        <VCard
          class="logistics-card-statistics cursor-pointer"
          :style="`border-block-end-color: rgb(var(--v-theme-${card_color}))`"
        >
          <VCardText>
            <div class="d-flex align-center gap-x-4 mb-2">
              <VAvatar variant="tonal" :color="card_color" rounded="lg">
                <VIcon icon="ri-check-double-line" size="24" />
              </VAvatar>
              <h4 class="text-h4">
                {{ totalApproved !== null ? totalApproved : 'Loading...' }}
              </h4>
            </div>
            <div class="text-body-1 text-high-emphasis">
              Total Approved
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>
    <VCol cols="12" md="3" sm="6">
      <div>
        <VCard
          class="logistics-card-statistics cursor-pointer"
          :style="`border-block-end-color: rgb(var(--v-theme-${card_color}))`"
        >
          <VCardText>
            <div class="d-flex align-center gap-x-4 mb-2">
              <VAvatar variant="tonal" :color="card_color" rounded="lg">
                <VIcon icon="ri-close-line" size="24" />
              </VAvatar>
              <h4 class="text-h4">
                {{ totalRejected !== null ? totalRejected : 'Loading...' }}
              </h4>
            </div>
            <div class="text-body-1 text-high-emphasis">
              Total Rejected
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>
  </VRow>
  <VRow>
    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Daftar Peserta - Pembayaran"
        path="payment"
        :with-actions="true"
        :headers="[
          {
            title: 'BIB Number',
            key: 'user_code',
            sortable: false,
          },
          {
            title: 'Nama',
            key: 'user_name',
            sortable: false,
          },
          {
            title: 'Bank',
            key: 'payment_bank',
            sortable: false,
          },
          {
            title: 'Atas Nama',
            key: 'payment_bank_owner',
            sortable: false,
          },
          {
            title: 'Nominal',
            key: 'payment_amount',
            sortable: false,
          },
          {
            title: 'Bukti Pembayaran',
            key: 'payment_payment_proof',
            sortable: false,
          },
          {
            title: 'Status',
            key: 'status',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item }">
          <div class="d-flex gap-1">
            <IconBtn
              size="small"
              v-if="item.payment_payment_proof"
              :href="`https://api-event.tukangbikin.web.id/media/${item.payment_payment_proof}`"
              target="_blank"
              rel="noopener noreferrer"
              title="Lihat bukti pembayaran"
            >
              <VIcon icon="ri-eye-2-line" />
            </IconBtn>
            <IconBtn
              @click="dialogSave.show({ id: item.payment_id, status: item.status })"
              size="small"
              title="Ubah Status"
            >
              <VIcon icon="ri-pencil-line" />
            </IconBtn>
          </div>
        </template>
      </AppTable>
    </VCol>
  </VRow>
</template>


<style lang="scss" scoped>
  @use "@core/scss/base/mixins" as mixins;

  .logistics-card-statistics {
    border-block-end-style: solid;
    border-block-end-width: 2px;
  }
</style>
