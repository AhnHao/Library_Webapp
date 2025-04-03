import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { notification } from "./plugins/notification";

const app = createApp(App);
app.use(router);
app.use(notification);
app.mount("#app");
