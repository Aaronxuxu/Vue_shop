<template>
  <div class="">
    Home页面

    <el-button type="primary" round @click="exitUser">退出</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    exitUser: function() {
      const that = this
      sessionStorage.clear()
      this.$message.success({
        message: '退出成功，2秒后回转到登录页面',
        showClose: true,
        duration: 2000
      })
      setTimeout(() => {
        that.$router.push('/login')
      }, 2000)
    }
  },
  mounted() {}
}
</script>
<style></style>
