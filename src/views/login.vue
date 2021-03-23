<template>
  <div class="main">
    <div class="loginbar">
      <el-form ref="loginformRef" :model="loginform" :rules="loginRules">
        <el-form-item prop="username">
          <el-input
            v-model="loginform.username"
            placeholder="Username"
            prefix-icon="iconfont icon-user"
            id="login-input"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginform.password"
            placeholder="Password"
            prefix-icon="iconfont icon-3702mima"
            id="login-input"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item id="btn-flex">
          <el-button @click="loginSumit('loginformRef')" round>登录</el-button>
          <el-button @click="loginReset('loginformRef')" round>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    const usercheck = (rule, value, callbak) => {
      if (!value) {
        callbak(new Error('账号不可为空'))
      } else if (value.length <= 3) {
        callbak(new Error('账号长度不可少于3位'))
      } else {
        callbak()
      }
    }
    return {
      loginform: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [{ validator: usercheck, trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    loginSumit: function(target) {
      const that = this
      // 自定义验证
      this.$refs[target].validate(async (valid, callbak) => {
        if (valid) {
          const { data } = await this.$axios.post('/login', this.loginform)
          if (data.meta.status !== 200) {
            this.$message.error({
              message: '账号密码错误',
              showClose: true
            })
            return this.$refs[target].resetFields()
          } else {
            this.$message.success({
              message: '登录成功！1秒后跳转管理页面',
              showClose: true,
              duration: 1000
            })
            sessionStorage.setItem('token', data.data.token)
            setTimeout(function() {
              that.$router.push('/Home')
            }, 1000)
          }
        } else {
          this.$message.warning({
            message: '很抱歉，账号密码不符合规格',
            showClose: true
          })
          return this.$refs[target].resetFields()
        }
      })
    },
    loginReset: function(data) {
      return this.$refs[data].resetFields()
    }
  }
}
</script>
<style scoped>
.main {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  background: url('../assets/loginImg1.jpg') round;
  background-size: 100% 100%;
}

.loginbar {
  width: 21.277rem;
  border-radius: 0.6rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 6px rgba(0, 0, 0, 1);
}

.el-form {
  padding: 1rem;
  text-align: center;
}

.el-form-item {
  width: 80%;
  margin: 1rem auto;
}

.el-button {
  background: transparent;
  color: white;
}
</style>
<style>
#login-input {
  border: none;
  border-bottom: 1px solid #dcdfe6;
  background: transparent !important;
  color: white;
}
#btn-flex {
  display: flex;
  justify-content: space-around;
}
</style>
