import Vue from 'vue'
import App from './App'
import router from './router'

import './assets/css/global.css'

//封装过的axios
import a from './utils/http'
Vue.prototype.$http=a;

//原生的axios
import ax from 'axios'
Vue.prototype.axios = ax;

//配置饿了么
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//配置vuex
import store from './utils/store'

Vue.use(ElementUI);
Vue.config.productionTip = false


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
