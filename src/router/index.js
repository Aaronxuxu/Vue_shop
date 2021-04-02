import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由懒加载
const login = () => import(/* webpackChunkName: "indexHome" */ '../views/login.vue')
const Home = () => import(/* webpackChunkName: "indexHome" */ '../views/Home.vue')

// 管理页面首页
const index = () => import(/* webpackChunkName: "HomeComIndex" */ '../components/index/index.vue')
// 订单管理页面
const orders = () => import(/* webpackChunkName: "HomeComOrder" */ '../components/carts/cart_manage.vue')
// 数据图标页面
const reports = () => import(/* webpackChunkName: "HomeComData" */ '../components/datas/data_manage.vue')
// 权限管理页面
const roles = () => import(/* webpackChunkName: "HomeComRoles" */ '../components/roles/role_manage.vue')
const rights = () => import(/* webpackChunkName: "HomeComRoles" */ '../components/roles/rights_manage.vue')
// 商品管理页面
const goods = () => import(/* webpackChunkName: "HomeComGoods" */ '../components/shops/shop_manage.vue')
const params = () => import(/* webpackChunkName: "HomeComGoods" */ '../components/shops/params_manage.vue')
const categories = () => import(/* webpackChunkName: "HomeComGoods" */ '../components/shops/categories_manage.vue')
const addGoods = () => import(/* webpackChunkName: "HomeComGoods" */ '../components/shops/shop_Add.vue')
// 用户管理页面
const users = () => import(/* webpackChunkName: "HomeComUsers" */ '../components/users/user_manage.vue')
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
  component: Home,
  redirect: '/index',
  children: [
    // 欢迎首页
    {
      path: '/index',
      component: index
    },
    // 订单
    {
      path: '/orders',
      component: orders
    },

    // 数据
    {
      path: '/reports',
      component: reports
    },

    // 权限
    {
      path: '/roles',
      component: roles
    },
    {
      path: '/rights',
      component: rights
    },

    // 商品
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/params',
      component: params
    },
    {
      path: '/categories',
      component: categories
    },
    {
      path: '/goods/add',
      component: addGoods
    },

    // 用户
    {
      path: '/users',
      component: users
    }
  ]
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫，去往除了登陆页面外的页面获取是否存在token，存在就前往对应的页面，不存在就返回登录页面
router.beforeEach((to, from, next) => {
  const tokenStr = sessionStorage.getItem('token')
  if (to.path === '/login') {
    if (tokenStr) return next('/Home')
    return next()
  }
  if (!tokenStr) return next('/login')
  next()
})
export default router
