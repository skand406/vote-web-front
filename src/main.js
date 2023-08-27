import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

loadFonts()

const app = createApp(App)
app.config.globalProperties.axios = axios
app.config.globalProperties.$store = store
axios.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8"


app.component('VueDatePicker', VueDatePicker);
app.use(router)
app.use(store)
app.use(vuetify)
app.mount('#app')
