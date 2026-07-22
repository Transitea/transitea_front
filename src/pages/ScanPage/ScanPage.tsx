import { lazy, Suspense, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { StatusBadge } from '@/components/atoms/StatusBadge'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { rechercherColis, retirerColis, type ColisReponse } from '@/services/colisApi'
import { paths } from '@/router/paths'
import styles from './ScanPage.module.css'

// La librairie de scan (lourde) n'est chargée qu'à l'ouverture de la caméra.
const QrScanner = lazy(() =>
  import('@/components/organisms/QrScanner').then((m) => ({ default: m.QrScanner })),
)

/** Extrait un code de tracking d'un texte de QR (code brut ou URL le contenant). */
function extractCode(text: string): string {
  // Format réel (GenerateurCodeTracking) : TRA-{année}-{6 caractères A-Z0-9}, pas seulement des chiffres.
  const match = text.match(/TRA-\d{4}-[A-Z0-9]{6}/i)
  return (match ? match[0] : text).trim().toUpperCase()
}

export function ScanPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [retire, setRetire] = useState<ColisReponse | null>(null)

  /** Recherche le colis par code de suivi, puis valide le retrait s'il est prêt. */
  const handleCode = async (raw: string) => {
    const trackingCode = extractCode(raw)
    setError('')
    setRetire(null)
    setLoading(true)
    try {
      const result = await rechercherColis(trackingCode)
      const found = result.contenu.find((c) => c.codeTracking.toUpperCase() === trackingCode)

      if (!found) {
        setError(`Aucun colis trouvé pour « ${trackingCode} ».`)
        return
      }

      if (found.statutActuel === 'ARRIVE_AGENCE') {
        const updated = await retirerColis(found.codeTracking)
        setRetire(updated)
      } else {
        // Le colis n'est pas encore prêt pour le retrait : on ouvre sa fiche.
        navigate(paths.colisDetail(String(found.id)))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche du colis')
    } finally {
      setLoading(false)
    }
  }

  const handleManual = (e: FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    handleCode(code)
  }

  const handleScanResult = (text: string) => {
    setScanning(false)
    handleCode(text)
  }

  if (retire) {
    return (
      <>
        <Topbar title="Retrait validé" subtitle={retire.codeTracking} />
        <div className="app-content">
          <Card>
            <div className={styles.success}>
              <i className="bi bi-check-circle-fill" />
              <h2>Colis retiré avec succès</h2>
              <p>
                {retire.destinataireNom} a récupéré le colis {retire.codeTracking} à l'agence{' '}
                {retire.agenceRetraitNom}. L'expéditeur a été notifié.
              </p>
              <StatusBadge status={retire.statutActuel} />
              <div className={styles.successActions}>
                <Button variant="ghost" onClick={() => setRetire(null)}>
                  <i className="bi bi-qr-code-scan" /> Scanner un autre colis
                </Button>
                <Button variant="primary" onClick={() => navigate(paths.colisDetail(String(retire.id)))}>
                  Voir le colis
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Topbar title="Scanner un colis" subtitle="Retrait sécurisé par scan du QR code" />

      <div className="app-content">
        <div className={styles.wrap}>
          {/* Scan QR */}
          <div className={styles.scanCard}>
            <i className={`bi bi-qr-code-scan ${styles.scanIcon}`} />
            <h2>Scanner le QR code</h2>
            <p>Visez le QR code présenté par le destinataire</p>
            <Button className={styles.scanBtn} onClick={() => setScanning(true)}>
              <i className="bi bi-camera" /> Ouvrir la caméra
            </Button>
          </div>

          <div className={styles.divider}>ou</div>

          {/* Saisie manuelle */}
          <Card title="Saisir le code manuellement">
            <form className={styles.manual} style={{ padding: 20 }} onSubmit={handleManual}>
              <label htmlFor="code">Code de suivi</label>
              <Input
                id="code"
                icon="bi-upc-scan"
                placeholder="TRA-2026-000001"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setError('')
                }}
                autoCapitalize="characters"
              />
              {error && (
                <div className={styles.error}>
                  <i className="bi bi-exclamation-circle" /> {error}
                </div>
              )}
              <Button type="submit" variant="primary" disabled={loading} style={{ justifyContent: 'center' }}>
                {loading ? 'Recherche…' : <><i className="bi bi-box-arrow-in-right" /> Accéder au colis</>}
              </Button>
            </form>
          </Card>

          {/* Enregistrement */}
          <div className={styles.newLink}>
            Nouveau colis à enregistrer ?{' '}
            <button type="button" onClick={() => navigate(paths.colisNouveau)}>
              Enregistrer un colis
            </button>
          </div>
        </div>
      </div>

      {scanning && (
        <Suspense fallback={null}>
          <QrScanner onResult={handleScanResult} onClose={() => setScanning(false)} />
        </Suspense>
      )}
    </>
  )
}
