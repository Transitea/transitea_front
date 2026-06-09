import styles from './StatusBadge.module.css'

/**
 * Statuts de colis définis par le cahier des charges (section 3.2).
 * Les valeurs correspondent à l'énumération backend.
 */
export type PackageStatus =
  | 'ENREGISTRE'
  | 'PRIS_EN_CHARGE'
  | 'EN_TRANSIT'
  | 'ARRIVE_DEPOT'
  | 'EN_LIVRAISON'
  | 'LIVRE'
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
  PRIS_EN_CHARGE: { label: 'Pris en charge', className: styles.prisEnCharge, notifies: true },
  EN_TRANSIT: { label: 'En transit', className: styles.enTransit, notifies: false },
  ARRIVE_DEPOT: { label: 'Arrivé au dépôt', className: styles.arriveDepot, notifies: true },
  EN_LIVRAISON: { label: 'En livraison', className: styles.enLivraison, notifies: true },
  LIVRE: { label: 'Livré', className: styles.livre, notifies: true },
  REFUSE: { label: 'Refusé', className: styles.refuse, notifies: true },
  RETOUR_EXPEDITEUR: { label: 'Retour expéditeur', className: styles.retour, notifies: true },
}

/** Ordre d'affichage des statuts (workflow logistique). */
export const STATUS_ORDER: PackageStatus[] = [
  'ENREGISTRE',
  'PRIS_EN_CHARGE',
  'EN_TRANSIT',
  'ARRIVE_DEPOT',
  'EN_LIVRAISON',
  'LIVRE',
  'REFUSE',
  'RETOUR_EXPEDITEUR',
]

interface StatusBadgeProps {
  status: PackageStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const meta = STATUS_META[status]
  return <span className={`${styles.badge} ${meta.className}`}>{meta.label}</span>
}
