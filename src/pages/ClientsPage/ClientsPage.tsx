import { useEffect, useState } from 'react'
import { Avatar } from '@/components/atoms/Avatar'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { listerClients, type ClientReponse } from '@/services/clientApi'
import styles from './ClientsPage.module.css'

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ClientsPage() {
  const [clients, setClients] = useState<ClientReponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listerClients({ taille: 100 })
      .then((page) => setClients(page.contenu))
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Topbar
        title="Clients"
        subtitle={loading ? 'Chargement…' : `${clients.length} client${clients.length > 1 ? 's' : ''} enregistrés`}
      />

      <div className="app-content">
        <Card>
          {error && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--red, #dc2626)' }}>{error}</div>
          )}
          {!error && (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Téléphone</th>
                  <th>Ville</th>
                  <th>Colis</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={`${c.nom}-${c.telephone}`}>
                    <td>
                      <div className={styles.client}>
                        <Avatar initials={initials(c.nom)} />
                        <span className={styles.name}>{c.nom}</span>
                      </div>
                    </td>
                    <td>{c.telephone ?? '—'}</td>
                    <td>{c.ville ?? '—'}</td>
                    <td>
                      <span className={styles.count}>{c.nombreColis}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && !error && clients.length === 0 && (
            <div className={styles.empty}>Aucun client pour le moment.</div>
          )}
        </Card>
      </div>
    </>
  )
}
