<script setup lang="ts">
import { formatFullDate } from "@/composables/common";
import avatar1 from "@images/avatars/avatar-1.png";
import avatar2 from "@images/avatars/avatar-2.png";
import avatar3 from "@images/avatars/avatar-3.png";
import avatar4 from "@images/avatars/avatar-4.png";
import avatar7 from "@images/avatars/avatar-7.png";
import avatar8 from "@images/avatars/avatar-8.png";

interface UiColors {
  Business: string;
  Meditation: string;
  Meetup: string;
  Dinner: string;
}
interface MeetingSchedule {
  profile: string;
  with: string;
  dateTime: string;
  type: keyof UiColors;
}

const meetingSchedules: MeetingSchedule[] = [
  {
    profile: avatar4,
    with: "Call with Woods",
    dateTime: "21 Jul | 08:20-10:30",
    type: "Business",
  },
  {
    profile: avatar8,
    with: "Call with hilda",
    dateTime: "24 Jul | 11:30-12:00",
    type: "Meditation",
  },
  {
    profile: avatar7,
    with: "Conference call",
    dateTime: "28 Jul | 05:00-6:45",
    type: "Dinner",
  },
  {
    profile: avatar3,
    with: "Meeting with Mark",
    dateTime: "03 Aug | 07:00-8:30",
    type: "Meetup",
  },
  {
    profile: avatar2,
    with: "Meeting in Oakland",
    dateTime: "14 Aug | 04:15-05:30",
    type: "Dinner",
  },
  {
    profile: avatar1,
    with: "Meeting with Carl",
    dateTime: "05 Oct | 10:00-12:45",
    type: "Business",
  },
  {
    profile: avatar4,
    with: "Call with Woods",
    dateTime: "21 Jul | 08:20-10:30",
    type: "Business",
  },
  {
    profile: avatar8,
    with: "Call with hilda",
    dateTime: "24 Jul | 11:30-12:00",
    type: "Meditation",
  },
  {
    profile: avatar7,
    with: "Conference call",
    dateTime: "28 Jul | 05:00-6:45",
    type: "Dinner",
  },
  {
    profile: avatar3,
    with: "Meeting with Mark",
    dateTime: "03 Aug | 07:00-8:30",
    type: "Meetup",
  },
  {
    profile: avatar2,
    with: "Meeting in Oakland",
    dateTime: "14 Aug | 04:15-05:30",
    type: "Dinner",
  },
  {
    profile: avatar1,
    with: "Meeting with Carl",
    dateTime: "05 Oct | 10:00-12:45",
    type: "Business",
  },
];

const meetingTypeUiColors: UiColors = {
  Business: "primary",
  Meditation: "success",
  Meetup: "secondary",
  Dinner: "error",
};

const form = {
  id: 1,
  publish_by: 1,
  to: "semua",
  title: "Besok Libur",
  content:
    "Diberitahukan kepada seluruh dosen dan mahasiswa, bahwa beso libur.",
  from_date: "2024-12-14T17:00:00.000Z",
  to_date: "2024-12-24T17:00:00.000Z",
  status: 1,
  created_at: "2024-12-13T05:56:52.097Z",
  updated_at: "2024-12-13T05:56:52.097Z",
  status_desc: "Publish",
  publish_name: "Super Admin",
};

const announcements = ref([]);

const fetchAnnouncement = () => {
  useApi("dashboard/pengumuman").then(({ data }) => {
    if (data) announcements.value = data;
  });
};

onMounted(() => {
  fetchAnnouncement();
});
</script>

<template>
  <VCard max-height="400">
    <!-- SECTION Card Header and Menu -->
    <VCardItem>
      <!-- 👉 Title -->
      <VCardTitle class="mb-4">
        <VIcon size="20" start icon="ri-broadcast-line" /> Pengumuman
      </VCardTitle>
      <VDivider />
    </VCardItem>
    <!-- !SECTION -->

    <!-- SECTION Meting Schedule -->
    <VCardText>
      <VList v-if="announcements.length > 0" lines="two" class="card-list">
        <VListItem v-for="meeting in announcements" :key="meeting.id">
          <!-- 👉 Title and Subtitle -->

          <VListItemTitle class="font-weight-bold mb-2">
            {{ meeting.title }}
          </VListItemTitle>
          <VListItemSubtitle class="d-flex gap-1">
            <VIcon size="20" start icon="ri-calendar-line" />
            <p>{{ meeting.content }}</p>            
          </VListItemSubtitle>
          <p style="font-size: 12px; margin-top: -10px;">{{ formatFullDate(meeting.from_date)?.dateOnly }} - {{ formatFullDate(meeting.to_date)?.dateOnly }}</p>
        </VListItem>
      </VList>
      <div v-else>tidak ada pengumuman</div>
    </VCardText>
    <!-- !SECTION -->
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.5rem;

  overflow-y: auto;
}

.v-list {
  overflow: hidden auto;
  word-wrap: break-word;
}

/* Optional: Custom scrollbar styling */
.v-list::-webkit-scrollbar {
  inline-size: 8px;
}

.v-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.v-list::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #888;
}
</style>
