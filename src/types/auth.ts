export interface UserCreate {
  email: string
  full_name: string
  password: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface LoginResponse {
  email: string
  name: string
}

export interface MessageResponse {
  message: string
}

export interface User {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}
