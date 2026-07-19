import { apiFetch } from './api'

export interface AgenceReponse {
  id: number
  uuid: string
  nom: string
  ville: string
  adresse: string | null
  enseigneId: number
  dateCreation: string
}

export interface CreationAgencePayload {
  nom: string
  ville: string
  adresse?: string
}

export function listerAgences(): Promise<AgenceReponse[]> {
  return apiFetch<AgenceReponse[]>('/v1/agences')
}

export function obtenirAgence(id: number): Promise<AgenceReponse> {
  return apiFetch<AgenceReponse>(`/v1/agences/${id}`)
}

/** Réservé aux administrateurs d'enseigne (rôle ADMIN). */
export function creerAgence(payload: CreationAgencePayload): Promise<AgenceReponse> {
  return apiFetch<AgenceReponse>('/v1/agences', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
