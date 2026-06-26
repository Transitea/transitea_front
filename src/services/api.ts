const BASE_URL = '/api'

const ACCESS_KEY = 'transitea_access'
const REFRESH_KEY = 'transitea_refresh'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY)
}

export function saveTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access)
  localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(REFRESH_KEY)
  if (!refreshToken) return null

  const res = await fetch(`${BASE_URL}/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  if (!res.ok) {
    clearTokens()
    return null
  }
  const data = await res.json()
  saveTokens(data.accessToken, data.refreshToken)
  return data.accessToken
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let token = getAccessToken()

  const doFetch = (t: string | null) =>
    fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
        ...(init.headers as Record<string, string> | undefined),
      },
    })

  let res = await doFetch(token)

  if (res.status === 401 && token) {
    token = await refreshAccessToken()
    if (token) {
      res = await doFetch(token)
    }
  }

  if (!res.ok) {
    let message = `Erreur ${res.status}`
    try {
      const err = await res.json()
      message = err.message ?? err.erreur ?? message
    } catch { /* ignore */ }
    throw new Error(message)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
