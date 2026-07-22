const BASE_URL = '/api'

const ACCESS_KEY = 'transitea_access'
const REFRESH_KEY = 'transitea_refresh'

/**
 * navigator.onLine n'est pas fiable sur toutes les configurations (peut
 * rester à true en mode avion selon les adaptateurs réseau) : sans timeout,
 * un appel vers un hôte injoignable peut rester en attente 30-60+ secondes
 * avant que le navigateur n'abandonne, bloquant l'UI et retardant le repli
 * hors-ligne. On borne donc explicitement chaque appel réseau.
 *
 * L'erreur de timeout est un TypeError, comme une vraie panne réseau, pour
 * rester compatible avec estErreurReseau() sans changer les appelants.
 */
const TIMEOUT_MS = 8000

async function fetchAvecTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new TypeError('Failed to fetch (timeout)', { cause: err })
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

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

  const res = await fetchAvecTimeout(`${BASE_URL}/v1/auth/refresh`, {
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
    fetchAvecTimeout(`${BASE_URL}${path}`, {
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

/** Comme apiFetch, mais pour les réponses binaires (ex. QR code PNG). Renvoie une object URL. */
export async function apiFetchBlobUrl(path: string, init: RequestInit = {}): Promise<string> {
  let token = getAccessToken()

  const doFetch = (t: string | null) =>
    fetchAvecTimeout(`${BASE_URL}${path}`, {
      ...init,
      headers: {
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
    throw new Error(`Erreur ${res.status}`)
  }

  const blob = await res.blob()
  return URL.createObjectURL(blob)
}
