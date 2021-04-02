<template>
  <el-col :span="12">
    <el-menu
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      :default-active="deactive"
      ref="menu"
    >
      <el-button @click="btnCollapse">|||</el-button>
      <el-submenu
        :index="String(item.id)"
        v-for="item in navlist"
        :key="item.id"
      >
        <template slot="title">
          <i class="iconfont" :class="icon[item.id]"></i>
          <span slot="title">&nbsp;{{ item.authName }}</span>
        </template>
        <el-menu-item
          :index="'/' + itemc.path"
          v-for="itemc in item.children"
          :key="itemc.id"
        >
          <i class="iconfont" :class="icon[itemc.id]"></i>
          <span>&nbsp;{{ itemc.authName }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-col>
</template>
<script>
export default {
  props: ['navlist', 'ishome'],
  data() {
    return {
      isCollapse: false,
      deactive: '',
      deopeneds: '',
      key: '',
      icon: {
        125: 'icon-users',
        103: 'icon-tijikongjian',
        101: 'icon-shangpin',
        102: 'icon-danju',
        145: 'icon-baobiao',
        110: 'icon-user',
        111: 'icon-users',
        112: 'icon-user',
        104: 'icon-shangpin',
        115: 'icon-shangpin',
        121: 'icon-shangpin',
        107: 'icon-danju',
        146: 'icon-baobiao'
      }
    }
  },
  methods: {
    handleOpen(key) {
      this.key = key
    },
    handleClose(key) {
      this.$refs.menu.close(this.key)
    },
    btnCollapse() {
      this.isCollapse = !this.isCollapse
    },
    isdeactive(ishome) {
      if (ishome) {
        this.handleClose()
        return (this.deactive = '')
      }
      this.deactive = location.pathname
    },
    getNavKey(array) {
      const urlArr = []
      const pathname = location.pathname.substring(1)
      array.forEach(element => {
        element.children.find(e => {
          if (e.path === pathname) {
            urlArr.push(element)
          }
        })
      })
      return urlArr[0]
    }
  },
  mounted: function() {
    const width = window.screen.width
    width <= 750 ? (this.isCollapse = true) : (this.isCollapse = false)
    this.isdeactive()
  },
  beforeUpdate: function() {
    const data = this.getNavKey(this.navlist)
    if (data) {
      this.key = String(data.id)
    }
  },
  watch: {
    ishome: function(newval, oldval) {
      this.isdeactive(newval)
    }
  }
}
</script>
<style scoped>
.el-col-12 {
  width: 100%;
  height: 100%;
}
.el-button {
  width: 100%;
  color: rgb(185, 181, 181);
  border-color: #4a5064;
  border-radius: 0;
  background-color: #4a5064;
}
.el-menu:not(.el-menu--collapse) {
  width: 10rem;
  text-align: -webkit-left;
  border: none;
}
.el-menu {
  height: 100%;
}
</style>
