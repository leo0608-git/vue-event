<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <!-- 表单 -->
    <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdForm" label-width="100px">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="updatePwd" type="primary">修改密码</el-button>
        <el-button @click="$refs.pwdForm.resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'UserPwd',
  data() {
    const checkPwd = (rule,value,cb) => {
      if(value !== this.pwdForm.new_pwd) {
        cb(new Error('两次输入的密码不一致'))
      }
      cb()
    }
    return {
      // 表单的数据对象
      pwdForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      // 表单的验证规则对象
      pwdFormRules: {
        old_pwd:[
          {required: true, message:'请输入旧密码', trigger:'blur'},
          {pattern:/^\S{6,15}$/, message:'请输入 6 ~ 15 位的字符', trigger: 'blur'}
        ],
        new_pwd:[
          {required: true, message:'请输入新密码', trigger:'blur'},
          {pattern:/^\S{6,15}$/, message:'请输入 6 ~ 15 位的字符', trigger: 'blur'}
        ],
        re_pwd:[
          {required: true, message:'请再次输入新密码', trigger:'blur'},
          {pattern:/^\S{6,15}$/, message:'请输入 6 ~ 15 位的字符', trigger: 'blur'},
          {validator: checkPwd, trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    updatePwd() {
      this.$refs.pwdForm.validate(async valid => {
        // 1.兜底校验
        if(!valid) return
        // 2.发请求 给提示
        const {data: res} = await this.$http.patch('/my/updatepwd',this.pwdForm)
        if(res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 3.重置表单
        this.$refs.pwdForm.resetFields()
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
