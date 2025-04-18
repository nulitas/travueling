import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/store/authStore'

export function requireAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore()

  if (authStore.token && authStore.user) {
    next()
  } else {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
}
