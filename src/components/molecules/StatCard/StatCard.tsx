import styles from './StatCard.module.css'

export interface StatCardProps {
  /** Classe d'icône Bootstrap, ex. "bi-box-seam" */
  icon: string
  tone: 'blue' | 'gold' | 'green' | 'red'
  label: string
  value: string | number
  delta?: string
  deltaDirection?: 'up' | 'down'
}

export function StatCard({
  icon,
  tone,
  label,
  value,
  delta,
  deltaDirection = 'up',
}: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={`${styles.icon} ${styles[tone]}`}>
        <i className={`bi ${icon}`} />
      </div>
      <div>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
        {delta && (
          <div className={`${styles.delta} ${deltaDirection === 'down' ? styles.down : ''}`}>
            <i className="bi bi-arrow-up-short" /> {delta}
          </div>
        )}
      </div>
    </div>
  )
}
