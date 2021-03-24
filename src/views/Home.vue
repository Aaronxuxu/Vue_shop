<template>
  <el-container>
    <el-header>
      <maintop @exituser="exituser"></maintop>
    </el-header>
    <el-container>
      <el-aside>
        <leftnav :navlist="navList" :ishome="isHome"></leftnav>
      </el-aside>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/Home' }" v-if="navBread.length > 0"
            >首页
          </el-breadcrumb-item>
          <el-breadcrumb-item v-for="item in navBread" :key="String(item.id)">
            {{ item.authName }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="main_body">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import leftnav from '@/components/home_base/left_nav'
import maintop from '@/components/home_base/main_top.vue'

export default {
  data() {
    return {
      navList: [],
      navBread: [],
      isHome: false
    }
  },
  components: {
    leftnav: leftnav,
    maintop: maintop
  },
  methods: {
    exituser: function() {
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
    },
    async getNavList() {
      const { data } = await this.$axios.get('/menus')
      if (data.meta.status !== 200) {
        return this.$message.error({
          message: data.meta.msg + '，获取左侧菜单失败',
          showClose: true,
          duration: 2000
        })
      }
      this.navList = data.data
    },
    getNavbread(arr) {
      const urlArr = []
      const pathname = location.pathname.substring(1)
      arr.forEach(element => {
        element.children.find(e => {
          if (e.path === pathname) {
            urlArr.push(element, e)
          }
        })
      })
      return urlArr
    }
  },
  mounted() {
    this.getNavList()
  },
  beforeUpdate: function() {
    this.navBread = this.getNavbread(this.navList)
    if (this.navBread.length < 1) {
      this.isHome = true
    } else {
      this.isHome = false
    }
  }
}
</script>
<style scoped>
.el-header {
  height: 3rem !important;
  padding: 0;
}
.el-container {
  height: 100%;
}
.el-aside {
  width: auto !important;
  text-align: center;
}

.el-main {
  background-color: #eaedf1;
  /* text-align: center; */
}
.main_body {
  padding: 1rem;
  margin-top: 1rem;
  background-color: #fff;
}
</style>
