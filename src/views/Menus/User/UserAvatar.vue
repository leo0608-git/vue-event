<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img v-if="avatar" :src="avatar" alt="" class="preview" />
      <img v-else src="../../../assets/images/avatar.jpg" alt="" class="preview" />

      <!-- 按钮区域 -->
      <div class="btn-box">  
        <!-- accept:当前文件选择框可以接受的文件类型 -->
        <input @change="changeFile" accept="image/*" ref="inp" style="display: none;" type="file">
        <el-button @click="$refs.inp.click()" type="primary" icon="el-icon-plus">选择图片</el-button>
        <el-button @click="upload" type="success" icon="el-icon-upload" :disabled="!avatar">上传头像</el-button>
      </div> 
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'UserAvatar',
  data() {
    return {
      avatar:''
    }
  },
  methods:{
    changeFile(e) {
      // img标签的src属性只能设置两种值
      // URL和BASE64(Data URL )
      const files = e.target.files
      if(files.length > 0) {
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.onload = (e) => {
          this.avatar = e.target.result
        }
      }else {
        this.avatar = ''
      }
    },
    async upload() {
      const {data: res} = await this.$http.patch('/my/update/avatar',{avatar: this.avatar})
      if(res.code !== 0) {
        return this.$message.error(res.message)
      }
      this.$message.success(res.message)
      this.$store.dispatch('user/getUserInfo')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
  width: 350px;
  height: 350px;
}
</style>
 