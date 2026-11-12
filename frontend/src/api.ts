import type { Json, Me, Order, Product, User } from './types'

const SAFE_METHODS =['GET', 'HEAD', 'OPTIONS', 'TRACE']

export const getCookie = (name: string): string | undefined =>
  document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1]

export const ensureCsrfCookie = async (): Promise<string | undefined> => {
  if (!getCookie('csrftoken')) await fetch('/api/csrf/')
  return getCookie('csrftoken')
}

export const apiRequest = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const method = (init.method ?? 'GET').toUpperCase()
  const csrfToken = SAFE_METHODS.includes(method)
    ? undefined
    : await ensureCsrfCookie()

  const res = await fetch(`/api/${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
      ...init.headers,
    },
  })
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`
    try {
      // DRF errors are JSON: { detail: '...' } or { field: ['msg', ...] }
      const data = JSON.parse(await res.text())
      message =
        data.detail ??
        Object.entries(data)
          .map(([field, msgs]) => `${field}: ${msgs}`)
          .join('\n')
    } catch {
      // not JSON (e.g. Django's HTML error page): keep the status line
    }
    throw new Error(message)
  }
  return (res.status === 204 ? undefined : await res.json()) as T
}

export const register = (email: string, password: string) =>
  apiRequest<User>('register/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const login = (email: string, password: string) =>
  apiRequest<User>('login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const logout = () => apiRequest<void>('logout/', { method: 'POST' })

// Rejects (403) when not logged in
export const getMe = () => apiRequest<Me>('me/')

export const getProducts = () => apiRequest<Product[]>('products/')

export const cancelOrder = (orderId: string) =>
  apiRequest<void>(`orders/${orderId}/`, { method: 'DELETE' })

export const placeOrder =(contents: Json) =>
  apiRequest<Order>('orders/', {
    method: 'POST',
    body: JSON.stringify({ contents }),
  })
