import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 引用moment
import moment from 'moment'

// 导入全局样式
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
// 引入tree-table插件
import TableTree from 'vue-table-with-tree-grid'
// 引入elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'

import quillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(quillEditor)
Vue.use(ElementUI)

Vue.component('tree-table', TableTree)
// 设置默认axios路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置axios拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
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
// 引入moment
Vue.prototype.$moment = moment
moment.locale()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
