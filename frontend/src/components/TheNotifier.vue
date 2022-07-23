<template>
  <ui-notification-group>
    <ui-notification ref="notificationRef">
      <template #default="{ notifications, close }">
        <ui-notification-message
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
          @close="close(notification.id)"
          @mouseenter="onMouseEnter(notification.id)"
          @mouseleave="onMouseLeave(notification.id)"
        />
      </template>
    </ui-notification>
  </ui-notification-group>
</template>

<script setup>
import { ref } from 'vue';
import UiNotificationGroup from './ui/UiNotificationGroup.vue';
import UiNotification from './ui/UiNotification.vue';
import UiNotificationMessage from './ui/UiNotificationMessage.vue';

const notificationRef = ref(null);

function onMouseEnter(notificationId) {
  clearTimeout(notificationRef.value.notification.timeouts[notificationId]);
}

function onMouseLeave(notificationId) {
  notificationRef.value.notification.timeouts[notificationId] = setTimeout(
    () => {
      notificationRef.value.notification.remove(notificationId);
    }, 2000
  );
}
</script>
