<template>
  <div class="">
    <!-- 添加部分 -->
    <div class="cates_add cates">
      <el-button type="" @click="getcatesForm()">添加分类</el-button>
    </div>
    <!-- 表格部分 -->
    <div class="cates_table cates">
      <tree-table
        :data="catesList"
        show-index
        border
        index-text="#"
        :expand-type="false"
        :selection-type="false"
        :show-row-hover="false"
        :columns="columns"
      >
        <template slot="deletedCates" scope="scope">
          <el-tag
            :type="scope.row.cat_deleted === false ? 'success' : 'danger'"
            effect="dark"
            ><i
              :class="
                scope.row.cat_deleted === false
                  ? 'el-icon-check'
                  : 'el-icon-close'
              "
            ></i
          ></el-tag>
        </template>
        <template slot="levelCates" scope="scope">
          <el-tag type="" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="editCates" scope="scope">
          <el-row type="flex">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="getcatesForm(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="delCates(scope.row)"
              >删除</el-button
            >
          </el-row>
        </template>
      </tree-table>
    </div>
    <!-- 分页部分 -->
    <div class="cates_page cates">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 添加修改弹出框 -->
    <el-dialog
      :title="isEdit === true ? '修改商品' : '添加商品分类'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="cateForm" ref="cateForm" :rules="cateRules" status-icon>
        <el-form-item
          label="分类名称"
          :label-width="formLabelWidth"
          prop="cat_name"
        >
          <el-input v-model="cateForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="父级分类"
          :label-width="formLabelWidth"
          v-if="isEdit === false"
          prop="cat_pid"
        >
          <el-cascader
            ref="cateCas"
            v-model="cateForm.cat_pid"
            :options="addCateList"
            :props="{
              expandTrigger: 'hover',
              emitPath: false,
              checkStrictly: true,
              value: 'cat_id',
              label: 'cat_name',
              leaf: '',
              children: 'children'
            }"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('cateForm')">取 消</el-button>
        <el-button type="primary" @click="confirm('cateForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    const catNameRules = (rule, value, callback) => {
      if (!value) return callback(new Error('分类名称不可为空'))
      if (value.length < 1 || value.length > 8) {
        return callback(new Error('分类名称长度在1~8个字符'))
      }
      return callback()
    }
    return {
      total: 0,
      pageSize: 5,
      pageNum: 1,
      // 分类列表
      catesList: [],
      // 选择分类的列表
      addCateList: [],
      columns: [
        { label: '分类名称', prop: 'cat_name', headerAlign: 'center' },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          headerAlign: 'center',
          align: 'center',
          type: 'template',
          template: 'deletedCates'
        },
        {
          label: '排序',
          prop: 'cat_level',
          headerAlign: 'center',
          align: 'center',
          type: 'template',
          template: 'levelCates'
        },
        {
          label: '操作',
          headerAlign: 'center',
          type: 'template',
          template: 'editCates'
        }
      ],
      // 分类表单数据
      cateForm: {},
      // 是否弹出框
      dialogFormVisible: false,
      formLabelWidth: '120px',
      // 是否编辑
      isEdit: false,
      // 表单规则
      cateRules: {
        cat_name: [{ validator: catNameRules, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 关于分页每页显示数量的方法
    handleSizeChange(val) {
      this.pageSize = val
      this.getCategories()
    },

    // 关于分页当前页的方法
    handleCurrentChange(val) {
      this.pageNum = val
      this.getCategories()
    },

    // 获取商品分类信息
    async getCategories() {
      const { data: res } = await this.$axios.get('/categories', {
        params: {
          pagenum: this.pageNum,
          pagesize: this.pageSize
        }
      })
      if (res.meta.status !== 200) {
        return this.showMessage('error', res.meta.msg)
      }
      this.total = res.data.total
      return (this.catesList = res.data.result)
    },

    // 获取二级分类全部信息
    async getSecCategories() {
      const { data: res } = await this.$axios.get('/categories', {
        params: {
          type: [2]
        }
      })
      if (res.meta.status !== 200) {
        return this.showMessage('error', res.meta.msg)
      }
      return res.data
    },

    // 根据ID查询分类
    async getCateByID(id) {
      const { data: res } = await this.$axios.get('/categories/' + id)
      if (res.meta.status !== 200) {
        return this.showMessage('erroe', res.meta.msg)
      }
      return res.data
    },

    // 获取添加修改表单
    async getcatesForm(scope) {
      this.dialogFormVisible = true
      // 如果有scope，证明修改，如果没有scope，证明添加
      if (scope) {
        this.isEdit = true
        const res = await this.getCateByID(scope.cat_id)
        return (this.cateForm = {
          cat_name: res.cat_name,
          cat_id: res.cat_id
        })
      }
      this.isEdit = false
      this.cateForm = {
        cat_name: '',
        cat_level: 0,
        cat_pid: 0
      }
      // 获取2级分类菜单
      return (this.addCateList = await this.getSecCategories())
    },

    // 删除分类
    delCates(scope) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(
            '/categories/' + scope.cat_id
          )
          if (res.meta.status !== 200) {
            return this.showMessage('error', res.meta.msg)
          }
          this.showMessage('success', res.meta.msg)
          this.getCategories()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 确认添加或修改
    confirm(ref) {
      this.$refs[ref].validate(async (valid, callback) => {
        if (!valid) return
        // isEdit为true，修改其数据
        // isEdit为false，添加数据
        this.dialogFormVisible = false
        if (this.isEdit) {
          const { data: res } = await this.$axios.put(
            '/categories/' + this.cateForm.cat_id,
            this.cateForm
          )
          if (res.meta.status !== 200) {
            return this.showMessage('error', res.meta.msg)
          }
          this.showMessage('success', res.meta.msg)
        } else {
          if (this.cateForm.cat_pid !== 0) {
            this.cateForm.cat_level = this.$refs.cateCas.getCheckedNodes()[0].level
          }
          // 添加数据
          const { data: res } = await this.$axios.post(
            '/categories',
            this.cateForm
          )
          if (res.meta.status !== 201) {
            return this.showMessage('error', res.meta.msg)
          }
          this.showMessage('success', res.meta.msg)
        }
        this.getCategories()
      })
    },

    // 取消添加或修改
    cancel(ref) {
      this.dialogFormVisible = false
      this.$refs[ref].resetFields()
    }
  },
  mounted: function() {
    this.getCategories()
  }
}
</script>
<style scoped>
.cates {
  margin-bottom: 1.5rem;
}
.el-button {
  padding: 0.6rem 0.7rem;
  font-size: 0.6rem;
}
</style>
