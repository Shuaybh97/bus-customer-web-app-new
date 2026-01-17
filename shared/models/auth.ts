// Shared types between frontend and backend

export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at?: string;
}

export interface Token {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}
