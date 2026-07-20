import { useEffect, useState } from 'react'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { listerNotifications, type NotificationReponse } from '@/services/notificationApi'
import styles from './NotificationsPage.module.css'

function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} · ${pad(d.getHours())}h${pad(d.getMinutes())}`
}

function tone(n: NotificationReponse): 'green' | 'red' | 'gold' {
  if (n.statut === 'ENVOYE') return 'green'
  if (n.statut === 'ECHEC') return 'red'
  return 'gold'
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationReponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listerNotifications({ taille: 50 })
      .then((page) => setNotifications(page.contenu))
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [])

  const echecs = notifications.filter((n) => n.statut === 'ECHEC').length

  return (
    <>
      <Topbar
        title="Notifications"
        subtitle={loading ? 'Chargement…' : `${notifications.length} envoyée(s) · ${echecs} en échec`}
      />

      <div className="app-content">
        <Card>
          {error && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--red, #dc2626)' }}>{error}</div>
          )}
          {!error && notifications.map((n) => (
            <div key={n.id} className={styles.item}>
              <div className={`${styles.dot} ${styles[tone(n)]}`}>
                <i className={`bi ${n.typeCanal === 'WHATSAPP' ? 'bi-whatsapp' : 'bi-envelope'}`} />
              </div>
              <div className={styles.text}>
                <div className={styles.title}>
                  Colis {n.codeTracking} · {n.cible === 'DESTINATAIRE' ? 'Destinataire' : 'Expéditeur'}
                </div>
                <div className={styles.meta}>
                  {n.destinataireContact} · {n.typeCanal === 'WHATSAPP' ? 'WhatsApp' : 'E-mail'} · {formatDate(n.dateCreation)}
                  {n.statut === 'ECHEC' ? ' · Échec d’envoi' : ''}
                </div>
              </div>
            </div>
          ))}
          {!loading && !error && notifications.length === 0 && (
            <div className={styles.empty}>Aucune notification pour le moment.</div>
          )}
        </Card>
      </div>
    </>
  )
}
