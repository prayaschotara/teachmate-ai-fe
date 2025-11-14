// Common API fetcher with public and private endpoints

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface FetcherOptions extends RequestInit {
  token?: string;
}

class ApiError extends Error {
  status: number;
  statusText: string;
  data?: unknown;

  constructor(status: number, statusText: string, data?: unknown) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

/**
 * Common fetcher for public API endpoints (no authentication required)
 */
export async function publicFetcher<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Common fetcher for private API endpoints (requires authentication)
 */
export async function privateFetcher<T>(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;
  
  // Get token from localStorage if not provided
  const authToken = token || getAuthToken();
  
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    
    // Handle unauthorized - clear auth and redirect to login
    if (response.status === 401) {
      clearAuthToken();
      window.location.href = '/login';
    }
    
    throw new ApiError(response.status, response.statusText, errorData);
  }

  return response.json();
}

/**
 * Helper to get cookie value by name
 */
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

/**
 * Helper to set cookie
 */
function setCookie(name: string, value: string, days: number = 7): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

/**
 * Helper to delete cookie
 */
function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Helper to get auth token from cookies
 */
function getAuthToken(): string | null {
  return getCookie('auth_token');
}

/**
 * Helper to clear auth token from cookies
 */
export function clearAuthToken(): void {
  deleteCookie('auth_token');
}

/**
 * Helper to set auth token in cookies
 */
export function setAuthToken(token: string, days: number = 7): void {
  setCookie('auth_token', token, days);
}

export { ApiError };
