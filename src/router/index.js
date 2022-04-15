import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/login/callback',
    component: () => import('@/views/LoginCallback.vue')
  },
  {
    path: '/me',
    component: () => import('@/views/Me.vue')
  },
  {
    path: '/user/:userId',
    component: () => import('@/views/User.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
