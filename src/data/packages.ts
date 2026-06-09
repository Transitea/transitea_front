import type { Package } from '@/data/dashboard'
import type { PackageStatus } from '@/components/atoms/StatusBadge'

export interface TrackingStep {
  label: string
  location: string
  date: string
  done: boolean
}

export interface PackageDetail extends Package {
  sender: string
  phone: string
  weightKg: number
  price: string
  steps: TrackingStep[]
}

/** Jeu de données mocké complet (à remplacer par l'API plus tard). */
export const allPackages: PackageDetail[] = [
  {
    trackingCode: 'TST-20240510-001', destination: 'Lubumbashi', via: 'via Kolwezi',
    client: 'Mama Béatrice', status: 'delivered', date: '10/05 · 09h14',
    sender: 'Kin Express', phone: '+243 810 000 001', weightKg: 4.2, price: '45 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '08/05 · 10h00', done: true },
      { label: 'En transit', location: 'Kolwezi', date: '09/05 · 14h00', done: true },
      { label: 'Arrivé au point relais', location: 'Lubumbashi', date: '10/05 · 08h30', done: true },
      { label: 'Livré', location: 'Lubumbashi', date: '10/05 · 09h14', done: true },
    ],
  },
  {
    trackingCode: 'TST-20240510-002', destination: 'Mbuji-Mayi', via: 'direct',
    client: 'Papa Augustin', status: 'transit', date: '10/05 · 08h30',
    sender: 'Kin Express', phone: '+243 810 000 002', weightKg: 1.8, price: '22 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '09/05 · 16h00', done: true },
      { label: 'En transit', location: 'En route', date: '10/05 · 08h30', done: true },
      { label: 'Arrivé au point relais', location: 'Mbuji-Mayi', date: '—', done: false },
      { label: 'Livré', location: 'Mbuji-Mayi', date: '—', done: false },
    ],
  },
  {
    trackingCode: 'TST-20240510-003', destination: 'Goma', via: 'via Butembo',
    client: 'Solange M.', status: 'pending', date: '10/05 · 07h55',
    sender: 'Kivu Cargo', phone: '+243 810 000 003', weightKg: 7.0, price: '78 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '10/05 · 07h55', done: true },
      { label: 'En transit', location: '—', date: '—', done: false },
      { label: 'Arrivé au point relais', location: 'Goma', date: '—', done: false },
      { label: 'Livré', location: 'Goma', date: '—', done: false },
    ],
  },
  {
    trackingCode: 'TST-20240510-004', destination: 'Kisangani', via: 'via Buta',
    client: 'Christian K.', status: 'issue', date: '09/05 · 18h42',
    sender: 'Fleuve Logistics', phone: '+243 810 000 004', weightKg: 3.5, price: '52 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '08/05 · 09h00', done: true },
      { label: 'En transit', location: 'Buta', date: '09/05 · 12h00', done: true },
      { label: 'Incident signalé', location: 'Buta', date: '09/05 · 18h42', done: true },
      { label: 'Livré', location: 'Kisangani', date: '—', done: false },
    ],
  },
  {
    trackingCode: 'TST-20240510-005', destination: 'Matadi', via: 'via Kenge',
    client: 'Fiston B.', status: 'delivered', date: '09/05 · 16h10',
    sender: 'Kin Express', phone: '+243 810 000 005', weightKg: 2.1, price: '18 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '08/05 · 08h00', done: true },
      { label: 'En transit', location: 'Kenge', date: '08/05 · 15h00', done: true },
      { label: 'Arrivé au point relais', location: 'Matadi', date: '09/05 · 14h00', done: true },
      { label: 'Livré', location: 'Matadi', date: '09/05 · 16h10', done: true },
    ],
  },
  {
    trackingCode: 'TST-20240510-006', destination: 'Kananga', via: 'direct',
    client: 'Grâce N.', status: 'transit', date: '09/05 · 14h27',
    sender: 'Kasaï Trans', phone: '+243 810 000 006', weightKg: 5.6, price: '63 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '09/05 · 10h00', done: true },
      { label: 'En transit', location: 'En route', date: '09/05 · 14h27', done: true },
      { label: 'Arrivé au point relais', location: 'Kananga', date: '—', done: false },
      { label: 'Livré', location: 'Kananga', date: '—', done: false },
    ],
  },
  {
    trackingCode: 'TST-20240509-014', destination: 'Bukavu', via: 'via Goma',
    client: 'Esther L.', status: 'delivered', date: '09/05 · 11h05',
    sender: 'Kivu Cargo', phone: '+243 810 000 014', weightKg: 1.2, price: '15 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '07/05 · 09h00', done: true },
      { label: 'Livré', location: 'Bukavu', date: '09/05 · 11h05', done: true },
    ],
  },
  {
    trackingCode: 'TST-20240509-021', destination: 'Tshikapa', via: 'direct',
    client: 'Patrick M.', status: 'pending', date: '09/05 · 09h40',
    sender: 'Kasaï Trans', phone: '+243 810 000 021', weightKg: 9.4, price: '95 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '09/05 · 09h40', done: true },
      { label: 'En transit', location: '—', date: '—', done: false },
    ],
  },
]

export function getPackageById(trackingCode: string): PackageDetail | undefined {
  return allPackages.find((p) => p.trackingCode === trackingCode)
}

export const statusFilters: { value: PackageStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'transit', label: 'En transit' },
  { value: 'delivered', label: 'Livré' },
  { value: 'issue', label: 'Problème' },
]
