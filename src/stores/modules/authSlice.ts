import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuthState, LoginResponse } from '@/types/auth'

const loadAuthState = (): AuthState => {
  try {
    const serializedToken = localStorage.getItem('authToken')
    const serializedUser = localStorage.getItem('authUser')
    if (!serializedToken || !serializedUser) {
      return { user: null, token: null }
    }
    return {
      user: JSON.parse(serializedUser),
      token: JSON.parse(serializedToken),
    }
  } catch (error) {
    console.error('Error parsing auth state:', error)
    return { user: null, token: null }
  }
}

export const useAuthStore = defineStore('auth', () => {
  const { user, token } = loadAuthState()

  const currentUser = ref(user)
  const currentToken = ref(token)

  const setCredentials = (data: LoginResponse) => {
    currentUser.value = data.user
    currentToken.value = data.jwt

    localStorage.setItem('authUser', JSON.stringify(data.user))
    localStorage.setItem('authToken', JSON.stringify(data.jwt))
  }

  const logout = () => {
    currentUser.value = null
    currentToken.value = null
    localStorage.removeItem('authUser')
    localStorage.removeItem('authToken')
  }

  return {
    currentUser,
    currentToken,
    setCredentials,
    logout,
  }
})
