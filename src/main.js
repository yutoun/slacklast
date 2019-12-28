import Vue from 'vue'
import App from './App'
import axios from 'axios'
// import { slackPath } from '../.env.development'
console.log(process.env.VUE_APP_API_URL_BASE)

Vue.prototype.$axios = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
