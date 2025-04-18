import axios from 'axios'
import type { LoginResponse } from '@/types/auth'

export const loginUser = async (identifier: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post('/api/auth/local', {
    identifier,
    password,
  })

  return response.data as LoginResponse
}
