import type { PackageStatus } from '@/components/atoms/StatusBadge'
import type { StatCardProps } from '@/components/molecules/StatCard'
import type { ActivityItemProps } from '@/components/molecules/ActivityItem'

/**
 * Données mockées du dashboard.
 * À remplacer par des appels API plus tard (même forme de types).
 */

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

export const currentUser = {
  initials: 'JM',
  name: 'Jean-Marie K.',
  role: 'Transporteur',
}

export const stats: StatCardProps[] = [
  {
    icon: 'bi-box-seam',
    tone: 'blue',
    label: "Total colis aujourd'hui",
    value: 87,
    delta: '+12 vs hier',
  },
  { icon: 'bi-truck', tone: 'gold', label: 'En transit', value: 34, delta: 'En cours' },
  { icon: 'bi-check-circle', tone: 'green', label: 'Livrés', value: 48, delta: '+8 vs hier' },
  {
    icon: 'bi-exclamation-triangle',
    tone: 'red',
    label: 'Problèmes',
    value: 5,
    delta: '+2 à traiter',
    deltaDirection: 'down',
  },
]

export const recentPackages: Package[] = [
  { trackingCode: 'TRA-2024-000001', destination: 'Lubumbashi', via: 'via Kolwezi', client: 'Mama Béatrice', status: 'LIVRE', date: '10/05 · 09h14' },
  { trackingCode: 'TRA-2024-000002', destination: 'Mbuji-Mayi', via: 'direct', client: 'Papa Augustin', status: 'EN_TRANSIT', date: '10/05 · 08h30' },
  { trackingCode: 'TRA-2024-000003', destination: 'Goma', via: 'via Butembo', client: 'Solange M.', status: 'ENREGISTRE', date: '10/05 · 07h55' },
  { trackingCode: 'TRA-2024-000004', destination: 'Kisangani', via: 'via Buta', client: 'Christian K.', status: 'REFUSE', date: '09/05 · 18h42' },
  { trackingCode: 'TRA-2024-000006', destination: 'Kananga', via: 'direct', client: 'Grâce N.', status: 'EN_LIVRAISON', date: '09/05 · 14h27' },
  { trackingCode: 'TRA-2024-000021', destination: 'Tshikapa', via: 'direct', client: 'Patrick M.', status: 'PRIS_EN_CHARGE', date: '09/05 · 09h40' },
]

export const syncStatus: SyncStatus = {
  pending: 12,
  lastSync: '09h47',
  progress: 72,
}

export const recentActivity: ActivityItemProps[] = [
  { icon: 'bi-check-lg', tone: 'green', text: 'Colis TRA-2024-000001 livré à Lubumbashi', meta: 'Il y a 23 min · WhatsApp envoyé' },
  { icon: 'bi-chat-dots', tone: 'gold', text: 'Notification WhatsApp · Papa Augustin', meta: 'Il y a 41 min · Lecture confirmée' },
  { icon: 'bi-box-seam', tone: 'blue', text: 'Nouveau colis enregistré · TRA-2024-000021', meta: 'Il y a 1h · Mode hors-ligne' },
  { icon: 'bi-envelope', tone: 'gold', text: 'Récapitulatif email envoyé', meta: 'Hier 18h00 · 75 colis résumés' },
]
