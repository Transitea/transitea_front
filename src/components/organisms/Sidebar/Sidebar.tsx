import { Pill } from '@/components/atoms/Pill'
import { NavItem, type NavItemProps } from '@/components/molecules/NavItem'
import { UserCard, type UserCardProps } from '@/components/molecules/UserCard'
import styles from './Sidebar.module.css'

interface SidebarProps {
  navMain: NavItemProps[]
  navManagement: NavItemProps[]
  user: UserCardProps
  onLogout?: () => void
  /** Tiroir ouvert (mobile). */
  open?: boolean
  /** Ferme le tiroir (mobile). */
  onClose?: () => void
}

export function Sidebar({
  navMain,
  navManagement,
  user,
  onLogout,
  open = false,
  onClose,
}: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
      <div className={styles.logo}>
        <button
          type="button"
          className={styles.close}
          aria-label="Fermer le menu"
          onClick={onClose}
        >
          <i className="bi bi-x-lg" />
        </button>
        <h1>
          Transi<span>tea</span>
        </h1>
        <p>Suivi de colis</p>
        <Pill tone="gold" size="sm">
          Mode hors-ligne actif
        </Pill>
      </div>

      <nav className={styles.nav}>
        <div className={styles.section}>Principal</div>
        {navMain.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}

        <div className={styles.section} style={{ marginTop: 12 }}>
          Gestion
        </div>
        {navManagement.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

      <div className={styles.bottom}>
        <UserCard {...user} />
        <button type="button" className={styles.logout} onClick={onLogout}>
          <i className="bi bi-box-arrow-right" /> Déconnexion
        </button>
      </div>
    </aside>
  )
}
