import { defineStore } from 'pinia'
import type { LoginResponse, User } from '@/types/auth'
import { getCurrentUser } from '@/services/authApi'

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('authUser') || 'null'),
    token: JSON.parse(localStorage.getItem('authToken') || 'null'),
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setCredentials({ user, jwt }: LoginResponse) {
      this.user = user
      this.token = jwt
      localStorage.setItem('authUser', JSON.stringify(user))
      localStorage.setItem('authToken', JSON.stringify(jwt))
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('authUser')
      localStorage.removeItem('authToken')
    },
    async fetchCurrentUser() {
      try {
        const user = await getCurrentUser()
        this.user = user
        localStorage.setItem('authUser', JSON.stringify(user))
      } catch (error) {
        console.error('Failed to fetch current user:', error)
        this.logout()
      }
    },
  },
})
