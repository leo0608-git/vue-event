import axios from 'axios'

export default {
  namespaced:true,
  // 这里要用小括号包住对象，要不然会认为大括号是箭头函数的代码块
  // Vuex中数据的持久化存储
  state: () => {
    return {
      token:'',
      userInfo:{},
    }
  },
  mutations:{
    updateToken(state,token) {
      state.token = token
      // localStorage.setItem('token',token)
    },
    updateUserInfo(state,value) {
      state.userInfo = value
    }
  },
  actions:{
    async getUserInfo(context,value) {
      // Vuex子模块里的this指向的不是vc或者vm，用不了Vue原型对象下挂载的属性和方法
      // 要用axios需要引入
      try{
        const {data:res} = await axios.get('/my/userinfo')
        context.commit('updateUserInfo',res.data)
      } catch(e) {
        //捕获错误但什么都不做，响应拦截器配置了相关异常处理
      }
    }
  },
  getters:{}
}