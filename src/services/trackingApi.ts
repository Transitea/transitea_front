import { apiFetch } from './api'
import type { PackageStatus } from '@/components/atoms/StatusBadge'
import type { MiseAJourStatutReponse } from './colisApi'

export interface SuiviPublicReponse {
  codeTracking: string
  expediteurNom: string
  destinataireNom: string
  destinataireVille: string | null
  description: string | null
  poids: number | null
  statutActuel: PackageStatus
  dateCreation: string
  historique: MiseAJourStatutReponse[]
}

/** Suivi public d'un colis par son code de suivi — aucune authentification requise. */
export function suivreColis(codeTracking: string): Promise<SuiviPublicReponse> {
  return apiFetch<SuiviPublicReponse>(`/v1/tracking/${encodeURIComponent(codeTracking)}`)
}
