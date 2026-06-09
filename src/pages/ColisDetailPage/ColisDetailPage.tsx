import { useNavigate, useParams } from 'react-router-dom'
import { StatusBadge } from '@/components/atoms/StatusBadge'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { getPackageById } from '@/data/packages'
import { paths } from '@/router/paths'
import styles from './ColisDetailPage.module.css'

export function ColisDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const pkg = getPackageById(id)

  if (!pkg) {
    return (
      <>
        <Topbar title="Colis introuvable" />
        <div className="app-content">
          <button className={styles.back} onClick={() => navigate(paths.colis)}>
            <i className="bi bi-arrow-left" /> Retour aux colis
          </button>
          <Card>
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
              Aucun colis ne correspond à l'identifiant « {id} ».
            </div>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Topbar title="Détail du colis" subtitle={pkg.trackingCode} />

      <div className="app-content">
        <button className={styles.back} onClick={() => navigate(paths.colis)}>
          <i className="bi bi-arrow-left" /> Retour aux colis
        </button>

        <div className={styles.grid}>
          {/* Suivi */}
          <Card title="Suivi de l'expédition">
            <div className={styles.body}>
              <div className={styles.headline}>
                <span className={styles.code}>{pkg.trackingCode}</span>
                <StatusBadge status={pkg.status} />
              </div>
              <div className={styles.route}>
                {pkg.destination} · {pkg.via}
              </div>

              <ul className={styles.timeline}>
                {pkg.steps.map((step, i) => (
                  <li key={i} className={styles.step}>
                    <div
                      className={`${styles.dot} ${step.done ? styles.dotDone : styles.dotPending}`}
                    >
                      <i className={`bi ${step.done ? 'bi-check-lg' : 'bi-clock'}`} />
                    </div>
                    <div>
                      <div className={styles.stepLabel}>{step.label}</div>
                      <div className={styles.stepMeta}>
                        {step.location} · {step.date}
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
                  <span>Client</span>
                  <strong>{pkg.client}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Téléphone</span>
                  <strong>{pkg.phone}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Expéditeur</span>
                  <strong>{pkg.sender}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Poids</span>
                  <strong>{pkg.weightKg} kg</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Montant</span>
                  <strong>{pkg.price}</strong>
                </div>
              </div>
            </Card>

            <Card title="Actions">
              <div className={styles.actions}>
                <button className={styles.actionBtn}>
                  <i className={`bi bi-whatsapp ${styles.whatsapp}`} /> Notifier par WhatsApp
                </button>
                <button className={styles.actionBtn}>
                  <i className={`bi bi-envelope ${styles.mail}`} /> Envoyer un email
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
