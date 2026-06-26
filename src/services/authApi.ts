import { apiFetch } from './api'

export interface UtilisateurReponse {
  id: number
  uuid: string
  nom: string
  prenom: string
  email: string
  telephone: string
  role: string
  statut: string
}

export interface AuthReponse {
  accessToken: string
  refreshToken: string
  typeToken: string
  expirationAccessMs: number
  utilisateur: UtilisateurReponse
}

export function login(email: string, motDePasse: string): Promise<AuthReponse> {
  return apiFetch<AuthReponse>('/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, motDePasse }),
  })
}

export function logout(refreshToken: string): Promise<void> {
  return apiFetch<void>('/v1/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  })
}

export function getProfile(): Promise<UtilisateurReponse> {
  return apiFetch<UtilisateurReponse>('/v1/auth/me')
}
