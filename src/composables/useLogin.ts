import { ref } from 'vue'
import type { LoginCredentials, LoginResponse } from '@/types/auth'
import api from '@/api'
import { AxiosError } from 'axios'
export const useLogin = () => {
  const isLoading = ref(false)

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    isLoading.value = true
    try {
      const res = await api.post('/auth/local', credentials)
      return res.data
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data?.error?.message || 'An unexpected error occurred')
      }
      throw new Error('An unexpected error occurred')
    } finally {
      isLoading.value = false
    }
  }

  return {
    login,
    isLoading,
  }
}
