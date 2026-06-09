import { Avatar } from '@/components/atoms/Avatar'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { clients } from '@/data/app'
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
  return (
    <>
      <Topbar title="Clients" subtitle={`${clients.length} clients enregistrés`} />

      <div className="app-content">
        <Card>
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
                <tr key={c.id}>
                  <td>
                    <div className={styles.client}>
                      <Avatar initials={initials(c.name)} />
                      <span className={styles.name}>{c.name}</span>
                    </div>
                  </td>
                  <td>{c.phone}</td>
                  <td>{c.city}</td>
                  <td>
                    <span className={styles.count}>{c.packagesCount}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  )
}
