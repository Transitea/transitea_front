import type { SyncStatus } from '@/data/dashboard'
import styles from './SyncCard.module.css'

interface SyncCardProps {
  sync: SyncStatus
}

export function SyncCard({ sync }: SyncCardProps) {
  return (
    <div className={styles.card}>
      <h3>
        <i className="bi bi-wifi" /> Synchronisation
      </h3>
      <div className={styles.row}>
        <span>Colis en attente synchro</span>
        <strong>{sync.pending}</strong>
      </div>
      <div className={styles.row}>
        <span>Dernière synchro</span>
        <strong>{sync.lastSync}</strong>
      </div>
      <div className={styles.bar}>
        <div className={styles.barFill} style={{ width: `${sync.progress}%` }} />
      </div>
      <div className={styles.note}>{sync.progress}% des données locales synchronisées</div>
    </div>
  )
}
