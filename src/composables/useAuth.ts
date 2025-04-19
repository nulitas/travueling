import { ref } from 'vue'
import axios from 'axios'
import api from '@/api'
import type { LoginCredentials, LoginResponse, RegisterCredentials, User } from '@/types/auth'
import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const authStore = useAuthStore()
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const handleRequest = async <T>(fn: () => Promise<T>): Promise<T> => {
    error.value = null
    isLoading.value = true
    try {
      return await fn()
    } catch (err) {
      error.value = parseError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const parseError = (err: unknown): Error => {
    if (axios.isAxiosError(err)) {
      return new Error(
        err.response?.data?.error?.message || err.message || 'An unexpected error occurred',
      )
    }
    if (err instanceof Error) {
      return err
    }
    return new Error('Unknown error occurred')
  }

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return handleRequest(async () => {
      const res = await api.post<LoginResponse>('/auth/local', credentials)
      authStore.setCredentials(res.data)
      return res.data
    })
  }

  const register = async (credentials: RegisterCredentials): Promise<LoginResponse> => {
    return handleRequest(async () => {
      const res = await api.post<LoginResponse>('/auth/local/register', credentials)
      authStore.setCredentials(res.data)
      return res.data
    })
  }

  const getMe = async (): Promise<User> => {
    return handleRequest(async () => {
      const res = await api.get<User>('/users/me')
      authStore.user = res.data
      return res.data
    })
  }

  return {
    login,
    register,
    getMe,
    isLoading,
    error,
  }
}
