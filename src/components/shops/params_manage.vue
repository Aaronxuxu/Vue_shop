<template>
  <div class="">
    <div class="params_header params">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        effect="dark"
        show-icon
        :closable="false"
      >
      </el-alert>
    </div>
    <div class="params_choose params">
      <span>选择商品分类：</span>
      <el-cascader
        ref="elchose"
        v-model="choseID"
        :options="options"
        :props="{
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          leaf: 'cat_level',
          emitPath: false
        }"
        :show-all-levels="false"
      ></el-cascader>
    </div>
    <div class="params_main params">
      <el-tabs type="border-card" v-model="activeName">
        <el-button
          id="el-button"
          type="primary"
          @click="getCateAttrForm()"
          size="mini"
          :disabled="disabled"
          >{{ activeName === 'many' ? '添加参数' : '添加属性' }}</el-button
        >
        <el-tab-pane
          :label="item.chiName"
          :name="item.engName"
          v-for="item in cardArr"
          :key="item.id"
        >
          <el-table :data="parData" style="width: 100%" border>
            <el-table-column type="expand" header-align="center" align="center">
              <template slot-scope="scope">
                <el-tag
                  effect="dark"
                  :disable-transitions="true"
                  closable
                  @close="delAttrTag(scope.row, index)"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  >{{ item }}</el-tag
                >
                <el-input
                  prop="scope.row.attr_id"
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="primary"
                  @click="getCateAttrForm(scope.row)"
                  >修改</el-button
                >
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  @click="delCateAttr(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 添加修改弹出框 -->
    <el-dialog
      :title="activeName === 'many' ? '动态参数' : '静态参数'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="cateAttrForm" ref="cateAttrForm" :rules="cateAttRules">
        <el-form-item
          label="名称"
          :label-width="formLabelWidth"
          prop="attr_name"
        >
          <el-input
            v-model="cateAttrForm.attr_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm('cateAttrForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 编辑或添加
      isEdit: false,
      // 按钮根据分类等级禁止或使用
      disabled: true,
      // 当前卡片的名称
      activeName: 'many',
      // 选择分类数组
      options: [],
      // 选中分类的ID
      choseID: '',
      // 选项卡数组
      cardArr: [
        {
          id: '1',
          chiName: '动态参数',
          engName: 'many'
        },
        { id: '2', chiName: '静态参数', engName: 'only' }
      ],
      // 参数数据
      parData: [],
      // 弹出框
      dialogFormVisible: false,
      // 添加修改表单
      cateAttrForm: {},
      // 提交表单验证内容
      cateAttRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      // 表格宽度
      formLabelWidth: '120px'
    }
  },
  methods: {
    // 获取所有分类（写完）
    async getCategories() {
      const { data: res } = await this.$axios.get('/categories')
      if (res.meta.status !== 200) {
        return this.showMessage('error', res.meta.msg)
      }
      return (this.options = res.data)
    },

    // 获取指定分类的参数（写完）
    async getCateAttr(id, par) {
      const { data: res } = await this.$axios.get(
        '/categories/' + id + '/attributes',
        {
          params: {
            sel: [par]
          }
        }
      )
      res.data.forEach(element => {
        element.inputVisible = false
        element.inputValue = ''
        element.attr_vals =
          element.attr_vals === '' ? [] : element.attr_vals.split(',')
      })
      return res.data
    },

    // 获取添加修改表单（写完）
    async getCateAttrForm(scope) {
      this.dialogFormVisible = true
      if (!scope) {
        return (this.cateAttrForm = {
          attr_name: '',
          attr_sel: this.activeName,
          attr_vals: ''
        })
      }
      const { data: res } = await this.$axios.get(
        '/categories/' + scope.cat_id + '/attributes/' + scope.attr_id,
        {
          params: {
            attr_sel: scope.attr_sel
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.showMessage('error', res.meta.msg)
      }
      return (this.cateAttrForm = {
        attr_id: res.data.attr_id,
        attr_name: res.data.attr_name,
        attr_sel: res.data.attr_sel
      })
    },

    // 删除指定参数的标签/
    async delAttrTag(scope, index) {
      scope.attr_vals.splice(index, 1)
      const { data: res } = await this.$axios.put(
        '/categories/' + scope.cat_id + '/attributes/' + scope.attr_id,
        {
          attr_name: scope.attr_name,
          attr_sel: scope.attr_sel,
          attr_vals: scope.attr_vals.join(',')
        }
      )
      if (res.meta.status !== 200) {
        return this.showMessage('error', res.meta.msg)
      }
      return this.showMessage('success', res.meta.msg)
    },

    // 添加动态参数或静态属性（写完）
    async confirm(ref) {
      this.$refs[ref].validate(async (valid, callback) => {
        if (!valid) return
        if (this.cateAttrForm.attr_id) {
          const { data: res } = await this.$axios.put(
            '/categories/' +
              this.choseID +
              '/attributes/' +
              this.cateAttrForm.attr_id,
            this.cateAttrForm
          )
          if (res.meta.status !== 200) {
            return this.showMessage('error', res.meta.msg)
          }
          this.showMessage('success', res.meta.msg)
        } else {
          const { data: res } = await this.$axios.post(
            '/categories/' + this.choseID + '/attributes',
            this.cateAttrForm
          )
          if (res.meta.status !== 201) {
            return this.showMessage('error', res.meta.msg)
          }
          this.showMessage('success', res.meta.msg)
        }
        this.dialogFormVisible = false
        return (this.parData = await this.getCateAttr(
          this.choseID,
          this.activeName
        ))
      })
    },

    // 删除参数（完成）
    delCateAttr(scope) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(
            '/categories/' + scope.cat_id + '/attributes/' + scope.attr_id
          )
          if (res.meta.status !== 200) {
            return this.showMessage('error', res.meta.msg)
          }
          this.showMessage('success', res.meta.msg)
          return (this.parData = await this.getCateAttr(
            this.choseID,
            this.activeName
          ))
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    async handleInputConfirm(scope) {
      if (scope.inputValue.trim().length === 0) {
        scope.inputVisible = false
        scope.inputValue = ''
        return
      }
      scope.attr_vals.push(scope.inputValue.trim())
      scope.inputVisible = false
      scope.inputValue = ''
      const { data: res } = await this.$axios.put(
        '/categories/' + scope.cat_id + '/attributes/' + scope.attr_id,
        {
          attr_name: scope.attr_name,
          attr_sel: scope.attr_sel,
          attr_vals: scope.attr_vals.join(',')
        }
      )
      if (res.meta.status !== 200) {
        scope.attr_vals.splice(-1)
        return this.showMessage('error', res.meta.msg)
      }
      return this.showMessage('success', res.meta.msg)
    },

    showInput(scope) {
      scope.inputVisible = true
      // this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput[0].$refs.input.focus()
      })
    }
  },
  mounted() {
    this.getCategories()
  },
  watch: {
    // 监听分类ID的变化（写完）
    choseID: async function(newVal) {
      var data = this.$refs.elchose.getCheckedNodes()[0]
      if (data && data.level !== 3) {
        this.showMessage('warning', '只允许为第三级分类设置相关参数！')
        return this.$nextTick(function() {
          this.$refs.elchose.$refs.panel.clearCheckedNodes()
          this.$refs.elchose.$refs.panel.activePath = []
        })
      }
      if (!data) {
        this.disabled = true
      } else {
        this.disabled = false
      }
      this.parData = await this.getCateAttr(this.choseID, this.activeName)
    },
    // 监听卡片的变化（写完）
    activeName: async function(newVal) {
      if (!this.choseID) return
      return (this.parData = await this.getCateAttr(
        this.choseID,
        this.activeName
      ))
    }
  }
}
</script>
<style scoped>
.params,
#el-button {
  margin-bottom: 1.5rem;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
section {
  float: left;
}
</style>
