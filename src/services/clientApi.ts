import { apiFetch } from './api'
import type { PageReponse } from './colisApi'

export interface ClientReponse {
  nom: string
  telephone: string | null
  ville: string | null
  nombreColis: number
}

/**
 * Aucune entité Client dédiée n'existe côté backend (pas prévue au CDC) :
 * la liste est agrégée depuis les destinataires des colis.
 */
export function listerClients(params?: { page?: number; taille?: number }): Promise<PageReponse<ClientReponse>> {
  const qs = new URLSearchParams()
  if (params?.page !== undefined) qs.set('page', String(params.page))
  if (params?.taille !== undefined) qs.set('taille', String(params.taille))
  const query = qs.toString() ? `?${qs}` : ''
  return apiFetch<PageReponse<ClientReponse>>(`/v1/clients${query}`)
}
