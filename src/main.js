import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router/index.js';
import Vuex from 'vuex'
import store from './store'

const app = createApp(App)
app.config.globalProperties.axios = axios
app.config.globalProperties.$store = store

app.use(router);
app.use(Vuex);
app.use(store);

app.mount('#app')

