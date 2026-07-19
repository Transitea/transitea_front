import type { NavItemProps } from '@/components/molecules/NavItem'
import { paths } from '@/router/paths'

/** Éléments de navigation de la sidebar, regroupés par section. */
export const navMain: NavItemProps[] = [
  { icon: 'bi-speedometer2', label: 'Dashboard', path: paths.dashboard, end: true },
  { icon: 'bi-qr-code-scan', label: 'Scanner', path: paths.scan },
  { icon: 'bi-box-seam', label: 'Colis', path: paths.colis, badge: 54 },
  { icon: 'bi-shop', label: 'Agences', path: paths.agences },
  { icon: 'bi-people', label: 'Clients', path: paths.clients },
]

export const navManagement: NavItemProps[] = [
  { icon: 'bi-bell', label: 'Notifications', path: paths.notifications, badge: 3 },
  { icon: 'bi-bar-chart', label: 'Rapports', path: paths.rapports },
  { icon: 'bi-gear', label: 'Paramètres', path: paths.parametres },
]
