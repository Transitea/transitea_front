import type { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  title?: string
  subtitle?: string
  /** Élément affiché à droite de l'en-tête (ex. bouton "Voir tout") */
  action?: ReactNode
  children: ReactNode
}

export function Card({ title, subtitle, action, children }: CardProps) {
  const hasHeader = title || action
  return (
    <div className={styles.card}>
      {hasHeader && (
        <div className={styles.header}>
          <div>
            {title && <div className={styles.title}>{title}</div>}
            {subtitle && <div className={styles.sub}>{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
