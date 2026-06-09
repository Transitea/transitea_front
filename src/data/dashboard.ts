import type { PackageStatus } from '@/components/atoms/StatusBadge'
import type { StatCardProps } from '@/components/molecules/StatCard'
import type { NavItemProps } from '@/components/molecules/NavItem'
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

export const navMain: NavItemProps[] = [
  { icon: 'bi-speedometer2', label: 'Dashboard', active: true },
  { icon: 'bi-box-seam', label: 'Colis', badge: 54 },
  { icon: 'bi-map', label: 'Itinéraires' },
  { icon: 'bi-people', label: 'Clients' },
]

export const navManagement: NavItemProps[] = [
  { icon: 'bi-bell', label: 'Notifications', badge: 3 },
  { icon: 'bi-bar-chart', label: 'Rapports' },
  { icon: 'bi-gear', label: 'Paramètres' },
]

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
  { trackingCode: 'TST-20240510-001', destination: 'Lubumbashi', via: 'via Kolwezi', client: 'Mama Béatrice', status: 'delivered', date: '10/05 · 09h14' },
  { trackingCode: 'TST-20240510-002', destination: 'Mbuji-Mayi', via: 'direct', client: 'Papa Augustin', status: 'transit', date: '10/05 · 08h30' },
  { trackingCode: 'TST-20240510-003', destination: 'Goma', via: 'via Butembo', client: 'Solange M.', status: 'pending', date: '10/05 · 07h55' },
  { trackingCode: 'TST-20240510-004', destination: 'Kisangani', via: 'via Buta', client: 'Christian K.', status: 'issue', date: '09/05 · 18h42' },
  { trackingCode: 'TST-20240510-005', destination: 'Matadi', via: 'via Kenge', client: 'Fiston B.', status: 'delivered', date: '09/05 · 16h10' },
  { trackingCode: 'TST-20240510-006', destination: 'Kananga', via: 'direct', client: 'Grâce N.', status: 'transit', date: '09/05 · 14h27' },
]

export const syncStatus: SyncStatus = {
  pending: 12,
  lastSync: '09h47',
  progress: 72,
}

export const recentActivity: ActivityItemProps[] = [
  { icon: 'bi-check-lg', tone: 'green', text: 'Colis TST-001 livré à Lubumbashi', meta: 'Il y a 23 min · WhatsApp envoyé' },
  { icon: 'bi-chat-dots', tone: 'gold', text: 'Notification WhatsApp · Papa Augustin', meta: 'Il y a 41 min · Lecture confirmée' },
  { icon: 'bi-box-seam', tone: 'blue', text: 'Nouveau colis enregistré · TST-006', meta: 'Il y a 1h · Mode hors-ligne' },
  { icon: 'bi-envelope', tone: 'gold', text: 'Récapitulatif email envoyé', meta: 'Hier 18h00 · 75 colis résumés' },
]
