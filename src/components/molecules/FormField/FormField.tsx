import type { InputHTMLAttributes } from 'react'
import { Input } from '@/components/atoms/Input'
import styles from './FormField.module.css'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  /** Classe d'icône Bootstrap affichée dans le champ */
  icon?: string
  error?: string
}

export function FormField({ label, icon, error, id, ...rest }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <Input id={id} icon={icon} {...rest} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
