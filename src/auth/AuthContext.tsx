import { createContext, useContext, useState, type ReactNode } from 'react'
import { saveTokens, clearTokens } from '@/services/api'
import type { UtilisateurReponse } from '@/services/authApi'
import { logout as apiLogout } from '@/services/authApi'

const USER_KEY = 'transitea_user'
const REFRESH_KEY = 'transitea_refresh'

interface AuthContextValue {
  isAuthenticated: boolean
  user: UtilisateurReponse | null
  login: (accessToken: string, refreshToken: string, user: UtilisateurReponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UtilisateurReponse | null>(() => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as UtilisateurReponse) : null
  })

  const login = (accessToken: string, refreshToken: string, utilisateur: UtilisateurReponse) => {
    saveTokens(accessToken, refreshToken)
    localStorage.setItem(USER_KEY, JSON.stringify(utilisateur))
    setUser(utilisateur)
  }

  const logout = () => {
    const refreshToken = localStorage.getItem(REFRESH_KEY)
    if (refreshToken) {
      apiLogout(refreshToken).catch(() => { /* ignore */ })
    }
    clearTokens()
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: Boolean(user), user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans un <AuthProvider>')
  return ctx
}
