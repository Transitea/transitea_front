import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { StatusBadge, type PackageStatus } from '@/components/atoms/StatusBadge'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { statusFilters } from '@/data/packages'
import { listerColis, rechercherColis, exporterColisCsvUrl, type ColisReponse } from '@/services/colisApi'
import { db } from '@/offline/db'
import { EVENEMENT_SYNC_TERMINEE } from '@/offline/syncEngine'
import { paths } from '@/router/paths'
import styles from './ColisPage.module.css'

function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} · ${pad(d.getHours())}h${pad(d.getMinutes())}`
}

function toDateInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function ColisPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<PackageStatus | 'all'>('all')
  const [colis, setColis] = useState<ColisReponse[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(
    (location.state as { message?: string } | null)?.message ?? null,
  )

  const brouillons = useLiveQuery(
    async () => {
      const rows = await db.colisLocal.where('syncStatus').notEqual('synced').sortBy('dateCreation')
      return rows.reverse()
    },
    [],
    [],
  )

  const today = new Date()
  const debutMois = new Date(today.getFullYear(), today.getMonth(), 1)
  const [exportOpen, setExportOpen] = useState(false)
  const [exportDebut, setExportDebut] = useState(toDateInput(debutMois))
  const [exportFin, setExportFin] = useState(toDateInput(today))
  const [exportLoading, setExportLoading] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const handleExport = async () => {
    setExportLoading(true)
    setExportError(null)
    try {
      const url = await exporterColisCsvUrl(exportDebut, exportFin)
      const a = document.createElement('a')
      a.href = url
      a.download = `colis_${exportDebut}_${exportFin}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setExportOpen(false)
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Erreur lors de l'export")
    } finally {
      setExportLoading(false)
    }
  }

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

  // Rafraîchit la liste serveur une fois qu'une synchronisation vient de se terminer
  // (les brouillons tout juste synchronisés doivent apparaître ici).
  useEffect(() => {
    const onSyncTerminee = () => fetchColis()
    window.addEventListener(EVENEMENT_SYNC_TERMINEE, onSyncTerminee)
    return () => window.removeEventListener(EVENEMENT_SYNC_TERMINEE, onSyncTerminee)
  }, [fetchColis])

  return (
    <>
      <Topbar
        title="Colis"
        subtitle={loading ? 'Chargement…' : `${total} colis au total`}
        actions={
          <>
            <Button variant="ghost" onClick={() => setExportOpen((v) => !v)}>
              <i className="bi bi-download" /> Exporter CSV
            </Button>
            <Button variant="primary" onClick={() => navigate(paths.colisNouveau)}>
              <i className="bi bi-plus-lg" /> Nouveau colis
            </Button>
          </>
        }
      />

      <div className="app-content">
        {message && (
          <div className={styles.infoBanner}>
            <span>{message}</span>
            <button type="button" onClick={() => setMessage(null)} aria-label="Fermer">
              <i className="bi bi-x-lg" />
            </button>
          </div>
        )}

        {brouillons.length > 0 && (
          <Card title={`Brouillons en attente de synchronisation (${brouillons.length})`}>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Agence de retrait</th>
                    <th>Client</th>
                    <th>État</th>
                    <th>Créé le</th>
                  </tr>
                </thead>
                <tbody>
                  {brouillons.map((b) => (
                    <tr key={b.localId}>
                      <td>
                        <div className={styles.dest}>
                          {b.agenceRetraitNom ?? `Agence #${b.agenceRetraitId}`}
                          <span>{b.destinataireVille ?? ''}</span>
                        </div>
                      </td>
                      <td>{b.destinataireNom}</td>
                      <td>
                        {b.syncStatus === 'error' ? (
                          <span className={styles.exportError}>{b.erreurSync ?? 'Échec de synchronisation'}</span>
                        ) : (
                          <span className={styles.date}>
                            <i className="bi bi-clock-history" /> En attente — QR indisponible
                          </span>
                        )}
                      </td>
                      <td className={styles.date}>{formatDate(b.dateCreation)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {exportOpen && (
          <div className={styles.exportBar}>
            <label>
              Du
              <input
                type="date"
                value={exportDebut}
                max={exportFin}
                onChange={(e) => setExportDebut(e.target.value)}
              />
            </label>
            <label>
              Au
              <input
                type="date"
                value={exportFin}
                min={exportDebut}
                max={toDateInput(today)}
                onChange={(e) => setExportFin(e.target.value)}
              />
            </label>
            <Button variant="primary" onClick={handleExport} disabled={exportLoading}>
              {exportLoading ? 'Export…' : <><i className="bi bi-file-earmark-spreadsheet" /> Télécharger</>}
            </Button>
            {exportError && <span className={styles.exportError}>{exportError}</span>}
          </div>
        )}

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
