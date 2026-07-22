import { apiFetch, apiFetchBlobUrl } from './api'
import type { PackageStatus } from '@/components/atoms/StatusBadge'

export interface MiseAJourStatutReponse {
  id: number
  statut: PackageStatus
  ancienStatut: PackageStatus | null
  localisation: string | null
  commentaire: string | null
  utilisateurId: number
  dateCreation: string
}

export interface ColisReponse {
  id: number
  uuid: string
  codeTracking: string
  agenceOrigineId: number
  agenceOrigineNom: string
  agenceRetraitId: number
  agenceRetraitNom: string
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

export interface VolumeJourReponse {
  date: string
  total: number
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
  agenceOrigineId: number
  agenceRetraitId: number
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

/** Volume de colis par jour sur une période (dates au format YYYY-MM-DD), pour les graphiques de rapports. */
export function obtenirVolumeQuotidien(debut: string, fin: string): Promise<VolumeJourReponse[]> {
  const qs = new URLSearchParams({ debut, fin })
  return apiFetch<VolumeJourReponse[]>(`/v1/colis/volume-quotidien?${qs}`)
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

/** Retrait sécurisé : valide le scan du QR code présenté par le destinataire à l'agence. */
export function retirerColis(codeTracking: string): Promise<ColisReponse> {
  const qs = new URLSearchParams({ codeTracking })
  return apiFetch<ColisReponse>(`/v1/colis/retrait?${qs}`, { method: 'POST' })
}

/** Récupère le QR code (PNG) du colis, authentifié, sous forme d'object URL affichable dans une <img>. */
export function obtenirQrCodeUrl(id: number): Promise<string> {
  return apiFetchBlobUrl(`/v1/colis/${id}/qrcode`)
}

/** Export CSV des colis sur une période (dates au format YYYY-MM-DD) — retourne une object URL téléchargeable. */
export function exporterColisCsvUrl(debut: string, fin: string): Promise<string> {
  const qs = new URLSearchParams({ debut, fin })
  return apiFetchBlobUrl(`/v1/export/colis?${qs}`)
}

export function supprimerColis(id: number): Promise<void> {
  return apiFetch<void>(`/v1/colis/${id}`, { method: 'DELETE' })
}

// --- Synchronisation hors-ligne (upload / download) ---

export interface MiseAJourStatutSyncItemPayload {
  colisId?: number
  localId?: number
  nouveauStatut: PackageStatus
  commentaire?: string
  baseVersion?: number
  dateChangementClient: string
}

export interface SyncUploadPayload {
  colis: CreationColisPayload[]
  misesAJourStatut: MiseAJourStatutSyncItemPayload[]
}

export interface ResultatSyncColisReponse {
  localId: number | null
  codeTracking: string | null
  succes: boolean
  doublon: boolean
  erreur: string | null
}

export interface ResultatSyncStatutReponse {
  colisId: number | null
  localId: number | null
  codeTracking: string | null
  succes: boolean
  conflit: boolean
  statutApplique: PackageStatus | null
  erreur: string | null
}

export interface SyncUploadResponse {
  nbColisEnvoyes: number
  nbColisReussis: number
  nbColisDoublons: number
  nbColisEchecs: number
  colisResultats: ResultatSyncColisReponse[]
  nbStatutsEnvoyes: number
  nbStatutsReussis: number
  nbStatutsConflits: number
  nbStatutsEchecs: number
  statutResultats: ResultatSyncStatutReponse[]
}

export interface SyncDownloadResponse {
  colis: ColisReponse[]
  curseur: string
}

export function syncUpload(payload: SyncUploadPayload): Promise<SyncUploadResponse> {
  return apiFetch<SyncUploadResponse>('/v1/sync/upload', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/** since au format ISO-8601 sans timezone (ex. 2026-06-15T09:30:00). */
export function syncDownload(since: string): Promise<SyncDownloadResponse> {
  const qs = new URLSearchParams({ since })
  return apiFetch<SyncDownloadResponse>(`/v1/sync/download?${qs}`)
}
