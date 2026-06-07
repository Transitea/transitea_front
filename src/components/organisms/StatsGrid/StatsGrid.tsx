import { StatCard, type StatCardProps } from '@/components/molecules/StatCard'
import styles from './StatsGrid.module.css'

interface StatsGridProps {
  stats: StatCardProps[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className={styles.grid}>
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
