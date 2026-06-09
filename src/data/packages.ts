import type { Package } from '@/data/dashboard'
import { type PackageStatus, STATUS_META, STATUS_ORDER } from '@/components/atoms/StatusBadge'

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
    trackingCode: 'TRA-2024-000001', destination: 'Lubumbashi', via: 'via Kolwezi',
    client: 'Mama Béatrice', status: 'LIVRE', date: '10/05 · 09h14',
    sender: 'Kin Express', phone: '+243 810 000 001', weightKg: 4.2, price: '45 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '08/05 · 10h00', done: true },
      { label: 'En transit', location: 'Kolwezi', date: '09/05 · 14h00', done: true },
      { label: 'Arrivé au dépôt', location: 'Lubumbashi', date: '10/05 · 08h30', done: true },
      { label: 'Livré', location: 'Lubumbashi', date: '10/05 · 09h14', done: true },
    ],
  },
  {
    trackingCode: 'TRA-2024-000002', destination: 'Mbuji-Mayi', via: 'direct',
    client: 'Papa Augustin', status: 'EN_TRANSIT', date: '10/05 · 08h30',
    sender: 'Kin Express', phone: '+243 810 000 002', weightKg: 1.8, price: '22 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '09/05 · 16h00', done: true },
      { label: 'Pris en charge', location: 'Kinshasa', date: '10/05 · 07h00', done: true },
      { label: 'En transit', location: 'En route', date: '10/05 · 08h30', done: true },
      { label: 'Arrivé au dépôt', location: 'Mbuji-Mayi', date: '—', done: false },
      { label: 'Livré', location: 'Mbuji-Mayi', date: '—', done: false },
    ],
  },
  {
    trackingCode: 'TRA-2024-000003', destination: 'Goma', via: 'via Butembo',
    client: 'Solange M.', status: 'ENREGISTRE', date: '10/05 · 07h55',
    sender: 'Kivu Cargo', phone: '+243 810 000 003', weightKg: 7.0, price: '78 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '10/05 · 07h55', done: true },
      { label: 'Pris en charge', location: '—', date: '—', done: false },
      { label: 'En transit', location: '—', date: '—', done: false },
      { label: 'Livré', location: 'Goma', date: '—', done: false },
    ],
  },
  {
    trackingCode: 'TRA-2024-000004', destination: 'Kisangani', via: 'via Buta',
    client: 'Christian K.', status: 'REFUSE', date: '09/05 · 18h42',
    sender: 'Fleuve Logistics', phone: '+243 810 000 004', weightKg: 3.5, price: '52 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '08/05 · 09h00', done: true },
      { label: 'En transit', location: 'Buta', date: '09/05 · 12h00', done: true },
      { label: 'En livraison', location: 'Kisangani', date: '09/05 · 17h00', done: true },
      { label: 'Refusé par le destinataire', location: 'Kisangani', date: '09/05 · 18h42', done: true },
    ],
  },
  {
    trackingCode: 'TRA-2024-000005', destination: 'Matadi', via: 'via Kenge',
    client: 'Fiston B.', status: 'RETOUR_EXPEDITEUR', date: '09/05 · 16h10',
    sender: 'Kin Express', phone: '+243 810 000 005', weightKg: 2.1, price: '18 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '08/05 · 08h00', done: true },
      { label: 'En transit', location: 'Kenge', date: '08/05 · 15h00', done: true },
      { label: 'Refusé par le destinataire', location: 'Matadi', date: '09/05 · 14h00', done: true },
      { label: 'Retour expéditeur', location: 'Kinshasa', date: '09/05 · 16h10', done: true },
    ],
  },
  {
    trackingCode: 'TRA-2024-000006', destination: 'Kananga', via: 'direct',
    client: 'Grâce N.', status: 'EN_LIVRAISON', date: '09/05 · 14h27',
    sender: 'Kasaï Trans', phone: '+243 810 000 006', weightKg: 5.6, price: '63 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '09/05 · 10h00', done: true },
      { label: 'En transit', location: 'En route', date: '09/05 · 12h00', done: true },
      { label: 'Arrivé au dépôt', location: 'Kananga', date: '09/05 · 14h00', done: true },
      { label: 'En livraison', location: 'Kananga', date: '09/05 · 14h27', done: true },
    ],
  },
  {
    trackingCode: 'TRA-2024-000014', destination: 'Bukavu', via: 'via Goma',
    client: 'Esther L.', status: 'ARRIVE_DEPOT', date: '09/05 · 11h05',
    sender: 'Kivu Cargo', phone: '+243 810 000 014', weightKg: 1.2, price: '15 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '07/05 · 09h00', done: true },
      { label: 'En transit', location: 'Goma', date: '08/05 · 16h00', done: true },
      { label: 'Arrivé au dépôt', location: 'Bukavu', date: '09/05 · 11h05', done: true },
      { label: 'Livré', location: 'Bukavu', date: '—', done: false },
    ],
  },
  {
    trackingCode: 'TRA-2024-000021', destination: 'Tshikapa', via: 'direct',
    client: 'Patrick M.', status: 'PRIS_EN_CHARGE', date: '09/05 · 09h40',
    sender: 'Kasaï Trans', phone: '+243 810 000 021', weightKg: 9.4, price: '95 000 FC',
    steps: [
      { label: 'Colis enregistré', location: 'Kinshasa', date: '09/05 · 08h00', done: true },
      { label: 'Pris en charge', location: 'Kinshasa', date: '09/05 · 09h40', done: true },
      { label: 'En transit', location: '—', date: '—', done: false },
    ],
  },
]

export function getPackageById(trackingCode: string): PackageDetail | undefined {
  return allPackages.find((p) => p.trackingCode === trackingCode)
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Horodatage court façon "10/05 · 14h30". */
function nowLabel(): string {
  const d = new Date()
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} · ${pad(d.getHours())}h${pad(d.getMinutes())}`
}

/**
 * Met à jour le statut d'un colis (mutation en mémoire — à remplacer par l'API/file de
 * synchro hors-ligne plus tard). Ajoute une étape horodatée à l'historique.
 */
export function updatePackageStatus(
  trackingCode: string,
  status: PackageStatus,
  comment?: string,
): PackageDetail | undefined {
  const pkg = allPackages.find((p) => p.trackingCode === trackingCode)
  if (!pkg) return undefined

  const date = nowLabel()
  pkg.status = status
  pkg.date = date
  pkg.steps = [
    ...pkg.steps,
    {
      label: STATUS_META[status].label,
      location: comment?.trim() || '—',
      date,
      done: true,
    },
  ]
  return pkg
}

/** Filtres de la page Colis : "Tous" + les 8 statuts du cahier des charges. */
export const statusFilters: { value: PackageStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  ...STATUS_ORDER.map((value) => ({ value, label: STATUS_META[value].label })),
]
