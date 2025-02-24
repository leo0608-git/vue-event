import Vue from 'vue'
import VueRouter from 'vue-router'
import Reg from '../views/Reg/Reg.vue'
import Login from '../views/Login/Login.vue'
import Main from '../views/Main/Main.vue'
import store from '../store/index.js'
import Home from '../views/Menus/Home/Home.vue'
import UserInfo from '../views/Menus/User/UserInfo.vue'
import UserAvatar from '../views/Menus/User/UserAvatar.vue'
Vue.use(VueRouter)

// 把下面的代码粘贴到路由模块中对应的位置，即可防止路由报错的问题:redundant navigation to one same location
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
 
const routes = [
  {
    path:'/reg',
    component:Reg
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/',
    component:Main,
    redirect:'/home',
    children:[
      {
        path:'home',
        component:Home
      },
      {
        path:'user-info',
        component:UserInfo
      },
      {
        path:'user-avatar',
        component:UserAvatar
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 全局前置导航守卫 
// 换句话讲，如果我没有登录，就只能去登录或注册页，可以将登录注册页叫白名单
router.beforeEach((to,from,next) => {
  const whiteList = ['/login','/reg']
  const token = store.state.user.token
  if(!token && !whiteList.includes(to.path)) {
    Vue.prototype.$message.error('您还没登录，不能偷看哦~')
    return next('/login')
  }
  next()
}) 

export default router
