import Vue from 'vue'
import Vuex from 'vuex'
// 引入user模块
import user from './user.js'
// 引入Vuex持久化存储的插件，能帮助我们自动存储state中的数据到本地，并读取本地数据给state，这样即使页面刷新也不会丢失state中的数据
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  // 装持久化存储插件
  plugins: [createPersistedState()],
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    // Vuex的模块化编码
    user
  }
})
