import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { StatusBadge, STATUS_META } from '@/components/atoms/StatusBadge'
import { suivreColis, type SuiviPublicReponse } from '@/services/trackingApi'
import { paths } from '@/router/paths'
import styles from './SuiviPage.module.css'

function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} · ${pad(d.getHours())}h${pad(d.getMinutes())}`
}

export function SuiviPage() {
  const { codeTracking } = useParams()
  const navigate = useNavigate()
  const [code, setCode] = useState(codeTracking ?? '')
  const [colis, setColis] = useState<SuiviPublicReponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!codeTracking) return
    setLoading(true)
    setError(null)
    suivreColis(codeTracking)
      .then(setColis)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [codeTracking])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    navigate(paths.suivi(code.trim().toUpperCase()))
  }

  return (
    <main className={styles.page}>
      <div className={styles.brand}>
        Transi<span>tea</span>
      </div>
      <h1 className="sr-only">Suivre un colis</h1>

      <div className={styles.card}>
        <form className={styles.search} onSubmit={handleSearch}>
          <label htmlFor="code">Code de suivi</label>
          <div className={styles.searchRow}>
            <Input
              id="code"
              icon="bi-upc-scan"
              placeholder="TRA-2026-000001"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoCapitalize="characters"
            />
            <Button type="submit" variant="primary">
              <i className="bi bi-search" /> Suivre
            </Button>
          </div>
        </form>

        {loading && <div className={styles.state}>Chargement…</div>}

        {!loading && error && (
          <div className={styles.state}>
            <i className="bi bi-exclamation-circle" /> Aucun colis trouvé pour ce code de suivi.
          </div>
        )}

        {!loading && !error && colis && (
          <div className={styles.result}>
            <div className={styles.headline}>
              <span className={styles.code}>{colis.codeTracking}</span>
              <StatusBadge status={colis.statutActuel} />
            </div>

            <div className={styles.infoGrid}>
              <div>
                <span>Expéditeur</span>
                <strong>{colis.expediteurNom}</strong>
              </div>
              <div>
                <span>Destinataire</span>
                <strong>{colis.destinataireNom}</strong>
              </div>
              {colis.destinataireVille && (
                <div>
                  <span>Ville de retrait</span>
                  <strong>{colis.destinataireVille}</strong>
                </div>
              )}
              {colis.poids != null && (
                <div>
                  <span>Poids</span>
                  <strong>{colis.poids} kg</strong>
                </div>
              )}
              {colis.description && (
                <div className={styles.full}>
                  <span>Description</span>
                  <strong>{colis.description}</strong>
                </div>
              )}
            </div>

            <ul className={styles.timeline}>
              {colis.historique.map((step, i) => (
                <li key={step.id ?? i} className={styles.step}>
                  <div className={styles.dot}>
                    <i className="bi bi-check-lg" />
                  </div>
                  <div>
                    <div className={styles.stepLabel}>{STATUS_META[step.statut]?.label ?? step.statut}</div>
                    <div className={styles.stepMeta}>
                      {formatDate(step.dateCreation)}
                      {step.localisation ? ` · ${step.localisation}` : ''}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loading && !codeTracking && !colis && (
          <div className={styles.state}>Saisissez le code reçu par WhatsApp ou e-mail pour suivre votre colis.</div>
        )}
      </div>

      <div className={styles.footer}>
        <button type="button" onClick={() => navigate(paths.login)}>
          Vous êtes une agence ? Connectez-vous
        </button>
      </div>
    </main>
  )
}
