import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from '@/components/organisms/Sidebar'
import { useAuth } from '@/auth/AuthContext'
import { navMain, navManagement } from '@/config/navigation'
import { ROLE_LABELS } from '@/services/authApi'
import { paths } from '@/router/paths'
import styles from './AppLayout.module.css'

/**
 * Coquille applicative : sidebar (fixe sur desktop, tiroir sur mobile) + zone principale.
 * Les pages enfants sont rendues via <Outlet /> et fournissent leur propre Topbar.
 */
function initials(nom: string, prenom: string): string {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()
}

export function AppLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Ferme le tiroir à chaque changement de page (navigation mobile).
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  // Empêche le scroll de l'arrière-plan quand le tiroir est ouvert.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const handleLogout = () => {
    logout()
    navigate(paths.login)
  }

  return (
    <>
      {/* En-tête mobile (hamburger + marque), masqué sur desktop */}
      <header className={styles.mobileHeader}>
        <button
          type="button"
          className={styles.burger}
          aria-label="Ouvrir le menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          <i className="bi bi-list" />
        </button>
        <span className={styles.mobileBrand}>
          Transi<span>tea</span>
        </span>
      </header>

      {/* Overlay sombre quand le tiroir est ouvert (mobile) */}
      {drawerOpen && (
        <div
          className={styles.overlay}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        navMain={navMain.filter((item) => !item.adminOnly || user?.role === 'ADMIN')}
        navManagement={navManagement.filter((item) => !item.adminOnly || user?.role === 'ADMIN')}
        user={
          user
            ? {
                initials: initials(user.nom, user.prenom),
                name: `${user.prenom} ${user.nom}`,
                role: user.agenceNom ? `${ROLE_LABELS[user.role]} · ${user.agenceNom}` : ROLE_LABELS[user.role],
              }
            : { initials: '?', name: '—', role: '—' }
        }
        onLogout={handleLogout}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <div className={styles.main}>
        <Outlet />
      </div>
    </>
  )
}
