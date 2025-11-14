import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login } from '../services/authApi';
import { setAuthToken, clearAuthToken } from '../lib/api';

interface Class {
  _id: string;
  class_name: string;
  class_strength: number;
  grade_id: string;
  grade_name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student' | 'parent';
  classes?: Class[];
}

interface ApiUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  classes?: Class[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User, token?: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const response = await login(email, password);

          if (response.success && response.data?.user) {
            const apiUser = response.data.user as ApiUser;
            const user: User = {
              id: apiUser._id || apiUser.id || '',
              name: apiUser.name,
              email: apiUser.email,
              classes: apiUser.classes || [],
              role: apiUser.role as User['role'],
            };

            // Store token in cookies
            if (response.data.token) {
              setAuthToken(response.data.token);
            }

            set({
              user,
              isAuthenticated: true,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },
      logout: () => {
        // Remove token from cookies
        clearAuthToken();
        set({ user: null, isAuthenticated: false });
      },
      setUser: (user: User, token?: string) => {
        // Store token in cookies if provided
        if (token) {
          setAuthToken(token);
        }
        set({ user, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user data, not token (token is in cookies)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);