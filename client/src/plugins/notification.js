import { createApp } from "vue";
import Notification from "../components/common/Notification.vue";

export const notification = {
  install: (app) => {
    const notificationComponent = createApp(Notification).mount(
      document.createElement("div")
    );
    document.body.appendChild(notificationComponent.$el);

    app.config.globalProperties.$notify = (options) => {
      notificationComponent.show(options);
    };
  },
};
