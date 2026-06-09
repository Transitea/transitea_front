import styles from './NavItem.module.css'

export interface NavItemProps {
  icon: string
  label: string
  active?: boolean
  badge?: number
  onClick?: () => void
}

export function NavItem({ icon, label, active, badge, onClick }: NavItemProps) {
  return (
    <div className={`${styles.item} ${active ? styles.active : ''}`} onClick={onClick}>
      <span className={styles.icon}>
        <i className={`bi ${icon}`} />
      </span>
      {label}
      {badge !== undefined && <span className={styles.badge}>{badge}</span>}
    </div>
  )
}
