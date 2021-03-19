import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/login',
  name: 'login',
  component: login
},
{
  path: '/Home',
  name: 'Home',
  component: Home
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫，去往除了登陆页面外的页面获取是否存在token，存在就前往对应的页面，不存在就返回登录页面
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
