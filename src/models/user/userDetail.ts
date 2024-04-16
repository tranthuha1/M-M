export interface UserDetail {
  id: number
  username: string
  full_name?: string
  email?: string
  type: number
}

export interface LoginResponse {
  success: boolean
  message: string
  code: number
  data: {
    token: string
    refreshToken: string
    userInfo: UserDetail
    permissions: string[]
  }
}
export interface LogoutResponse {
  success: boolean
  message: string
  code: number
  data: object
}
