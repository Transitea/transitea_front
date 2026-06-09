import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Pill } from '@/components/atoms/Pill'
import { Topbar } from '@/components/organisms/Topbar'
import { StatsGrid } from '@/components/organisms/StatsGrid'
import { RecentPackagesTable } from '@/components/organisms/RecentPackagesTable'
import { SyncCard } from '@/components/organisms/SyncCard'
import { ActivityFeed } from '@/components/organisms/ActivityFeed'
import { paths } from '@/router/paths'
import { stats, recentPackages, syncStatus, recentActivity } from '@/data/dashboard'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const navigate = useNavigate()

  return (
    <>
      <Topbar
        title="Tableau de bord"
        subtitle="Samedi 10 mai 2026 · Kinshasa"
        actions={
          <>
            <Pill tone="success">Connecté · Synchro OK</Pill>
            <Button variant="primary" onClick={() => navigate(paths.colisNouveau)}>
              <i className="bi bi-plus-lg" /> Nouveau colis
            </Button>
          </>
        }
      />

      <div className="app-content">
        <StatsGrid stats={stats} />

        <div className={styles.grid2}>
          <RecentPackagesTable
            packages={recentPackages}
            subtitle="Mis à jour il y a 3 min"
            onSeeAll={() => navigate(paths.colis)}
          />

          <div className={styles.sideCol}>
            <SyncCard sync={syncStatus} />
            <ActivityFeed items={recentActivity} />
          </div>
        </div>
      </div>
    </>
  )
}
