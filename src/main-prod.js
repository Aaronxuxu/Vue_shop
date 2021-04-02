import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import format from 'date-fns/format'
// 导入全局样式
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
// 引入tree-table插件
import TableTree from 'vue-table-with-tree-grid'
// 引入elementui

import VueQuillEditor from 'vue-quill-editor'

import NProgress from 'nprogress'

Vue.use(VueQuillEditor)

Vue.component('tree-table', TableTree)
// 设置默认axios路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置axios拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.start()
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// 引入axios
Vue.prototype.$axios = axios

Vue.prototype.showMessage = function(v1, v2) {
  this.$message({
    type: v1,
    message: v2,
    showClose: true,
    duration: 2000
  })
}

Vue.prototype.$format = format

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
