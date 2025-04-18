import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth } from './requireAuth'

import HeroPage from '../views/HeroPage.vue'
import NotFound from '@/views/NotFound.vue'
import Login from '@/views/LoginPage.vue'
import LayoutPage from '@/components/LayoutPage.vue'
import ArticlesPage from '@/views/Articles/ArticlesPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
const routes = [
  {
    path: '/',
    children: [
      {
        path: '',
        name: 'Home',
        component: HeroPage,
      },
      {
        path: 'login',
        name: 'Login',
        component: Login,
      },
      {
        path: '',
        component: LayoutPage,
        children: [
          {
            path: 'articles',
            name: 'Articles',
            component: ArticlesPage,
            beforeEnter: requireAuth,
          },
          {
            path: 'profile',
            name: 'Profile',
            component: ProfilePage,
            beforeEnter: requireAuth,
          },
        ],
      },
      {
        path: ':pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
