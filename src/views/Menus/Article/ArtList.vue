<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option v-for="item in cateList" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getArtList()" type="primary" size="small">筛选</el-button>
            <el-button @click="reset" type="info" size="small">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button @click="pubVisible=true" type="primary" size="small" class="btn-pub">发表文章</el-button>
      </div>

      <!-- 文章表格区域 -->
       <!-- stripe加条纹，border加边框 -->
      <el-table
        stripe
        border
        :data="artList"
        style="width: 100%">
        <el-table-column
          label="文章标题">
          <template v-slot="scope">
            <el-link @click="showDetail(scope.row.id)" type="primary">{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="cate_name"
          label="文章分类">
        </el-table-column>
        <el-table-column
          label="发表时间">
          <template v-slot="scope">
            {{ formatDate(scope.row.pub_date)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态">
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot="scope">
            <el-button @click="del(scope.row.id)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <!-- current-page:分页组件显示的当前页码 -->
      <!-- page-sizes:可以选择，控制每页显示多少条的控制器 -->
      <!-- page-size：控制每页显示多少条 -->
      <!-- total：总条数 -->
      <!-- @size-change事件：每页显示条数改变时触发 -->
      <!-- @current-change事件：当前页面改变时触发 -->
      <el-pagination
        style="margin-top: 15px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 发表文章Dialogue -->
    <el-dialog
    @closed="dialogClose"
      fullscreen
      title="发表文章"
      :visible.sync="pubVisible"
      :before-close="handleClose">
      <el-form :model="pubForm" :rules="pubRules" ref="pubForm" label-width="80px">
        <el-form-item label="文章标题" prop="title">
          <el-input placeholder="请输入标题" v-model="pubForm.title"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select style="width: 100%;" v-model="pubForm.cate_id" placeholder="请选择分类">
            <el-option v-for="item in cateList" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor @blur="checkContent" v-model="pubForm.content">
          </quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img v-if="preview" :src="preview" alt="" class="cover-img" ref="imgRef" />
          <img v-else src="../../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input v-if="pubVisible" @change="changeImg" type="file" style="display: none;" accept="image/*" ref="iptFileRef" />
          <!-- 选择封面的按钮 -->
          <el-button @click="$refs.iptFileRef.click()" type="text">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item prop="state">
          <el-button @click="pubArt('已发布')" type="primary">发布</el-button>
          <el-button @click="pubArt('草稿')" type="info">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 预览文章的dialog -->
    <el-dialog
      title="文章预览"
      :visible.sync="detailVisible"
      width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>
      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ formatDate(artDetail.pub_date) }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
      </div>
      <el-divider content-position="left">我是华丽丽的分割线</el-divider>
      <img :src="'http://big-event-vue-api-t.itheima.net' + artDetail.cover_img" alt="">
      <div class="detail-box" v-html="artDetail.content"></div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'ArtList',
  data() {
    return {
      preview:'',
      pubVisible: false,
      // 查询参数对象
      q: {
        pagenum: 1, //当前页码
        pagesize: 2, //一页显示多少条
        cate_id: '', 
        state: ''
      },
      pubForm:{
        title:'',
        cate_id:'',
        content:'',
        cover_img:'',
        state:''
      },
      pubRules:{
        title:[
          {required:true, message: '请输入文章标题', trigger: 'blur'},
          {min: 1, max: 30, message:'文章标题必须是1 ~30个字符', trigger:'blur'}
        ],
        cate_id:[
          {required:true, message: '请选择文章分类', trigger: 'change'}
        ],
        content:[
          {required:true, message:'请输入文章内容'}
        ],
        cover_img:[
          {required:true, message:'请选择文章封面'}
        ]
      },
      cateList:[],
      artList:[],
      total:0,
      artDetail:{},
      detailVisible:false,
    }
  },
  methods:{
    handleClose(done) {
      this.$confirm('此操作将导致文章信息丢失，是否继续？', '提示', {
        type:'warning'
      })
      .then(_ => {
        done();
      })
      .catch(_ => {});
    },
    async getCateList() {
      const {data:res} = await this.$http.get('/my/cate/list')
      if(res.code === 0) this.cateList = res.data
    },
    checkContent() {
      // 手动让表单去校验content输入项
      this.$refs.pubForm.validateField('content')
    },
    changeImg(e) {
      // 选择文件后点确定，会拿到files
      const files = e.target.files
      if(files.length > 0) {
        this.$refs.pubForm.clearValidate('cover_img')
        this.pubForm.cover_img = files[0]
        // URL.createObjectURL(),作用：将Blob或File对象转成URL，参数：Blob或File对象
        // 这个URL生命周期和当前窗口一致，即他所在窗口（组件）关闭后，就不能访问该URL了
        this.preview = URL.createObjectURL(files[0])
      } else {
        // 不选择文件点取消
        this.pubForm.cover_img = ''
        this.preview = ''
      }
    },
    pubArt(state) {
      this.pubForm.state = state
      // 兜底校验，prop对应的数据和prop对应的规则校验
      this.$refs.pubForm.validate(async valid => {
        if(!valid) return
        // 将数据存储到FormData中再发请求给后台
        let fd = new FormData()
        for(let k in this.pubForm) {
          fd.append(k, this.pubForm[k])
        }
        const {data:res} = await this.$http.post('/my/article/add',fd)
        if(res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.pubVisible = false
        // 更新文章列表数据（等后期文章列表完成后再做）
        this.getArtList()
      })
    },
    dialogClose() {
      this.$refs.pubForm.resetFields()
      this.preview = ''
    },
    async getArtList() {
      const{data:res} = await this.$http.get('/my/article/list',{
        params:this.q
      })
      this.artList = res.data
      this.total = res.total
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    handleSizeChange(pagesize) {
      // 每页显示多少条改变，会触发该回调函数
      this.q.pagesize = pagesize
      // 后端会根据我们当前所在页和页面的显示条数返回相应数据
      this.getArtList()
    },
    handleCurrentChange(current) {
      // 当前页改变时触发，执行该回调函数
      this.q.pagenum = current
      // 后端会根据我们当前页和页面的条数返回相应的数据
      this.getArtList()
    },
    reset() {
      this.q.pagenum = 1
      this.q.cate_id = ''
      this.q.state= ''
      this.getArtList()
    },
    async showDetail(id) {
      const{data:res} = await this.$http.get('/my/article/info',{
        params:{
          id
        }
      })
      this.artDetail = res.data
      this.detailVisible = true
    },
    async del(id) {
      // 使用confirm提醒用户要删除了
      const result = await this.$confirm('你忍心删除我吗？').catch(e => e)
      if(result != 'confirm') {
        return
      }
      // 发请求根据id删除文章
      const {data:res} = await this.$http.delete('/my/article/info', {
        params:{
          id
        }
      })
      // 根据删除成不成功提醒用户相应的消息
      if(res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 判断当前artList是不是只有一条数据，如果只有一条就让 pagenum--
      if(this.artList.length === 1 && this.q.pagenum > 1) {
        // 这里已经成功删除了一条数据，本地存储的数据条数量--
        this.q.pagenum--
      }
      // 获取最新的文章列表数据
      this.getArtList()
    }
  },
  created() {
    this.getCateList(),
    this.getArtList()
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}

/deep/ .ql-editor {
  height: 300px;
}

// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}

.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
/deep/ .detail-box {
  img {
    width: 500px;
  }
}
</style>
