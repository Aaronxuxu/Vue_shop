<template>
  <div class="main">
    <header>登录</header>
    <div class="loginbar">
      <section>
        <span id="login-msg" class="hidden-xs-only">账号：</span>
        <el-input style="" placeholder="请输入账号" v-model="username" clearable  autofocus></el-input>
      </section>
      <section>
        <span id="login-msg" class="hidden-xs-only">密码：</span>
        <el-input placeholder="请输入密码" v-model="password" show-password clearable ></el-input>
      </section>
      <section>
      <el-button round @click="loginCheck">登录</el-button>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    loginCheck: async function () {
      if (this.username === '' || this.password === '') {
        alert('请输入账号或密码')
      };
      this.$axios.post('http://localhost:8888/login', {
        username: this.username,
        password: this.password
      }).then(data => console.log(data))
      console.log(this.username, this.password)
    }
  },
  beforeCreate () {
    document.querySelector('body').classList.add('flex')
  },
  beforeDestroy () {
    document.querySelector('body').classList.remove('flex')
  }
}
</script>
<style scoped>
.main{
  color: white;
}
header{
  font-weight:400;
  font-size: 1.875rem;
}
section{
  margin-top: 1.25rem;
}
#login-msg{
  font-size: 0.9rem;
}
.el-input{
  width: 18.75rem!important;
}
</style>
