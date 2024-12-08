<script setup lang="ts">

const { confirmDialog } = useCommonStore();

const tableRef = ref();
const dialogSave = ref();
const listStatus = ref([
  { id: 0, name: "Status Refund" },
  { id: 1, name: "Dikembalikan" },
  { id: 0, name: "Tidak dikembalikan" }
]);

const filterStatus = [
  { text: 'Status Refund', value: 0 },
  { text: 'Dikembalikan', value: 1 },
  { text: 'Tidak dikembalikan', value: 0 },
];

const paymentForm = {
  status: "",
};

const totalWaiting = ref('');
const totalApproved = ref('');
const totalRejected = ref('');

const card_color = 'info';
const card_icon = 'ri-money-dollar-box-line';
const card_icon_debit = 'ri-corner-right-up-line';
const card_icon_kredit = 'ri-corner-right-down-line';

</script>

<template>
  <SaveDialog
    v-if="tableRef"
    path="payment/statusRefund"
    title="Update Status"
    edit-title="Update Status"
    v-slot="{ formData }"
    ref="dialogSave"
    :default-form="paymentForm"
    :refresh-callback="tableRef.refresh"
  >
    <VCol cols="12">
      <VSelect
        v-model="formData.status_refund"
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
  <VRow>
    <VCol cols="12">
      <AppTable
        ref="tableRef"
        title="Daftar Peserta - Refund"
        path="payment"
        :with-actions="true"
        :headers="[
          {
            title: 'BIB Number',
            key: 'user_code',
            sortable: false,
          },
          {
            title: 'nama',
            key: 'user_name',
            sortable: false,
          },
          {
            title: 'bank',
            key: 'payment_bank',
            sortable: false,
          },
          {
            title: 'atas nama',
            key: 'payment_bank_owner',
            sortable: false,
          },
          {
            title: 'nominal',
            key: 'payment_amount',
            sortable: false,
          },
          {
            title: 'bukti pembayaran',
            key: 'payment_payment_proof',
            to: 'https://api-event.tukangbikin.web.id/media/',
            sortable: false,
          },
          {
            title: 'status',
            key: 'status_refund',
            sortable: false,
          },
        ]"
      >
        <template #actions="{ item, remove }">
          <div class="d-flex gap-1">
            <IconBtn size="small" v-if="item.payment_payment_proof" :href="`https://api-event.tukangbikin.web.id/media/${item.payment_payment_proof}`" target="_blank" rel="noopener noreferrer" title="Lihat bukti pembayaran">
              <VIcon icon="ri-eye-2-line" />
            </IconBtn>
            <IconBtn @click="dialogSave.show({id: item.payment_id, status_refund: item.status_refund})" size="small" title="Ubah Status">
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
