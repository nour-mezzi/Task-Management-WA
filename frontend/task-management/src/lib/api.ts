// utils/api.ts

/**
 * Retrieves the Authorization header with the JWT token from localStorage.
 * Returns an object you can spread into your fetch headers.
 */
export function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') {
    // Running on server (SSR), no access to localStorage
    return {}
  }

  const token = localStorage.getItem('token')

  if (!token) return {}

  return {
    Authorization: `Bearer ${token}`,
  }
}
