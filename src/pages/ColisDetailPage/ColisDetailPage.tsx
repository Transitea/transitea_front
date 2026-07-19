import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StatusBadge, type PackageStatus, STATUS_META } from '@/components/atoms/StatusBadge'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { UpdateStatusSheet } from '@/components/organisms/UpdateStatusSheet'
import {
  obtenirColis,
  mettreAJourStatut,
  retirerColis,
  obtenirQrCodeUrl,
  type ColisReponse,
} from '@/services/colisApi'
import { paths } from '@/router/paths'
import styles from './ColisDetailPage.module.css'

function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} · ${pad(d.getHours())}h${pad(d.getMinutes())}`
}

export function ColisDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [pkg, setPkg] = useState<ColisReponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [retraitLoading, setRetraitLoading] = useState(false)
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [showQr, setShowQr] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    obtenirColis(Number(id))
      .then(setPkg)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur'))
      .finally(() => setLoading(false))
  }, [id])

  // Libère l'object URL du QR code à la fermeture / au démontage.
  useEffect(() => {
    return () => {
      if (qrUrl) URL.revokeObjectURL(qrUrl)
    }
  }, [qrUrl])

  const handleUpdate = async (status: PackageStatus, comment: string) => {
    if (!pkg) return
    try {
      const updated = await mettreAJourStatut(pkg.id, status, comment || undefined, comment || undefined)
      setPkg(updated)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    }
    setSheetOpen(false)
  }

  const handleRetrait = async () => {
    if (!pkg) return
    setRetraitLoading(true)
    try {
      const updated = await retirerColis(pkg.codeTracking)
      setPkg(updated)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors du retrait')
    } finally {
      setRetraitLoading(false)
    }
  }

  const handleShowQr = async () => {
    if (!pkg) return
    if (!qrUrl) {
      try {
        const url = await obtenirQrCodeUrl(pkg.id)
        setQrUrl(url)
      } catch {
        alert('Impossible de charger le QR code')
        return
      }
    }
    setShowQr(true)
  }

  if (loading) {
    return (
      <>
        <Topbar title="Détail du colis" />
        <div className="app-content" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
          Chargement…
        </div>
      </>
    )
  }

  if (error || !pkg) {
    return (
      <>
        <Topbar title="Colis introuvable" />
        <div className="app-content">
          <button className={styles.back} onClick={() => navigate(paths.colis)}>
            <i className="bi bi-arrow-left" /> Retour aux colis
          </button>
          <Card>
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
              {error ?? `Aucun colis ne correspond à l'identifiant « ${id} ».`}
            </div>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Topbar title="Détail du colis" subtitle={pkg.codeTracking} />

      <div className="app-content">
        <button className={styles.back} onClick={() => navigate(paths.colis)}>
          <i className="bi bi-arrow-left" /> Retour aux colis
        </button>

        <div className={styles.grid}>
          {/* Suivi */}
          <Card title="Suivi de l'expédition">
            <div className={styles.body}>
              <div className={styles.headline}>
                <span className={styles.code}>{pkg.codeTracking}</span>
                <StatusBadge status={pkg.statutActuel} />
              </div>
              <div className={styles.route}>
                <i className="bi bi-shop" /> {pkg.agenceOrigineNom}
                {' '}<i className="bi bi-arrow-right" />{' '}
                <i className="bi bi-shop" /> {pkg.agenceRetraitNom}
              </div>

              <ul className={styles.timeline}>
                {pkg.historique.map((step, i) => (
                  <li key={step.id ?? i} className={styles.step}>
                    <div className={`${styles.dot} ${styles.dotDone}`}>
                      <i className="bi bi-check-lg" />
                    </div>
                    <div>
                      <div className={styles.stepLabel}>{STATUS_META[step.statut]?.label ?? step.statut}</div>
                      <div className={styles.stepMeta}>
                        {step.localisation ?? '—'} · {formatDate(step.dateCreation)}
                        {step.commentaire ? ` · ${step.commentaire}` : ''}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Infos + actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card title="Informations">
              <div className={styles.body}>
                <div className={styles.infoRow}>
                  <span>Agence de dépôt</span>
                  <strong>{pkg.agenceOrigineNom}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Agence de retrait</span>
                  <strong>{pkg.agenceRetraitNom}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Destinataire</span>
                  <strong>{pkg.destinataireNom}</strong>
                </div>
                {pkg.destinataireTelephone && (
                  <div className={styles.infoRow}>
                    <span>Téléphone</span>
                    <strong>{pkg.destinataireTelephone}</strong>
                  </div>
                )}
                <div className={styles.infoRow}>
                  <span>Expéditeur</span>
                  <strong>{pkg.expediteurNom}</strong>
                </div>
                {pkg.poids != null && (
                  <div className={styles.infoRow}>
                    <span>Poids</span>
                    <strong>{pkg.poids} kg</strong>
                  </div>
                )}
                {pkg.description && (
                  <div className={styles.infoRow}>
                    <span>Description</span>
                    <strong>{pkg.description}</strong>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Actions">
              <div className={styles.actions}>
                {pkg.statutActuel === 'ARRIVE_AGENCE' && (
                  <button className={styles.updateBtn} onClick={handleRetrait} disabled={retraitLoading}>
                    <i className="bi bi-qr-code-scan" />
                    {retraitLoading ? 'Retrait en cours…' : 'Valider le retrait (scan QR)'}
                  </button>
                )}
                <button className={styles.actionBtn} onClick={() => setSheetOpen(true)}>
                  <i className="bi bi-arrow-repeat" /> Mettre à jour le statut
                </button>
                <button className={styles.actionBtn} onClick={handleShowQr}>
                  <i className="bi bi-qr-code" /> Afficher le QR code
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {sheetOpen && (
        <UpdateStatusSheet
          trackingCode={pkg.codeTracking}
          current={pkg.statutActuel}
          onConfirm={handleUpdate}
          onClose={() => setSheetOpen(false)}
        />
      )}

      {showQr && qrUrl && (
        <div className={styles.qrOverlay} onClick={() => setShowQr(false)}>
          <div className={styles.qrModal} onClick={(e) => e.stopPropagation()}>
            <img src={qrUrl} alt={`QR code du colis ${pkg.codeTracking}`} />
            <p>{pkg.codeTracking}</p>
            <button className={styles.actionBtn} onClick={() => setShowQr(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  )
}
