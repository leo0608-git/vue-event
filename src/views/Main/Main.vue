<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu
        router
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img v-if="userInfo.user_pic" :src="userInfo.user_pic" alt="" class="avatar" />
            <img v-else src="../../assets/logo.png" alt="" class="avatar" />
            <span>个人中心</span>
          </template>
          <template v-if="menus[2]">
            <el-menu-item v-for="item in menus[2].children" :key="item.indexPath" :index="item.indexPath">
              <i :class="item.icon"></i>{{item.title}}
            </el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item @click="logout" index="2"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <!-- 侧边栏区域 -->
    <el-container>
      <!-- 左侧边栏区域 -->
      <el-aside width="200px">
        <div class="user-box">
          <!-- 如果没用动态绑定属性，设置图片，会进行打包 -->
          <!-- 如果用v-bind绑定图片地址则不会打包，因为webpack会认为这是一个网络地址 -->
          <!-- 需要设置默认图片结合v-if和v-else来完成 -->
          <img v-if="userInfo.user_pic" :src="userInfo.user_pic" alt="" />
          <img v-else src="../../assets/logo.png" alt="" />
          <span>欢迎 {{userInfo.nickname || userInfo.username}}</span>
        </div>
        <!-- default-active默认高亮 -->
        <!-- el-menu里的router属性：是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <el-menu
          :router="true"
          :default-active="$route.path"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF">
          <!-- 菜单项分为两种类型：
              1.有子菜单的：el-submenu
              2.没有子菜单的：el-menu-item
              index唯一标识
          -->
          <!-- v-for的key不能设置在template上，设置在子元素上并搭配v-if和v-else使用 -->
          <!-- 因为v-if和v-else是互斥的，所以每次循环只会出现其中一个，因此key不会冲突 -->
          <template v-for="item in menus">
            <el-menu-item :index="item.indexPath" v-if="!item.children" :key="item.indexPath">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
            <el-submenu :index="item.indexPath" v-else :key="item.indexPath">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item v-for="sub in item.children" :key="sub.indexPath" :index="sub.indexPath">
                <i :class="sub.icon"></i>
                {{sub.title}}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
        
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import {mapState} from 'vuex'


export default {
  name: 'Main',
  data() {
    return {
      menus:[]
    }
  },
  methods:{
    logout() {
      this.$confirm('真的要退出吗?呜呜呜~', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 用户点击了确认，会执行.then()
        // 提醒用户退出成功
        this.$message({
          type: 'success',
          message: '恭喜您！退出成功!'
        })
        // 清空token
        this.$store.commit('user/updateToken','')
        // 跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
      //  用户点击了取消会执行.catch()
      });
    },
    async getMenus() {
      try{
        const {data:res} = await this.$http.get('/my/menus')
        this.menus = res.data
      } catch (e) {
        // 捕获了错误但什么都不处理，响应拦截器配置了相关异常处理
      }
    }
  },
  created() {
    this.getMenus()
    this.$store.dispatch('user/getUserInfo')
  },
  computed: {
    // 计算属性配合mapState，把user模块里的userInfo数据映射到计算属性userInfo，这里的user是子模块在vuex中的注册名
    ...mapState('user',['userInfo','token'])
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #F2F2F2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}

.el-aside {
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
</style>
