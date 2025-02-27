<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button @click="addVisible=true" type="primary" size="mini">添加分类</el-button>
      </div>
      <el-table
        border
        :data="list"
        style="width: 100%">
        <el-table-column
          type="index"
          width="50"
          prop="id"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="cate_name"
          label="分类名称">
        </el-table-column>
        <el-table-column
          prop="cate_alias"
          label="分类别名">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button @click="showEdit(scope.row)" type="primary" size="mini">修改</el-button>
            <el-button @click="delCate(scope.row.id)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加分类的dialogue -->
    <el-dialog
      title="添加文章分类"
      :close-on-click-modal= "false"
      :visible.sync= "addVisible"
      width="35%"
      @closed="addClose">
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="70px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false" size="mini">取 消</el-button>
        <el-button @click="add" type="primary" size="mini">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 修改文章分类的dialogue -->
    <el-dialog
      title="修改文章分类"
      :close-on-click-modal= "false"
      :visible.sync= "editVisible"
      width="35%"
      @closed="$refs.editForm.resetFields()">
      <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="70px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="editForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="editForm.cate_alias"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false" size="mini">取 消</el-button>
        <el-button @click="editCate" type="primary" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ArtCate',
  data() {
    return {
      addVisible: false,
      editVisible:false,
      list:[],
      addForm:{
        cate_name:'',
        cate_alias:''
      },
      addRules:{
        cate_name:[
          {required: true, message: '请输入分类名称', trigger:'blur'},
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias:[
          {required: true, message:'请输入分类别名', trigger: 'blur'},
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      },
      editForm:{
        cate_name:'',
        cate_alias:'',
        id:''
      },
      editRules:{
        cate_name:[
          {required: true, message: '请输入分类名称', trigger:'blur'},
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias:[
          {required: true, message:'请输入分类别名', trigger: 'blur'},
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 发请求获取数据
    this.getCateList()
  },
  methods:{
    async getCateList() {
      const {data: res} = await this.$http.get('/my/cate/list')
      if(res.code !== 0) return
      this.list = res.data
    },
    addClose() {
      this.$refs.addForm.resetFields()
    },
    add() {
      this.$refs.addForm.validate(async valid => {
        if(!valid) return
        const{data: res} = await this.$http.post('/my/cate/add',this.addForm)
        if(res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.addVisible = false
        this.getCateList()
      })
    },
    showEdit(row) {
      this.editVisible = true
      this.editForm = {...row}
    },
    editCate() {
      this.$refs.editForm.validate(async valid => {
        if(!valid) return
        const{data:res} = await this.$http.put('/my/cate/info', this.editForm)
        if(res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.editVisible = false
        this.getCateList()
      })
    },
    delCate(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 用户点确认才会执行.then()的逻辑
        const{data:res} = await this.$http.delete('/my/cate/del',{
          params:{
            id
          }
        })
        if(res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.getCateList()
      }).catch(() => {
      });
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
