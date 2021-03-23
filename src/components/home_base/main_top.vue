<template>
  <div class="main_header">
    <div class="head_left">
      <span class="web_title">电商后台管理系统</span>
    </div>
    <div class="head_right">
      <el-button type="info" @click="exituser">退出</el-button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    exituser() {
      this.$emit('exituser')
    }
  }
}
</script>
<style scoped>
.main_header {
  display: flex;
  height: 3rem;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  color: white;
  font-size: 0.9rem;
}
.el-button {
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
}
</style>
