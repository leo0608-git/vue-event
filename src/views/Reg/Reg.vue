<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <!-- model：指定当前表单的数据对象; rules属性为验证规则 -->
      <el-form :model="regForm" :rules="regRules" ref="regForm" class="reg-form">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="regForm.username"></el-input>
        </el-form-item>   
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="regForm.password"></el-input>
        </el-form-item> 
        <el-form-item prop="repassword">
          <el-input prefix-icon="el-icon-lock" placeholder="请确认密码" v-model="regForm.repassword"></el-input>
        </el-form-item> 
        <el-form-item>
          <el-button type="primary" round class="btn-reg" @click="submitForm('regForm')">注册</el-button>
          <el-link @click="$router.push('/login')" type="info">去登录</el-link>
        </el-form-item> 
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reg',
  data() {
    // rule:规则对象，一般不用
    // value:当前校验项的数据
    // callback:回调函数，决定是否校验通过。直接调用不传参表示校验通过，调用传入错误对象表示校验失败
    // 注意这里一定要用箭头函数，他指向的是外层函数的this
    var checkPwd = (rule, value, callback) => {
        if (value !== this.regForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      regForm:{
        username:'',
        password:'',
        repassword:''
      },
      regRules:{
        username: [
          // trigger:触发时机
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern:/^[a-zA-Z][a-zA-Z0-9]{0,9}$/, message: '用户名必须是1~10位的字母或数字，不能以数字开头', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur' }
        ],
        repassword:[
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur'},
          { validator: checkPwd, trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    // 兜底校验非常重要
    // 传入表单对象的ref属性值，进行兜底校验
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        // valid:校验是否通过的结果
        // 如果是true表示校验通过，false表示校验不通过
        if (!valid) {
          return
        } 
        const{data:res} = await this.$http.post('/api/reg',{
          username:this.regForm.username,
          password:this.regForm.password,
          repassword:this.regForm.repassword
        })
        if(res.code !== 0){
          return this.$message.error(res.message);
        }
        // element-ui的弹框组件，用户体验极佳
        this.$message({
          message: res.message,
          type: 'success'
        });
        this.$router.push('/login')
      });
    },
  }

}
</script>

<style lang="less" scoped>
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }
  }
}

.reg-form {
  padding:0 20px;
  .btn-reg {
    width:100%
  }
}
</style>