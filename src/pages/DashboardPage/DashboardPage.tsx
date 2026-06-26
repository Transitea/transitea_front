import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Pill } from '@/components/atoms/Pill'
import { Topbar } from '@/components/organisms/Topbar'
import { StatsGrid } from '@/components/organisms/StatsGrid'
import { RecentPackagesTable } from '@/components/organisms/RecentPackagesTable'
import { SyncCard } from '@/components/organisms/SyncCard'
import { ActivityFeed } from '@/components/organisms/ActivityFeed'
import { paths } from '@/router/paths'
import { syncStatus, recentActivity } from '@/data/dashboard'
import { obtenirStatistiques, listerColis, type ColisReponse } from '@/services/colisApi'
import type { StatCardProps } from '@/components/molecules/StatCard'
import type { Package } from '@/data/dashboard'
import styles from './DashboardPage.module.css'

function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} · ${pad(d.getHours())}h${pad(d.getMinutes())}`
}

function colisToPackage(c: ColisReponse): Package {
  return {
    trackingCode: c.codeTracking,
    destination: c.destinataireVille ?? '—',
    via: c.destinataireAdresse ?? '',
    client: c.destinataireNom,
    status: c.statutActuel,
    date: formatDate(c.dateCreation),
  }
}

export function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<StatCardProps[]>([])
  const [recentPackages, setRecentPackages] = useState<Package[]>([])

  useEffect(() => {
    obtenirStatistiques().then((s) => {
      const enTransit = (s.parStatut['EN_TRANSIT'] ?? 0) + (s.parStatut['PRIS_EN_CHARGE'] ?? 0)
      const livres = s.parStatut['LIVRE'] ?? 0
      const problemes = (s.parStatut['REFUSE'] ?? 0) + (s.parStatut['RETOUR_EXPEDITEUR'] ?? 0)
      setStats([
        { icon: 'bi-box-seam', tone: 'blue', label: "Total colis", value: s.total, delta: '' },
        { icon: 'bi-truck', tone: 'gold', label: 'En transit', value: enTransit, delta: 'En cours' },
        { icon: 'bi-check-circle', tone: 'green', label: 'Livrés', value: livres, delta: '' },
        { icon: 'bi-exclamation-triangle', tone: 'red', label: 'Problèmes', value: problemes, delta: '', deltaDirection: problemes > 0 ? 'down' : undefined },
      ])
    }).catch(() => {})

    listerColis({ taille: 6 }).then((page) => {
      setRecentPackages(page.contenu.map(colisToPackage))
    }).catch(() => {})
  }, [])

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <>
      <Topbar
        title="Tableau de bord"
        subtitle={`${today.charAt(0).toUpperCase()}${today.slice(1)} · Kinshasa`}
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
            subtitle="Derniers colis enregistrés"
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
