import { NavLink } from 'react-router-dom'
import styles from './NavItem.module.css'

export interface NavItemProps {
  icon: string
  label: string
  /** Chemin de destination (react-router). */
  path: string
  /** Correspondance exacte du chemin (utile pour la route racine "/"). */
  end?: boolean
  badge?: number
  /** Visible uniquement pour le rôle ADMIN (filtré en amont, ignoré par ce composant). */
  adminOnly?: boolean
}

export function NavItem({ icon, label, path, end, badge }: NavItemProps) {
  return (
    <NavLink
      to={path}
      end={end}
      className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
    >
      <span className={styles.icon}>
        <i className={`bi ${icon}`} />
      </span>
      {label}
      {badge !== undefined && <span className={styles.badge}>{badge}</span>}
    </NavLink>
  )
}
