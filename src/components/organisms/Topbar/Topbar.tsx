import type { ReactNode } from 'react'
import styles from './Topbar.module.css'

interface TopbarProps {
  title: string
  subtitle?: string
  /** Éléments affichés à droite (boutons, pills…). */
  actions?: ReactNode
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <div>
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.sub}>{subtitle}</div>}
      </div>
      {actions && <div className={styles.right}>{actions}</div>}
    </header>
  )
}
