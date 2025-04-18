import { createRouter, createWebHistory } from 'vue-router'

import Hero from '../views/HeroPage.vue'
import NotFound from '@/views/NotFound.vue'
import Login from '@/views/LoginPage.vue'
import ArticlesPage from '@/views/Articles/ArticlesPage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Hero,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/articles',
      name: 'Article',
      component: ArticlesPage,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
})

export default router
