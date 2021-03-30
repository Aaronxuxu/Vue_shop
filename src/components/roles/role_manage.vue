<template>
  <div class="">
    <div class="roel_heade">
      <el-button type="primary" @click="formRole()">添加角色</el-button>
    </div>
    <div class="role_table">
      <el-table :data="tableData" border lazy style="width: 100%">
        <el-table-column type="expand" label="">
          <template slot-scope="scope">
            <div
              class="outside_rights"
              v-for="item in scope.row.children"
              :key="item.id"
            >
              <div class="content_left">
                <el-tag
                  type=""
                  closable
                  effect="dark"
                  @close="delRights(scope.row.id, item.id)"
                >
                  {{ item.authName }}
                </el-tag>
                <i class="el-icon-caret-right hidden-sm-and-down"></i>
              </div>
              <div class="content_right">
                <div
                  class="content_rights"
                  v-for="itema in item.children"
                  :key="itema.id"
                >
                  <div class="specific_left">
                    <el-tag
                      type="success"
                      closable
                      effect="dark"
                      @close="delRights(scope.row.id, itema.id)"
                    >
                      {{ itema.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right hidden-sm-and-down"></i>
                  </div>
                  <div class="specific_right">
                    <el-tag
                      type="warning"
                      effect="dark"
                      closable
                      v-for="itemb in itema.children"
                      :key="itemb.id"
                      @close="delRights(scope.row.id, itemb.id)"
                    >
                      {{ itemb.authName }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="#"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          align="center"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row :gutter="-10">
              <el-button
                :span="8"
                type="primary"
                icon="el-icon-edit"
                class="tableBtn"
                @click="formRole(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                :span="8"
                type="danger"
                icon="el-icon-delete"
                class="tableBtn"
                @click="delRole(scope.row.id)"
                >删除</el-button
              >
              <el-button
                :span="8"
                type="warning"
                icon="el-icon-setting"
                class="tableBtn"
                @click="editRights(scope.row)"
                >分配权限</el-button
              >
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加修改弹出框 -->
    <el-dialog
      :title="isEdit == false ? '添加角色' : '修改角色'"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-form :model="rolesForm" :rules="rules" ref="roleForm">
        <el-form-item
          label="角色名称"
          :label-width="formLabelWidth"
          prop="roleName"
        >
          <el-input v-model="rolesForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          :label-width="formLabelWidth"
          prop="roleDesc"
        >
          <el-input v-model="rolesForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('roleForm')">取 消</el-button>
        <el-button type="primary" @click="determine()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限弹出框 -->
    <el-dialog title="分配权限" :visible.sync="editRightsVisible">
      <el-tree
        ref="trees"
        default-expand-all
        show-checkbox
        node-key="id"
        :data="rightsList"
        :props="defaultProps"
        :default-checked-keys="checkNodes"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="getCheckedKeys()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isEdit: false,
      dialogFormVisible: false,
      editRightsVisible: false,
      rolesForm: {
        roleName: '',
        roleDesc: ''
      },
      formLabelWidth: '5.106rem',
      rules: {
        roleName: [
          { required: true, message: '请输入角色', trigger: 'blur' },
          {
            min: 2,
            max: 8,
            message: '角色名称长度在2~8个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      rightsList: [],
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      upRights: '',
      checkNodes: []
    }
  },
  methods: {
    // esc键退出弹出框清除数据
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs.roleForm.resetFields()
          done()
        })
        .catch(_ => {})
    },

    // 获取角色列表
    async getRoles() {
      const { data: res } = await this.$axios.get('/roles')
      if (res.meta.status !== 200) {
        return this.showMessage('error', res.meta.msg)
      }
      return (this.tableData = res.data)
    },

    // 退出弹出框清除数据
    cancel(data) {
      this.$refs[data].resetFields()
      this.dialogFormVisible = false
    },

    // 获取表单数据
    async formRole(data) {
      this.dialogFormVisible = true
      if (data) {
        this.isEdit = true
        const { data: res } = await this.$axios.get('/roles/' + data)
        if (res.meta.status !== 200) {
          return this.showMessage('error', res.meta.msg)
        }
        delete res.data.rolePermissionDesc
        return (this.rolesForm = res.data)
      }
      this.isEdit = false
    },

    // 添加或修改角色数据
    async determine() {
      if (!this.isEdit) {
        delete this.rolesForm.roleId
        const { data: res } = await this.$axios.post('/roles', this.rolesForm)
        if (res.meta.status !== 201) {
          this.showMessage('error', res.meta.msg)
        }
      } else {
        const { data: res } = await this.$axios.put(
          '/roles/' + this.rolesForm.roleId,
          this.rolesForm
        )
        if (res.meta.status !== 200) {
          this.showMessage('error', res.meta.msg)
        }
      }
      this.$refs.roleForm.resetFields()
      this.dialogFormVisible = false
      return this.getRoles()
    },

    // 删除角色数据
    delRole(scope) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete('/roles/' + scope)
          if (res.meta.status !== 200) {
            this.showMessage('error', res.meta.msg)
          } else {
            this.showMessage('success', res.meta.msg)
          }
          return this.getRoles()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 删除角色指定权限
    async delRights(rolesid, rightsid) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(
            'roles/' + rolesid + '/rights/' + rightsid
          )
          const index = this.tableData.findIndex(e => {
            return e.id === rolesid
          })
          if (res.meta.status !== 200) {
            return this.showMessage('error', res.meta.msg)
          }
          this.showMessage('success', res.meta.msg)
          return (this.tableData[index].children = res.data)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 获取权限列表
    async editRights(scope) {
      this.editRightsVisible = true
      const { data: res } = await this.$axios.get('/rights/tree')
      if (res.meta.status !== 200) {
        return this.showMessage('error', res.meta.msg)
      }
      this.roleId = scope.id
      this.checkNodes = scope.children
      this.rightsList = res.data
      this.$nextTick(function() {
        this.$refs.trees.setCheckedNodes(this.checkNodes)
      })
    },
    async getCheckedKeys() {
      const rightKey = [
        ...this.$refs.trees.getCheckedKeys(),
        ...this.$refs.trees.getHalfCheckedKeys()
      ]
      this.upRights = rightKey.join(',')
      const { data: res } = await this.$axios.post(
        '/roles/' + this.roleId + '/rights',
        {
          rids: this.upRights
        }
      )
      if (res.meta.status !== 200) {
        this.showMessage('error', res.meta.msg)
      }
      this.showMessage('success', res.meta.msg)
      this.editRightsVisible = false
      return this.getRoles()
    }
  },
  mounted() {
    this.getRoles()
  }
}
</script>
<style scoped>
.roel_heade {
  margin-bottom: 1.5rem;
}
.tableBtn {
  padding: 0.4rem 0.6rem;
  font-size: 0.6rem;
}
.outside_rights {
  display: flex;
  align-items: center;
  border: 1px solid gray;
  margin: 0 0 -1px -1px;
}
.content_left,
.specific_left {
  flex: 0.2;
  text-align: center;
}
.content_right,
.specific_right {
  flex: 0.8;
}
.content_rights {
  display: flex;
  align-items: center;
  border: 1px solid gray;
  margin: -1px;
}
.specific_left {
  flex: 0.2;
}
.specific_right {
  display: flex;
  flex-wrap: wrap;
}
.el-tag {
  margin-right: 0.5rem;
}
.specific_right .el-tag {
  margin: 0.5rem 0.5rem 0.5rem 0;
}
</style>
