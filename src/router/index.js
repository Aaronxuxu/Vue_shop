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
  component: Home,
  redirect: '/index',
  children: [
    // 欢迎首页
    {
      path: '/index',
      component: () => import('../components/index/index.vue')
    },
    // 订单
    {
      path: '/orders',
      component: () => import('../components/carts/cart_manage.vue')
    },

    // 数据
    {
      path: '/reports',
      component: () => import('../components/datas/data_manage.vue')
    },

    // 权限
    {
      path: '/roles',
      component: () => import('../components/roles/role_manage.vue')
    },
    {
      path: '/rights',
      component: () => import('../components/roles/rights_manage.vue')
    },

    // 商品
    {
      path: '/goods',
      component: () => import('../components/shops/shop_manage.vue')
    },
    {
      path: '/params',
      component: () => import('../components/shops/params_manage.vue')
    },
    {
      path: '/categories',
      component: () => import('../components/shops/categories_manage.vue')
    },
    {
      path: '/goods/add',
      component: () => import('../components/shops/shop_Add.vue')
    },

    // 用户
    {
      path: '/users',
      component: () => import('../components/users/user_manage.vue')
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
