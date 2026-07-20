import { apiFetch } from './api'

export type PalierAbonnement = 'STARTER' | 'STANDARD' | 'PREMIUM' | 'ENTREPRISE'
export type StatutEnseigne = 'ACTIF' | 'SUSPENDU' | 'RESILIE'

export interface EnseigneReponse {
  id: number
  nom: string
  palierAbonnement: PalierAbonnement
  quotaColisMois: number
  colisMoisCourant: number
  pourcentageConsomme: number
  statut: StatutEnseigne
}

export const PALIER_LABELS: Record<PalierAbonnement, string> = {
  STARTER: 'Starter',
  STANDARD: 'Standard',
  PREMIUM: 'Premium',
  ENTREPRISE: 'Entreprise',
}

/** Réservé aux administrateurs d'enseigne (rôle ADMIN). */
export function obtenirEnseigne(): Promise<EnseigneReponse> {
  return apiFetch<EnseigneReponse>('/v1/enseigne')
}
