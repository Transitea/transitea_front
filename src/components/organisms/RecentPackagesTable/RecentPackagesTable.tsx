import { Button } from '@/components/atoms/Button'
import { StatusBadge } from '@/components/atoms/StatusBadge'
import { Card } from '@/components/molecules/Card'
import type { Package } from '@/data/dashboard'
import styles from './RecentPackagesTable.module.css'

interface RecentPackagesTableProps {
  packages: Package[]
  subtitle?: string
  onSeeAll?: () => void
}

export function RecentPackagesTable({ packages, subtitle, onSeeAll }: RecentPackagesTableProps) {
  return (
    <Card
      title="Colis récents"
      subtitle={subtitle}
      action={
        <Button variant="ghost" onClick={onSeeAll}>
          Voir tout →
        </Button>
      }
    >
      <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Code suivi</th>
            <th>Destination</th>
            <th>Client</th>
            <th>Statut</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg.trackingCode}>
              <td>
                <span className={styles.trackingCode}>{pkg.trackingCode}</span>
              </td>
              <td>
                <div className={styles.dest}>
                  {pkg.destination}
                  <span>{pkg.via}</span>
                </div>
              </td>
              <td>{pkg.client}</td>
              <td>
                <StatusBadge status={pkg.status} />
              </td>
              <td className={styles.date}>{pkg.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </Card>
  )
}
