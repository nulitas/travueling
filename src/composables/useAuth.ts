import { ref } from 'vue'
import api from '@/api'
import { AxiosError } from 'axios'
import type { LoginCredentials, LoginResponse, RegisterCredentials, User } from '@/types/auth'

export const useAuth = () => {
  const isLoading = ref(false)

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    isLoading.value = true
    try {
      const res = await api.post('/auth/local', credentials)
      return res.data
    } catch (err) {
      return handleError(err)
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<LoginResponse> => {
    isLoading.value = true
    try {
      const res = await api.post('/auth/local/register', credentials)
      return res.data
    } catch (err) {
      return handleError(err)
    } finally {
      isLoading.value = false
    }
  }

  const getMe = async (): Promise<User | undefined> => {
    isLoading.value = true
    try {
      const res = await api.get('/users/me')
      return res.data
    } catch (err) {
      handleError(err)
      return undefined
    } finally {
      isLoading.value = false
    }
  }

  const handleError = (err: unknown): never => {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.error?.message || 'An unexpected error occurred')
    }
    throw new Error('An unexpected error occurred')
  }

  return {
    login,
    register,
    getMe,
    isLoading,
  }
}
