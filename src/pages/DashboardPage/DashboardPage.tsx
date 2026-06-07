import { Sidebar } from '@/components/organisms/Sidebar'
import { Topbar } from '@/components/organisms/Topbar'
import { StatsGrid } from '@/components/organisms/StatsGrid'
import { RecentPackagesTable } from '@/components/organisms/RecentPackagesTable'
import { SyncCard } from '@/components/organisms/SyncCard'
import { ActivityFeed } from '@/components/organisms/ActivityFeed'
import {
  currentUser,
  navMain,
  navManagement,
  stats,
  recentPackages,
  syncStatus,
  recentActivity,
} from '@/data/dashboard'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  return (
    <>
      <Sidebar navMain={navMain} navManagement={navManagement} user={currentUser} />

      <div className={styles.main}>
        <Topbar title="Tableau de bord" subtitle="Samedi 10 mai 2026 · Kinshasa" />

        <div className={styles.content}>
          <StatsGrid stats={stats} />

          <div className={styles.grid2}>
            <RecentPackagesTable packages={recentPackages} subtitle="Mis à jour il y a 3 min" />

            <div className={styles.sideCol}>
              <SyncCard sync={syncStatus} />
              <ActivityFeed items={recentActivity} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
