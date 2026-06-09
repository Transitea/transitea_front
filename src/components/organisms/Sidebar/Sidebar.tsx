import { Pill } from '@/components/atoms/Pill'
import { NavItem, type NavItemProps } from '@/components/molecules/NavItem'
import { UserCard, type UserCardProps } from '@/components/molecules/UserCard'
import styles from './Sidebar.module.css'

interface SidebarProps {
  navMain: NavItemProps[]
  navManagement: NavItemProps[]
  user: UserCardProps
  onLogout?: () => void
}

export function Sidebar({ navMain, navManagement, user, onLogout }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>
          Transi<span>tea</span>
        </h1>
        <p>Suivi de colis · RDC</p>
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
