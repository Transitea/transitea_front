import type { InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Classe d'icône Bootstrap affichée à gauche, ex. "bi-envelope" */
  icon?: string
}

export function Input({ icon, ...rest }: InputProps) {
  return (
    <div className={styles.wrapper}>
      {icon && <i className={`bi ${icon} ${styles.icon}`} />}
      <input className={styles.input} {...rest} />
    </div>
  )
}
