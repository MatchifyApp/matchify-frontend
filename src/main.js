import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import Vuesax from 'vuesax'

import 'vuesax/dist/vuesax.css'
import "@/notifications";

Vue.config.productionTip = false;

Vue.use(Vuesax);
let app = new Vue({
  router,
  render: h => h(App)
});

app.$mount('#app');

app.$vs.theme = "dark";
