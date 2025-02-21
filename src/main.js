import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局样式
import './assets/global.less'
// 完整引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入axios
import axios from 'axios'
// 配置baseURL
axios.defaults.baseURL = 'http://big-event-vue-api-t.itheima.net'
// 将axios挂载到Vue的原型对象上
Vue.prototype.$http = axios
// 注册ElementUI组件
Vue.use(ElementUI)
Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
