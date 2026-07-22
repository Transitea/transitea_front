import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Pill } from '@/components/atoms/Pill'
import { Topbar } from '@/components/organisms/Topbar'
import { StatsGrid } from '@/components/organisms/StatsGrid'
import { RecentPackagesTable } from '@/components/organisms/RecentPackagesTable'
import { EnseigneCard } from '@/components/organisms/EnseigneCard'
import { paths } from '@/router/paths'
import { obtenirStatistiques, listerColis, type ColisReponse } from '@/services/colisApi'
import { obtenirEnseigne, type EnseigneReponse } from '@/services/enseigneApi'
import { useAuth } from '@/auth/AuthContext'
import { useEnLigne } from '@/offline/useEnLigne'
import type { StatCardProps } from '@/components/molecules/StatCard'
import type { Package } from '@/data/dashboard'

function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} · ${pad(d.getHours())}h${pad(d.getMinutes())}`
}

function colisToPackage(c: ColisReponse): Package {
  return {
    trackingCode: c.codeTracking,
    destination: c.agenceRetraitNom,
    via: c.destinataireVille ?? '',
    client: c.destinataireNom,
    status: c.statutActuel,
    date: formatDate(c.dateCreation),
  }
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const enLigne = useEnLigne()
  const [stats, setStats] = useState<StatCardProps[]>([])
  const [recentPackages, setRecentPackages] = useState<Package[]>([])
  const [enseigne, setEnseigne] = useState<EnseigneReponse | null>(null)

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      obtenirEnseigne().then(setEnseigne).catch(() => {})
    }
  }, [user])

  useEffect(() => {
    obtenirStatistiques().then((s) => {
      const enTransit = s.parStatut['EN_TRANSIT'] ?? 0
      const enAttenteRetrait = s.parStatut['ARRIVE_AGENCE'] ?? 0
      const retires = s.parStatut['RETIRE'] ?? 0
      const problemes = (s.parStatut['REFUSE'] ?? 0) + (s.parStatut['RETOUR_EXPEDITEUR'] ?? 0)
      setStats([
        { icon: 'bi-box-seam', tone: 'blue', label: "Total colis", value: s.total, delta: '' },
        { icon: 'bi-truck', tone: 'gold', label: 'En transit', value: enTransit, delta: 'En cours' },
        { icon: 'bi-qr-code-scan', tone: 'gold', label: 'En attente de retrait', value: enAttenteRetrait, delta: '' },
        { icon: 'bi-check-circle', tone: 'green', label: 'Retirés', value: retires, delta: '' },
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
        subtitle={`${today.charAt(0).toUpperCase()}${today.slice(1)}${user?.agenceNom ? ` · ${user.agenceNom}` : ''}`}
        actions={
          <>
            <Pill tone={enLigne ? 'success' : 'gold'}>
              <i className={`bi ${enLigne ? 'bi-wifi' : 'bi-wifi-off'}`} /> {enLigne ? 'En ligne' : 'Hors ligne'}
            </Pill>
            <Button variant="primary" onClick={() => navigate(paths.colisNouveau)}>
              <i className="bi bi-plus-lg" /> Nouveau colis
            </Button>
          </>
        }
      />

      <div className="app-content">
        <StatsGrid stats={stats} />

        {enseigne && (
          <div style={{ maxWidth: 420, marginBottom: 16 }}>
            <EnseigneCard enseigne={enseigne} />
          </div>
        )}

        <RecentPackagesTable
          packages={recentPackages}
          subtitle="Derniers colis enregistrés"
          onSeeAll={() => navigate(paths.colis)}
        />
      </div>
    </>
  )
}
