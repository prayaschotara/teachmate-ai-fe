// Example API service for user-related endpoints

import { privateFetcher } from '../lib/api';
import { useQuery, useMutation } from '@tanstack/react-query';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
}

/**
 * Get user profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  return privateFetcher<UserProfile>('/api/user/profile');
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: UpdateProfileRequest): Promise<UserProfile> {
  return privateFetcher<UserProfile>('/api/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// React Query hooks
export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile,
  });
}

export function useUpdateUserProfile() {
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateUserProfile(data),
  });
}
