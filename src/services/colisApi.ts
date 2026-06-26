import { apiFetch } from './api'
import type { PackageStatus } from '@/components/atoms/StatusBadge'

export interface MiseAJourStatutReponse {
  id: number
  statut: PackageStatus
  ancienStatut: PackageStatus
  localisation: string | null
  commentaire: string | null
  utilisateurId: number
  dateCreation: string
}

export interface ColisReponse {
  id: number
  uuid: string
  codeTracking: string
  transporteurId: number
  transporteurNomComplet: string
  expediteurNom: string
  expediteurTelephone: string | null
  expediteurEmail: string | null
  destinataireNom: string
  destinataireTelephone: string | null
  destinataireEmail: string | null
  destinataireAdresse: string | null
  destinataireVille: string | null
  description: string | null
  poids: number | null
  statutActuel: PackageStatus
  localId: number | null
  version: number
  dateCreation: string
  historique: MiseAJourStatutReponse[]
}

export interface StatistiquesReponse {
  total: number
  parStatut: Partial<Record<PackageStatus, number>>
}

export interface PageReponse<T> {
  contenu: T[]
  pageCourante: number
  totalPages: number
  totalElements: number
  taillePage: number
  dernierePage: boolean
}

export interface CreationColisPayload {
  expediteurNom: string
  expediteurTelephone?: string
  expediteurEmail?: string
  destinataireNom: string
  destinataireTelephone?: string
  destinataireEmail?: string
  destinataireAdresse?: string
  destinataireVille?: string
  description?: string
  poids?: number
  localId?: number
}

export function listerColis(params?: {
  statut?: PackageStatus
  page?: number
  taille?: number
}): Promise<PageReponse<ColisReponse>> {
  const qs = new URLSearchParams()
  if (params?.statut) qs.set('statut', params.statut)
  if (params?.page !== undefined) qs.set('page', String(params.page))
  if (params?.taille !== undefined) qs.set('taille', String(params.taille))
  const query = qs.toString() ? `?${qs}` : ''
  return apiFetch<PageReponse<ColisReponse>>(`/v1/colis${query}`)
}

export function rechercherColis(q: string, page = 0): Promise<PageReponse<ColisReponse>> {
  const qs = new URLSearchParams({ q, page: String(page) })
  return apiFetch<PageReponse<ColisReponse>>(`/v1/colis/recherche?${qs}`)
}

export function obtenirStatistiques(): Promise<StatistiquesReponse> {
  return apiFetch<StatistiquesReponse>('/v1/colis/statistiques')
}

export function obtenirColis(id: number): Promise<ColisReponse> {
  return apiFetch<ColisReponse>(`/v1/colis/${id}`)
}

export function creerColis(payload: CreationColisPayload): Promise<ColisReponse> {
  return apiFetch<ColisReponse>('/v1/colis', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function mettreAJourStatut(
  id: number,
  statut: PackageStatus,
  localisation?: string,
  commentaire?: string,
): Promise<ColisReponse> {
  return apiFetch<ColisReponse>(`/v1/colis/${id}/statut`, {
    method: 'PATCH',
    body: JSON.stringify({ statut, localisation, commentaire }),
  })
}

export function supprimerColis(id: number): Promise<void> {
  return apiFetch<void>(`/v1/colis/${id}`, { method: 'DELETE' })
}
