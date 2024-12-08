<script setup lang="ts">
import { PerfectScrollbar } from "vue3-perfect-scrollbar";

const { logout, user } = useAuthStore();
const { snackbar } = useCommonStore();

async function handleLogout() {
  try {
    await logout();
    navigateTo("/login");
  } catch (e) {
    snackbar.show({
      message: e,
      color: "error",
    });
  }
}

const userProfileList = [
  { type: "divider" },
  {
    type: "navItem",
    icon: "ri-user-line",
    title: "Profile",
    to: { name: "pages-account-settings-tab", params: { tab: "account" } },
  },
  { type: "divider" },
  // {
  //   type: "navItem",
  //   icon: "ri-settings-4-line",
  //   title: "Settings",
  //   to: { name: "pages-account-settings-tab", params: { tab: "account" } },
  // }
];
</script>

<template>
  <VBadge
    v-if="user"
    dot
    bordered
    location="bottom right"
    offset-x="2"
    offset-y="2"
    color="success"
    class="user-profile-badge"
  >
    <VAvatar class="cursor-pointer" size="38">
      <VIcon icon="ri-user-line" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="15px">
        <VList>
          <VListItem class="px-4">
            <div class="d-flex gap-x-2 align-center">
              <div>
                <div class="text-body-2 font-weight-medium text-high-emphasis">
                  {{ user.name }}
                </div>
                <div class="text-capitalize text-caption text-disabled">
                  {{ user.email }}
                </div>
              </div>
            </div>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template v-for="item in userProfileList" :key="item.title">
              <VListItem
                v-if="item.type === 'navItem'"
                :to="item.to"
                class="px-4"
              >
                <template #prepend>
                  <VIcon :icon="item.icon" size="22" />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>
              </VListItem>

              <VDivider v-else class="my-1" />
            </template>

            <VListItem class="px-4">
              <VBtn
                block
                color="error"
                size="small"
                append-icon="ri-logout-box-r-line"
                @click="handleLogout"
              >
                Logout
              </VBtn>
            </VListItem>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

<style lang="scss">
.user-profile-badge {
  &.v-badge--bordered.v-badge--dot .v-badge__badge::after {
    color: rgb(var(--v-theme-background));
  }
}
</style>
