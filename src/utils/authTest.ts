// Utility to test cookie-based authentication

import { setAuthToken, clearAuthToken } from '../lib/api';
import { getCookie, hasCookie } from '../lib/cookies';

/**
 * Test cookie authentication implementation
 */
export function testCookieAuth() {
    console.group('🔐 Cookie Authentication Test');

    // Test 1: Set token
    console.log('1️⃣ Setting auth token...');
    setAuthToken('test-jwt-token-12345');
    const token = getCookie('auth_token');
    console.log('   Token set:', token === 'test-jwt-token-12345' ? '✅' : '❌');
    console.log('   Token value:', token);

    // Test 2: Check token exists
    console.log('\n2️⃣ Checking token exists...');
    const exists = hasCookie('auth_token');
    console.log('   Token exists:', exists ? '✅' : '❌');

    // Test 3: Clear token
    console.log('\n3️⃣ Clearing auth token...');
    clearAuthToken();
    const clearedToken = getCookie('auth_token');
    console.log('   Token cleared:', clearedToken === null ? '✅' : '❌');
    console.log('   Token value:', clearedToken);

    // Test 4: Verify token doesn't exist
    console.log('\n4️⃣ Verifying token removed...');
    const stillExists = hasCookie('auth_token');
    console.log('   Token removed:', !stillExists ? '✅' : '❌');

    console.groupEnd();

    return {
        setToken: token === 'test-jwt-token-12345',
        tokenExists: exists,
        clearToken: clearedToken === null,
        tokenRemoved: !stillExists,
    };
}

/**
 * Display current auth state
 */
export function showAuthState() {
    console.group('📊 Current Auth State');

    // Check cookie
    const token = getCookie('auth_token');
    console.log('Cookie (auth_token):', token ? '✅ Present' : '❌ Not found');
    if (token) {
        console.log('  Value:', token.substring(0, 20) + '...');
    }

    // Check localStorage
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
        try {
            const parsed = JSON.parse(authStorage);
            console.log('\nLocalStorage (auth-storage):', '✅ Present');
            console.log('  User:', parsed.state?.user?.email || 'Not logged in');
            console.log('  Authenticated:', parsed.state?.isAuthenticated || false);
            console.log('  Token in localStorage:', parsed.state?.token ? '❌ FOUND (should not be here!)' : '✅ Not present (correct)');
        } catch {
            console.log('\nLocalStorage (auth-storage):', '❌ Parse error');
        }
    } else {
        console.log('\nLocalStorage (auth-storage):', '❌ Not found');
    }

    console.groupEnd();
}

// Make functions available in browser console
if (typeof window !== 'undefined') {
    (window as unknown as { testCookieAuth: typeof testCookieAuth; showAuthState: typeof showAuthState }).testCookieAuth = testCookieAuth;
    (window as unknown as { testCookieAuth: typeof testCookieAuth; showAuthState: typeof showAuthState }).showAuthState = showAuthState;
}
