import { useEffect, useState } from 'react'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { StatsGrid } from '@/components/organisms/StatsGrid'
import { obtenirVolumeQuotidien, type VolumeJourReponse } from '@/services/colisApi'
import type { StatCardProps } from '@/components/molecules/StatCard'
import styles from './RapportsPage.module.css'

function toDateInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function formatJour(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  return `${jours[d.getDay()]} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`
}

export function RapportsPage() {
  const today = new Date()
  const ilYaSeptJours = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)

  const [debut, setDebut] = useState(toDateInput(ilYaSeptJours))
  const [fin, setFin] = useState(toDateInput(today))
  const [volume, setVolume] = useState<VolumeJourReponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    obtenirVolumeQuotidien(debut, fin)
      .then(setVolume)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [debut, fin])

  const max = Math.max(1, ...volume.map((d) => d.total))
  const totalPeriode = volume.reduce((acc, d) => acc + d.total, 0)
  const moyenneParJour = volume.length ? Math.round((totalPeriode / volume.length) * 10) / 10 : 0
  const pic = volume.reduce((plusCharge, d) => (d.total > plusCharge.total ? d : plusCharge), volume[0] ?? { date: '', total: 0 })

  const stats: StatCardProps[] = [
    { icon: 'bi-box-seam', tone: 'blue', label: 'Total colis (période)', value: totalPeriode },
    { icon: 'bi-graph-up', tone: 'gold', label: 'Moyenne par jour', value: moyenneParJour },
    {
      icon: 'bi-lightning-charge',
      tone: 'green',
      label: 'Jour le plus chargé',
      value: pic.total,
      delta: pic.date ? formatJour(pic.date) : undefined,
    },
  ]

  return (
    <>
      <Topbar title="Rapports" subtitle="Volume de colis sur une période" />

      <div className="app-content">
        <div className={styles.dateRow}>
          <label>
            Du
            <input type="date" value={debut} max={fin} onChange={(e) => setDebut(e.target.value)} />
          </label>
          <label>
            Au
            <input type="date" value={fin} min={debut} max={toDateInput(today)} onChange={(e) => setFin(e.target.value)} />
          </label>
        </div>

        {error && (
          <Card>
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--red, #dc2626)' }}>{error}</div>
          </Card>
        )}

        {!error && (
          <>
            <StatsGrid stats={stats} />

            <div className={styles.section}>
              <Card title="Colis enregistrés par jour" subtitle={loading ? 'Chargement…' : `${volume.length} jour(s)`}>
                <div className={styles.chartCard}>
                  <div className={styles.chart}>
                    {volume.map((d) => (
                      <div key={d.date} className={styles.bar}>
                        <span className={styles.barValue}>{d.total}</span>
                        <div
                          className={styles.barFill}
                          style={{ height: `${(d.total / max) * 100}%` }}
                        />
                        <span className={styles.barLabel}>{formatJour(d.date)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  )
}
