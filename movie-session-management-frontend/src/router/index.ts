import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('../views/MoviesList.vue'),
    },
    {
      path: '/movies/new',
      name: 'movies-new',
      component: () => import('../views/MovieFormView.vue'),
    },
    {
      path: '/movies/:id/edit',
      name: 'movies-edit',
      component: () => import('../views/MovieFormView.vue'),
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: () => import('../views/RoomsList.vue'),
    },
    {
      path: '/rooms/new',
      name: 'rooms-new',
      component: () => import('../views/RoomFormView.vue'),
    },
    {
      path: '/rooms/:id/edit',
      name: 'rooms-edit',
      component: () => import('../views/RoomFormView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
