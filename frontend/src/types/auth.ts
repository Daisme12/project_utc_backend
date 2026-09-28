export interface User{
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: {
    id: number;
    name: string;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}
export interface AuthResponse {
  accessToken: string;
  tokenType?: string;
  user: User;
}
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}