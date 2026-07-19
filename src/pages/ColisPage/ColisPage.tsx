import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { StatusBadge, type PackageStatus } from '@/components/atoms/StatusBadge'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { statusFilters } from '@/data/packages'
import { listerColis, rechercherColis, type ColisReponse } from '@/services/colisApi'
import { paths } from '@/router/paths'
import styles from './ColisPage.module.css'

function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} · ${pad(d.getHours())}h${pad(d.getMinutes())}`
}

export function ColisPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<PackageStatus | 'all'>('all')
  const [colis, setColis] = useState<ColisReponse[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchColis = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let result
      if (search.trim()) {
        result = await rechercherColis(search.trim())
      } else {
        result = await listerColis({
          statut: filter !== 'all' ? filter : undefined,
          taille: 50,
        })
      }
      setColis(result.contenu)
      setTotal(result.totalElements)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [search, filter])

  useEffect(() => {
    const timer = setTimeout(fetchColis, search ? 400 : 0)
    return () => clearTimeout(timer)
  }, [fetchColis, search])

  return (
    <>
      <Topbar
        title="Colis"
        subtitle={loading ? 'Chargement…' : `${total} colis au total`}
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
          {error && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--red, #dc2626)' }}>
              {error}
            </div>
          )}
          {!error && (
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Code suivi</th>
                    <th>Agence de retrait</th>
                    <th>Client</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {colis.map((p) => (
                    <tr
                      key={p.id}
                      className={styles.row}
                      onClick={() => navigate(paths.colisDetail(String(p.id)))}
                    >
                      <td>
                        <span className={styles.code}>{p.codeTracking}</span>
                      </td>
                      <td>
                        <div className={styles.dest}>
                          {p.agenceRetraitNom}
                          <span>{p.destinataireVille ?? ''}</span>
                        </div>
                      </td>
                      <td>{p.destinataireNom}</td>
                      <td>
                        <StatusBadge status={p.statutActuel} />
                      </td>
                      <td className={styles.date}>{formatDate(p.dateCreation)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && !error && colis.length === 0 && (
            <div className={styles.empty}>Aucun colis ne correspond à votre recherche.</div>
          )}
        </Card>
      </div>
    </>
  )
}
