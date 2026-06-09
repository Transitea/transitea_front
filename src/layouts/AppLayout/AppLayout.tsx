import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar } from '@/components/organisms/Sidebar'
import { useAuth } from '@/auth/AuthContext'
import { navMain, navManagement } from '@/config/navigation'
import { currentUser } from '@/data/dashboard'
import { paths } from '@/router/paths'
import styles from './AppLayout.module.css'

/**
 * Coquille applicative : sidebar fixe + zone principale.
 * Les pages enfants sont rendues via <Outlet /> et fournissent leur propre Topbar.
 */
export function AppLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(paths.login)
  }

  return (
    <>
      <Sidebar
        navMain={navMain}
        navManagement={navManagement}
        user={currentUser}
        onLogout={handleLogout}
      />
      <div className={styles.main}>
        <Outlet />
      </div>
    </>
  )
}
