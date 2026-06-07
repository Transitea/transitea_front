import styles from './StatusBadge.module.css'

export type PackageStatus = 'delivered' | 'transit' | 'pending' | 'issue'

const LABELS: Record<PackageStatus, string> = {
  delivered: 'Livré',
  transit: 'En transit',
  pending: 'En attente',
  issue: 'Problème',
}

interface StatusBadgeProps {
  status: PackageStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`${styles.badge} ${styles[status]}`}>{LABELS[status]}</span>
}
