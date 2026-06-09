import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { StatsGrid } from '@/components/organisms/StatsGrid'
import type { StatCardProps } from '@/components/molecules/StatCard'
import styles from './RapportsPage.module.css'

const reportStats: StatCardProps[] = [
  { icon: 'bi-box-seam', tone: 'blue', label: 'Colis ce mois', value: 1248, delta: '+9% vs mois dernier' },
  { icon: 'bi-check-circle', tone: 'green', label: 'Taux de livraison', value: '94%', delta: '+2 pts' },
  { icon: 'bi-clock-history', tone: 'gold', label: 'Délai moyen', value: '2,8 j', delta: 'stable' },
  { icon: 'bi-cash-stack', tone: 'green', label: 'Chiffre d’affaires', value: '8,4 M FC', delta: '+12%' },
]

const weekly = [
  { label: 'Lun', value: 42 },
  { label: 'Mar', value: 58 },
  { label: 'Mer', value: 35 },
  { label: 'Jeu', value: 71 },
  { label: 'Ven', value: 64 },
  { label: 'Sam', value: 87 },
  { label: 'Dim', value: 23 },
]

export function RapportsPage() {
  const max = Math.max(...weekly.map((d) => d.value))

  return (
    <>
      <Topbar title="Rapports" subtitle="Vue d'ensemble de l'activité" />

      <div className="app-content">
        <StatsGrid stats={reportStats} />

        <div className={styles.section}>
          <Card title="Colis traités cette semaine" subtitle="Nombre de colis par jour">
            <div className={styles.chartCard}>
              <div className={styles.chart}>
                {weekly.map((d) => (
                  <div key={d.label} className={styles.bar}>
                    <span className={styles.barValue}>{d.value}</span>
                    <div
                      className={styles.barFill}
                      style={{ height: `${(d.value / max) * 100}%` }}
                    />
                    <span className={styles.barLabel}>{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
