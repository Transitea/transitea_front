/** Données mockées diverses (clients, notifications). */

export interface Client {
  id: string
  name: string
  phone: string
  city: string
  packagesCount: number
}

export const clients: Client[] = [
  { id: 'c1', name: 'Mama Béatrice', phone: '+243 810 000 001', city: 'Lubumbashi', packagesCount: 12 },
  { id: 'c2', name: 'Papa Augustin', phone: '+243 810 000 002', city: 'Mbuji-Mayi', packagesCount: 8 },
  { id: 'c3', name: 'Solange M.', phone: '+243 810 000 003', city: 'Goma', packagesCount: 5 },
  { id: 'c4', name: 'Christian K.', phone: '+243 810 000 004', city: 'Kisangani', packagesCount: 3 },
  { id: 'c5', name: 'Fiston B.', phone: '+243 810 000 005', city: 'Matadi', packagesCount: 17 },
  { id: 'c6', name: 'Grâce N.', phone: '+243 810 000 006', city: 'Kananga', packagesCount: 6 },
]

export interface AppNotification {
  id: string
  icon: string
  tone: 'gold' | 'blue' | 'green'
  title: string
  meta: string
  read: boolean
}

export const notifications: AppNotification[] = [
  { id: 'n1', icon: 'bi-check-lg', tone: 'green', title: 'Colis TST-001 livré à Lubumbashi', meta: 'Il y a 23 min · WhatsApp envoyé', read: false },
  { id: 'n2', icon: 'bi-chat-dots', tone: 'gold', title: 'Notification WhatsApp · Papa Augustin', meta: 'Il y a 41 min · Lecture confirmée', read: false },
  { id: 'n3', icon: 'bi-box-seam', tone: 'blue', title: 'Nouveau colis enregistré · TST-006', meta: 'Il y a 1h · Mode hors-ligne', read: false },
  { id: 'n4', icon: 'bi-envelope', tone: 'gold', title: 'Récapitulatif email envoyé', meta: 'Hier 18h00 · 75 colis résumés', read: true },
  { id: 'n5', icon: 'bi-exclamation-triangle', tone: 'gold', title: 'Incident signalé · TST-004 (Buta)', meta: 'Hier 18h42 · À traiter', read: true },
]
