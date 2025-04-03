<template>
  <div class="notification-container">
    <transition-group name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="notification.type"
      >
        <div class="notification-icon">
          <i :class="getIcon(notification.type)"></i>
        </div>
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
        </div>
        <button
          class="notification-close"
          @click="removeNotification(notification.id)"
        >
          <i class="bi bi-x"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: "Notification",
  data() {
    return {
      notifications: [],
      nextId: 0,
    };
  },
  methods: {
    show(notification) {
      const id = this.nextId++;
      this.notifications.push({
        id,
        title: notification.title,
        message: notification.message,
        type: notification.type || "info",
        timeout: notification.timeout || 5000,
      });

      setTimeout(() => {
        this.removeNotification(id);
      }, notification.timeout || 5000);
    },
    removeNotification(id) {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
    },
    getIcon(type) {
      const icons = {
        success: "bi bi-check-circle-fill",
        error: "bi bi-x-circle-fill",
        warning: "bi bi-exclamation-circle-fill",
        info: "bi bi-info-circle-fill",
      };
      return icons[type] || icons.info;
    },
  },
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification {
  display: flex;
  align-items: start;
  padding: 1rem;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  width: 320px;
  max-width: calc(100vw - 40px);
  gap: 1rem;
}

.notification-icon {
  flex-shrink: 0;
  font-size: 1.25rem;
}

.notification-content {
  flex-grow: 1;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.notification-message {
  font-size: 0.875rem;
  color: #64748b;
}

.notification-close {
  background: none;
  border: none;
  padding: 0;
  color: #94a3b8;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  transition: color 0.2s ease;
}

.notification-close:hover {
  color: #64748b;
}

/* Notification types */
.notification.success {
  border-left: 4px solid #22c55e;
}
.notification.success .notification-icon {
  color: #22c55e;
}

.notification.error {
  border-left: 4px solid #ef4444;
}
.notification.error .notification-icon {
  color: #ef4444;
}

.notification.warning {
  border-left: 4px solid #f59e0b;
}
.notification.warning .notification-icon {
  color: #f59e0b;
}

.notification.info {
  border-left: 4px solid #3b82f6;
}
.notification.info .notification-icon {
  color: #3b82f6;
}

/* Animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
