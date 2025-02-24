<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <el-form :model="userForm" :rules="userRules" ref="userForm" label-width="80px">
      <el-form-item label="登录名称">
        <el-input disabled v-model="userForm.username"></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="update" type="primary" round>提交修改</el-button>
        <el-button @click="reset" round>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
// 辅助函数
import {mapState} from 'vuex'

export default {
  name: 'UserInfo',
  data() {
    return {
      // data()比computed更早一点初始化，所以computed里可以使用data中的数据，而data中不能使用computed的数据，
      // 如果非要使用，可以等computed加载完成后使用
      userForm:{
        username:'',
        nickname:'',
        email:'',
      },
      userRules:{
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '昵称必须是1~10位的非空字符串', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
        ],
      }
    }
  },
  computed:{
    ...mapState('user',['userInfo'])
  },
  created() {
    this.userForm = {...this.userInfo}
  },
  methods:{
    reset() {
      // resetFields()：elementUI提供的表单方法，把表单内所有字段重置为初始值
      this.$refs.userForm.resetFields()
    },
    update() {
        // 1.兜底校验
        this.$refs.userForm.validate(async valid => {
          if(!valid) {
            return
          }
        // 2.校验通过后发更新数据请求给服务器，带上新数据
        const {data:res} = await this.$http.put('/my/userinfo',this.userForm)
        // 3.根据结果提示用户
        if(res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 4.重新获取用户信息，user模块的actions里的getUserInfo方法会向服务器发起请求获取数据，
        // 这个数据是更新过后了的，拿到更新了的数据给mutations，进而修改state里的数据
        this.$store.dispatch('user/getUserInfo')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
