<template>
  <div class="user_main">
    <div class="user_search">
      <div class="input">
        <el-input placeholder="请输入内容" v-model="searchName" clearable>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="sechName"
          ></el-button>
        </el-input>
      </div>
      <el-button type="primary" id="addUser" @click="formUser()"
        >添加用户</el-button
      >
    </div>
    <div class="user_form">
      <el-table :data="tableData" border style="width: 100%" stripe>
        <el-table-column
          type="index"
          label="#"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
          align="center"
        ></el-table-column>
        <el-table-column prop="mg_state" label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.mg_state == true ? true : false"
              @change="chanState(scope.row, scope.$index)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="editBtn">
            <el-button
              type="primary"
              icon="el-icon-edit"
              class="tableBtn"
              @click="formUser(editBtn)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              class="tableBtn"
              @click="open(editBtn.row.id, editBtn.$index)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                class="tableBtn"
                @click="assign(editBtn.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="user_page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalpage"
      >
      </el-pagination>
    </div>

    <!-- 添加/修改弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-form :model="userform" :rules="rules" ref="roleForm">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input
            v-model="userform.username"
            autocomplete="off"
            :disabled="isedit === true ? true : false"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
          prop="password"
          v-if="isedit == false"
        >
          <el-input v-model="userform.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="userform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="userform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('roleForm')">取 消</el-button>
        <el-button type="primary" @click="addoreditUsers('roleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 分配权限弹出框-->
    <el-dialog title="分配角色" :visible.sync="RoleFormVisible">
      <el-form :model="rolesform" ref="rolesform" :rules="rolesrules">
        <el-form-item label="当前的用户：" :label-width="formLabelWidth">
          {{ rolesBaseMsg.username }}
        </el-form-item>
        <el-form-item label="当前的角色：" :label-width="formLabelWidth">
          {{ rolesBaseMsg.role_name }}
        </el-form-item>
        <el-form-item
          label="分配新角色："
          :label-width="formLabelWidth"
          prop="id"
        >
          <el-select v-model="rolesform.id" placeholder="请选择">
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="item in rolesList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="RoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="affirm('rolesform')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    const usernRules = async (rule, value, callbak) => {
      if (value.length <= 3) return callbak(new Error('账号长度最少为3位'))
      const { data: res } = await this.$axios.get('/users', {
        params: {
          query: value,
          pagenum: 1,
          pagesize: 10
        }
      })
      if (res.data.users.length !== 0) {
        return callbak(new Error('该用户名已存在'))
      }
    }
    const userpRules = (rule, value, callbak) => {
      if (this.isedit) return
      if (value.length <= 5 || value.length >= 20) {
        return callbak(new Error('密码长度应在6字符到20字符之间'))
      }
    }
    return {
      searchName: '',
      tableData: [],
      rolesList: [],
      dialogFormVisible: false,
      RoleFormVisible: false,
      dialogDel: false,
      isedit: false,
      userform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { validator: usernRules, trigger: 'blur' },
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [{ validator: userpRules, trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur']
          }
        ],
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
      },
      rolesrules: {
        id: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      rolesform: { id: '' },
      rolesBaseMsg: [],
      formLabelWidth: '120px',
      currentPage: 1,
      totalpage: 0,
      pageSize: 2
    }
  },
  methods: {
    async getUsers() {
      const { data: res } = await this.$axios.get('/users', {
        params: {
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      if (res.meta.status !== 200) {
        return this.showMessage('error', res.meta.msg + '获取用户信息失败')
      }
      this.totalpage = res.data.total
      this.tableData = res.data.users
    },
    chanState: async function(row, index) {
      row.mg_state = !row.mg_state
      const { data: res } = await this.$axios.put(
        '/users/' + row.id + '/state/' + row.mg_state
      )
      if (res.meta.status !== 200) {
        return this.showMessage('error', res.meta.msg)
      }
      return this.showMessage('success', res.meta.msg)
    },
    cancel: function(data) {
      this.$refs[data].resetFields()
      this.dialogFormVisible = false
    },
    open: function(data, index) {
      this.$confirm('此操作将永久删除用户，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete('/users/' + data)
          if (res.meta.status !== 200) {
            return this.showMessage('error', res.meta.msg)
          }
          this.getUsers()
          return this.showMessage('success', '删除成功')
        })
        .catch(() => this.showMessage('warning', '已取消删除'))
    },
    formUser: async function(data) {
      this.dialogFormVisible = true
      if (data) {
        const { data: res } = await this.$axios.get('/users/' + data.row.id)
        this.isedit = true
        return (this.userform = res.data)
      }
      this.isedit = false
    },
    handleClose: function(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs.roleForm.resetFields()
          done()
        })
        .catch(_ => {})
    },
    addoreditUsers: async function(data) {
      if (!this.isedit) {
        delete this.userform.id
        const { data: res } = await this.$axios.post('/users', this.userform)
        if (res.meta.status !== 201) {
          return this.showMessage('error', res.meta.msg)
        }
        this.showMessage('success', res.meta.msg)
      } else {
        delete this.userform.username
        const { data: res } = await this.$axios.put(
          '/users/' + this.userform.id,
          this.userform
        )
        if (res.meta.status !== 200) {
          return this.showMessage('error', res.meta.msg)
        }
        this.showMessage('success', res.meta.msg)
      }
      this.$refs[data].resetFields()
      this.getUsers()
      this.dialogFormVisible = false
    },
    sechName: async function() {
      const { data: res } = await this.$axios.get('/users', {
        params: {
          query: this.searchName,
          pagenum: 1,
          pagesize: 10
        }
      })
      this.totalpage = res.data.total
      this.tableData = res.data.users
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getUsers()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUsers()
    },
    // 获取用户角色
    async assign(scope) {
      this.RoleFormVisible = true
      this.rolesBaseMsg = scope
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) {
        return this.showMessage('error', res.meta.msg)
      }
      this.rolesList = res.data
    },
    affirm(ref) {
      this.$refs[ref].validate(async v => {
        if (!v) return
        const { data: res } = await this.$axios.put(
          '/users/' + this.rolesBaseMsg.id + '/role',
          { rid: this.rolesform.id }
        )
        if (res.meta.status !== 200) {
          return this.showMessage('error', res.meta.msg)
        }
        this.showMessage('success', res.meta.msg)
        this.RoleFormVisible = false
        return this.getUsers()
      })
    }
  },
  mounted() {
    this.getUsers()
  }
}
</script>
<style scoped>
.tableBtn {
  padding: 0.3rem 1rem;
  font-size: 0.6rem;
}

.tableFlex {
  display: flex !important;
}
.user_search {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1.5rem;
}
.user_form {
  margin-bottom: 1.5rem;
}
.user_page {
  display: flex;
  justify-content: center;
}
.input {
  margin-right: 2rem;
}
.top {
  text-align: center;
}
#addUser {
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
}
</style>
<style>
.el-pagination span,
.el-pager li {
  min-width: 1.511rem !important;
  height: 1.194rem !important;
  line-height: 1.194rem !important;
  font-size: 0.553rem !important;
}
</style>
<style>
.el-table .cell {
  display: flex;
  justify-content: center;
}
</style>
