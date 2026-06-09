import type { ReactNode } from 'react'
import styles from './Pill.module.css'

interface PillProps {
  tone?: 'success' | 'gold'
  size?: 'sm' | 'md'
  children: ReactNode
}

export function Pill({ tone = 'success', size = 'md', children }: PillProps) {
  return <span className={`${styles.pill} ${styles[tone]} ${styles[size]}`}>{children}</span>
}
