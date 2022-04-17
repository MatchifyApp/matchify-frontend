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
  },
  {
    path: '/users',
    component: () => import('@/views/Users.vue')
  },
  {
    path: '/track/:trackId',
    component: () => import('@/views/Track.vue')
  },
  {
    path: '/tracks',
    component: () => import('@/views/Tracks.vue')
  },
  {
    path: '/album/:albumId',
    component: () => import('@/views/Album.vue')
  },
  {
    path: '/albums',
    component: () => import('@/views/Albums.vue')
  },
  {
    path: '/artist/:artistId',
    component: () => import('@/views/Artist.vue')
  },
  {
    path: '/artists',
    component: () => import('@/views/Artists.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
