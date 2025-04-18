export type AuthState = {
  user: User | null
  token: string | null
}

export type User = {
  id: number
  documentId: string
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
}

export interface LoginCredentials {
  identifier: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
}

export interface LoginResponse {
  jwt: string
  user: User
}

export interface RegisterResponse {
  jwt: string
  user: User
}
