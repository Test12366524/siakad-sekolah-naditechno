<script lang="ts" setup>
import SaveForm from "@/components/SaveForm.vue";

const isCurrentPasswordVisible = ref(false);
const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const formRef = ref();

const form = {
  old_password: "",
  new_password: "",
  new_password_confirmation: "",
};

watchEffect(() => {
  if (formRef.value) {
    formRef.value.setEditingMode(true);
  }
});
</script>

<template>
  <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard>
        <VCardItem class="pb-6">
          <VCardTitle>Change Password</VCardTitle>
        </VCardItem>
        <VCardItem>
          <SaveForm
            :default-form="form"
            ref="formRef"
            custom-path="/auth/password"
            v-slot="{ formData, validationErrors }"
          >
            <VCol cols="12">
              <!-- 👉 current password -->
              <VTextField
                v-model="formData.old_password"
                :error-messages="validationErrors.old_password"
                :type="isCurrentPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="
                  isCurrentPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'
                "
                autocomplete="on"
                label="Current Password"
                placeholder="············"
                @click:append-inner="
                  isCurrentPasswordVisible = !isCurrentPasswordVisible
                "
              />
            </VCol>
            <VCol cols="12">
              <!-- 👉 new password -->
              <VTextField
                v-model="formData.new_password"
                :error-messages="validationErrors.new_password"
                :type="isNewPasswordVisible ? 'text' : 'password'"
                :rules="[
                  confirmedValidator(
                    formData.new_password,
                    formData.new_password_confirmation
                  ),
                ]"
                :append-inner-icon="
                  isNewPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'
                "
                label="New Password"
                autocomplete="on"
                placeholder="············"
                @click:append-inner="
                  isNewPasswordVisible = !isNewPasswordVisible
                "
              />
            </VCol>

            <VCol cols="12">
              <!-- 👉 confirm password -->
              <VTextField
                :rules="[
                  confirmedValidator(
                    formData.new_password,
                    formData.new_password_confirmation
                  ),
                ]"
                v-model="formData.new_password_confirmation"
                :error-messages="validationErrors.new_password_confirmation"
                :type="isConfirmPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="
                  isConfirmPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'
                "
                autocomplete="on"
                label="Confirm New Password"
                placeholder="············"
                @click:append-inner="
                  isConfirmPasswordVisible = !isConfirmPasswordVisible
                "
              />
            </VCol>
          </SaveForm>
        </VCardItem>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
  <!-- !SECTION -->
</template>
