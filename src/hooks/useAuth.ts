// Custom hook for authentication with React Query

import { useLogin, type UserRole } from '../services/authApi';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useAuth() {
  const { mutate: loginMutation, isPending } = useLogin();
  const { setUser, logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();

  const login = (email: string, password: string, role: UserRole) => {
    loginMutation(
      { email, password, role },
      {
        onSuccess: (data) => {
          if (data.success && data.data?.user) {
            setUser(
              {
                id: data.data.user.id,
                name: data.data.user.name,
                email: data.data.user.email,
                role: data.data.user.role as 'teacher' | 'student' | 'parent',
              },
              data.data.token
            );
            toast.success('Welcome back!');
            navigate('/dashboard');
          } else {
            toast.error('Invalid email or password');
          }
        },
        onError: (error) => {
          console.error('Login error:', error);
          toast.error('Login failed. Please try again.');
        },
      }
    );
  };

  const logout = () => {
    logoutStore();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return {
    login,
    logout,
    isLoading: isPending,
  };
}
