import type { PackageStatus } from '@/components/atoms/StatusBadge'
import type { ActivityItemProps } from '@/components/molecules/ActivityItem'

export interface Package {
  trackingCode: string
  destination: string
  via: string
  client: string
  status: PackageStatus
  date: string
}

export interface SyncStatus {
  pending: number
  lastSync: string
  progress: number
}

export const syncStatus: SyncStatus = {
  pending: 12,
  lastSync: '09h47',
  progress: 72,
}

/** Fil d'activité mocké (à remplacer par un flux temps réel plus tard). */
export const recentActivity: ActivityItemProps[] = [
  { icon: 'bi-check-lg', tone: 'green', text: 'Colis TRA-2026-000001 retiré à Lubumbashi', meta: 'Il y a 23 min · WhatsApp envoyé' },
  { icon: 'bi-chat-dots', tone: 'gold', text: 'Notification WhatsApp · Papa Augustin', meta: 'Il y a 41 min · Lecture confirmée' },
  { icon: 'bi-box-seam', tone: 'blue', text: 'Nouveau colis enregistré · TRA-2026-000021', meta: 'Il y a 1h · Mode hors-ligne' },
  { icon: 'bi-envelope', tone: 'gold', text: 'Récapitulatif email envoyé', meta: 'Hier 18h00 · 75 colis résumés' },
]
