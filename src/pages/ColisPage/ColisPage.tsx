import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { StatusBadge, type PackageStatus } from '@/components/atoms/StatusBadge'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { allPackages, statusFilters } from '@/data/packages'
import { paths } from '@/router/paths'
import styles from './ColisPage.module.css'

export function ColisPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<PackageStatus | 'all'>('all')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allPackages.filter((p) => {
      const matchStatus = filter === 'all' || p.status === filter
      const matchSearch =
        !q ||
        p.trackingCode.toLowerCase().includes(q) ||
        p.destination.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [search, filter])

  return (
    <>
      <Topbar
        title="Colis"
        subtitle={`${allPackages.length} colis au total`}
        actions={
          <Button variant="primary" onClick={() => navigate(paths.colisNouveau)}>
            <i className="bi bi-plus-lg" /> Nouveau colis
          </Button>
        }
      />

      <div className="app-content">
        <div className={styles.toolbar}>
          <div className={styles.search}>
            <Input
              icon="bi-search"
              placeholder="Rechercher un code, une ville, un client…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filters}>
            {statusFilters.map((f) => (
              <button
                key={f.value}
                className={`${styles.chip} ${filter === f.value ? styles.chipActive : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <Card>
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
              {filtered.map((p) => (
                <tr
                  key={p.trackingCode}
                  className={styles.row}
                  onClick={() => navigate(paths.colisDetail(p.trackingCode))}
                >
                  <td>
                    <span className={styles.code}>{p.trackingCode}</span>
                  </td>
                  <td>
                    <div className={styles.dest}>
                      {p.destination}
                      <span>{p.via}</span>
                    </div>
                  </td>
                  <td>{p.client}</td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td className={styles.date}>{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {filtered.length === 0 && (
            <div className={styles.empty}>Aucun colis ne correspond à votre recherche.</div>
          )}
        </Card>
      </div>
    </>
  )
}
