import { defineStore } from 'pinia'
import type { LoginResponse, User } from '@/types/auth'
import { getCurrentUser } from '@/services/authApi'

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    initialize() {
      const token = localStorage.getItem('authToken')
      const user = localStorage.getItem('authUser')

      if (token) {
        try {
          this.token = token
          this.user = user ? JSON.parse(user) : null
        } catch (error) {
          console.error('Failed to parse stored auth data:', error)
          this.clearStorage()
        }
      }
    },

    setCredentials({ user, jwt }: LoginResponse) {
      this.user = user
      this.token = jwt
      localStorage.setItem('authUser', JSON.stringify(user))
      localStorage.setItem('authToken', jwt)
    },

    logout() {
      this.user = null
      this.token = null
      this.clearStorage()
    },

    clearStorage() {
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
