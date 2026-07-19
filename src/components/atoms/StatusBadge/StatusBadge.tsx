import styles from './StatusBadge.module.css'

/**
 * Statuts de colis définis par le cahier des charges (section 3.2) et
 * l'énumération StatutColis du backend (modèle multi-agences dépôt/retrait).
 */
export type PackageStatus =
  | 'ENREGISTRE'
  | 'EN_TRANSIT'
  | 'ARRIVE_AGENCE'
  | 'RETIRE'
  | 'REFUSE'
  | 'RETOUR_EXPEDITEUR'

interface StatusMeta {
  /** Libellé lisible (FR). */
  label: string
  /** Classe CSS de couleur. */
  className: string
  /** Le client est-il notifié à ce statut ? (cf. cahier des charges) */
  notifies: boolean
}

export const STATUS_META: Record<PackageStatus, StatusMeta> = {
  ENREGISTRE: { label: 'Enregistré', className: styles.enregistre, notifies: true },
  EN_TRANSIT: { label: 'En transit', className: styles.enTransit, notifies: false },
  ARRIVE_AGENCE: { label: 'Arrivé à l’agence', className: styles.arriveAgence, notifies: true },
  RETIRE: { label: 'Retiré', className: styles.retire, notifies: true },
  REFUSE: { label: 'Refusé', className: styles.refuse, notifies: true },
  RETOUR_EXPEDITEUR: { label: 'Retour expéditeur', className: styles.retour, notifies: true },
}

/** Ordre d'affichage des statuts (workflow logistique dépôt/retrait). */
export const STATUS_ORDER: PackageStatus[] = [
  'ENREGISTRE',
  'EN_TRANSIT',
  'ARRIVE_AGENCE',
  'RETIRE',
  'REFUSE',
  'RETOUR_EXPEDITEUR',
]

/**
 * Transitions autorisées, miroir de ValidateurTransitionStatut côté backend.
 * RETIRE et RETOUR_EXPEDITEUR sont des statuts terminaux.
 */
export const STATUS_TRANSITIONS: Record<PackageStatus, PackageStatus[]> = {
  ENREGISTRE: ['EN_TRANSIT', 'REFUSE'],
  EN_TRANSIT: ['ARRIVE_AGENCE'],
  ARRIVE_AGENCE: ['RETIRE', 'REFUSE'],
  REFUSE: ['RETOUR_EXPEDITEUR'],
  RETIRE: [],
  RETOUR_EXPEDITEUR: [],
}

export function estStatutTerminal(status: PackageStatus): boolean {
  return STATUS_TRANSITIONS[status].length === 0
}

interface StatusBadgeProps {
  status: PackageStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const meta = STATUS_META[status]
  return <span className={`${styles.badge} ${meta.className}`}>{meta.label}</span>
}
