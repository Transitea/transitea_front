import { apiFetch } from './api'
import type { PageReponse } from './colisApi'
import type { Role } from './authApi'

export type StatutUtilisateur = 'ACTIF' | 'INACTIF'

export interface UtilisateurReponse {
  id: number
  uuid: string
  nom: string
  prenom: string
  email: string
  telephone: string | null
  role: Role
  statut: StatutUtilisateur
  agenceId: number | null
  agenceNom: string | null
  dateCreation: string
}

export interface CreationUtilisateurPayload {
  nom: string
  prenom: string
  email: string
  telephone?: string
  motDePasse: string
  role: 'OPERATEUR' | 'AGENT'
  agenceId: number
}

export function listerUtilisateurs(params?: {
  agenceId?: number
  page?: number
  taille?: number
}): Promise<PageReponse<UtilisateurReponse>> {
  const qs = new URLSearchParams()
  if (params?.agenceId !== undefined) qs.set('agenceId', String(params.agenceId))
  if (params?.page !== undefined) qs.set('page', String(params.page))
  if (params?.taille !== undefined) qs.set('taille', String(params.taille))
  const query = qs.toString() ? `?${qs}` : ''
  return apiFetch<PageReponse<UtilisateurReponse>>(`/v1/utilisateurs${query}`)
}

/** Réservé aux administrateurs d'enseigne (rôle ADMIN) — refuse la création d'un compte ADMIN. */
export function creerUtilisateur(payload: CreationUtilisateurPayload): Promise<UtilisateurReponse> {
  return apiFetch<UtilisateurReponse>('/v1/utilisateurs', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function mettreAJourStatutUtilisateur(
  id: number,
  statut: StatutUtilisateur,
): Promise<UtilisateurReponse> {
  return apiFetch<UtilisateurReponse>(`/v1/utilisateurs/${id}/statut`, {
    method: 'PATCH',
    body: JSON.stringify({ statut }),
  })
}
