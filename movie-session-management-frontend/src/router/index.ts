import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { title: 'Dashboard' }
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('../views/MoviesList.vue'),
      meta: { title: 'Filmes' }
    },
    {
      path: '/movies/new',
      name: 'movies-new',
      component: () => import('../views/MovieFormView.vue'),
      meta: { title: 'Novo Filme' }
    },
    {
      path: '/movies/:id/edit',
      name: 'movies-edit',
      component: () => import('../views/MovieFormView.vue'),
      meta: { title: 'Editar Filme' }
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: () => import('../views/RoomsList.vue'),
      meta: { title: 'Salas' }
    },
    {
      path: '/rooms/new',
      name: 'rooms-new',
      component: () => import('../views/RoomFormView.vue'),
      meta: { title: 'Nova Sala' }
    },
    {
      path: '/rooms/:id/edit',
      name: 'rooms-edit',
      component: () => import('../views/RoomFormView.vue'),
      meta: { title: 'Editar Sala' }
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: () => import('../views/SessionsList.vue'),
      meta: { title: 'Sessões' }
    },
    {
      path: '/sessions/new',
      name: 'sessions-new',
      component: () => import('../views/SessionFormView.vue'),
      meta: { title: 'Nova Sessão' }
    },
    {
      path: '/sessions/:id/edit',
      name: 'sessions-edit',
      component: () => import('../views/SessionFormView.vue'),
      meta: { title: 'Editar Sessão' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'Sobre' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
      meta: { title: '404 - Página Não Encontrada' }
    }
  ],
})

// Navigation guard para atualizar título da página
router.beforeEach((to) => {
  document.title = to.meta.title 
    ? `${to.meta.title} - Cinema Manager` 
    : 'Cinema Manager'
})

export default router
