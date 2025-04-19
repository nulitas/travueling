import { ref } from 'vue'
import api from '@/api'
import type { LoginCredentials, LoginResponse, RegisterCredentials, User } from '@/types/auth'
import { useAuthStore } from '@/store/authStore'
import axios from 'axios'
export const useAuth = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const authStore = useAuthStore()

  const handleAuthRequest = async <T>(fn: () => Promise<T>): Promise<T> => {
    error.value = null
    isLoading.value = true
    try {
      const result = await fn()
      return result
    } catch (err) {
      error.value = parseError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const parseError = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      return err.response?.data?.error?.message || err.message || 'An unexpected error occurred'
    }
    if (err instanceof Error) {
      return err.message
    }
    return 'Unknown error occurred'
  }

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return handleAuthRequest(async () => {
      const res = await api.post<LoginResponse>('/auth/local', credentials)
      authStore.setCredentials(res.data)
      return res.data
    })
  }

  const register = async (credentials: RegisterCredentials): Promise<LoginResponse> => {
    return handleAuthRequest(async () => {
      const res = await api.post<LoginResponse>('/auth/local/register', credentials)
      authStore.setCredentials(res.data)
      return res.data
    })
  }

  const getMe = async (): Promise<User | undefined> => {
    return handleAuthRequest(async () => {
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
