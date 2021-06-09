import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach(function (to, from, next) {
  // to将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数 表示放行  next()直接放行 next('/login') 强制跳转
  // 登录也直接放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 跳转登录页面
  if (!tokenStr) return next('/login')
  next()
})
export default router
