// API service for authentication

import { publicFetcher } from '../lib/api';
import { useMutation } from '@tanstack/react-query';

export type UserRole = 'teacher' | 'student' | 'parent';

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    token?: string;
  };
}

/**
 * Login user with email, password, and role
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  return publicFetcher<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role: "teacher" }),
  });
}

/**
 * React Query hook for login mutation
 */
export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: LoginRequest) => login(email, password),
  });
}
