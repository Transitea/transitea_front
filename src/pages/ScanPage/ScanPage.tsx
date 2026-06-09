import { lazy, Suspense, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { getPackageById } from '@/data/packages'
import { paths } from '@/router/paths'
import styles from './ScanPage.module.css'

// La librairie de scan (lourde) n'est chargée qu'à l'ouverture de la caméra.
const QrScanner = lazy(() =>
  import('@/components/organisms/QrScanner').then((m) => ({ default: m.QrScanner })),
)

/** Extrait un code de tracking d'un texte de QR (code brut ou URL le contenant). */
function extractCode(text: string): string {
  const match = text.match(/TRA-\d{4}-\d{6}/i)
  return (match ? match[0] : text).trim().toUpperCase()
}

export function ScanPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)

  /** Ouvre le colis si le code existe, sinon affiche une erreur. */
  const openPackage = (raw: string) => {
    const id = extractCode(raw)
    if (getPackageById(id)) {
      navigate(paths.colisDetail(id))
    } else {
      setError(`Aucun colis trouvé pour « ${id} ».`)
    }
  }

  const handleManual = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!code.trim()) return
    openPackage(code)
  }

  const handleScanResult = (text: string) => {
    setScanning(false)
    setError('')
    openPackage(text)
  }

  return (
    <>
      <Topbar title="Scanner un colis" subtitle="Identifiez un colis pour le mettre à jour" />

      <div className="app-content">
        <div className={styles.wrap}>
          {/* Scan QR */}
          <div className={styles.scanCard}>
            <i className={`bi bi-qr-code-scan ${styles.scanIcon}`} />
            <h2>Scanner le QR code</h2>
            <p>Visez l'étiquette collée sur le colis</p>
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
                placeholder="TRA-2024-000001"
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
              <Button type="submit" variant="primary" style={{ justifyContent: 'center' }}>
                <i className="bi bi-box-arrow-in-right" /> Accéder au colis
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
