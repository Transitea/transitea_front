import { apiFetch } from './api'
import type { PageReponse } from './colisApi'

export type CibleNotification = 'DESTINATAIRE' | 'EXPEDITEUR'
export type TypeCanal = 'WHATSAPP' | 'EMAIL'
export type StatutNotification = 'EN_ATTENTE' | 'ENVOYE' | 'ECHEC'

export interface NotificationReponse {
  id: number
  colisId: number
  codeTracking: string
  destinataireContact: string
  cible: CibleNotification
  typeCanal: TypeCanal
  message: string
  statut: StatutNotification
  nbTentatives: number
  dateCreation: string
}

export function listerNotifications(params?: {
  page?: number
  taille?: number
}): Promise<PageReponse<NotificationReponse>> {
  const qs = new URLSearchParams()
  if (params?.page !== undefined) qs.set('page', String(params.page))
  if (params?.taille !== undefined) qs.set('taille', String(params.taille))
  const query = qs.toString() ? `?${qs}` : ''
  return apiFetch<PageReponse<NotificationReponse>>(`/v1/notifications${query}`)
}
