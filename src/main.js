import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局样式
import './assets/global.less'
// 完整引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入vue-quill-editor
import VueQuillEditor from 'vue-quill-editor'
// 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 注册全局组件
Vue.use(VueQuillEditor)
// 引入axios
import axios from 'axios'
// 配置baseURL
axios.defaults.baseURL = 'http://big-event-vue-api-t.itheima.net'
// 将axios挂载到Vue的原型对象上
Vue.prototype.$http = axios
// 配置axios请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = store.state.user.token
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 配置axios响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  if(error.response.status === 401) {
    // 清空token
    store.commit('user/updateToken','')
    // 跳转至登录页
    router.push('/login')
    // 提醒用户
    Vue.prototype.$message.warning('您的身份信息过期，请重新登陆~')
  }
  return Promise.reject(error);
});

// 注册ElementUI组件
Vue.use(ElementUI)
Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
