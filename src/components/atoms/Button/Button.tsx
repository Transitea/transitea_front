import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  children: ReactNode
}

export function Button({ variant = 'primary', children, className, ...rest }: ButtonProps) {
  return (
    <button className={`${styles.btn} ${styles[variant]} ${className ?? ''}`} {...rest}>
      {children}
    </button>
  )
}
