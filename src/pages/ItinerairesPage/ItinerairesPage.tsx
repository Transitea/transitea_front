import { Pill } from '@/components/atoms/Pill'
import { Topbar } from '@/components/organisms/Topbar'
import { routes } from '@/data/app'
import styles from './ItinerairesPage.module.css'

export function ItinerairesPage() {
  return (
    <>
      <Topbar title="Itinéraires" subtitle={`${routes.length} trajets configurés`} />

      <div className="app-content">
        <div className={styles.grid}>
          {routes.map((r) => (
            <div key={r.id} className={styles.card}>
              <div className={styles.head}>
                <div className={styles.route}>
                  {r.from} <i className="bi bi-arrow-right" /> {r.to}
                </div>
                <Pill tone={r.active ? 'success' : 'gold'} size="sm">
                  {r.active ? 'Actif' : 'Suspendu'}
                </Pill>
              </div>
              <div className={styles.stops}>
                <i className="bi bi-signpost-2" />{' '}
                {r.stops.length ? `Étapes : ${r.stops.join(', ')}` : 'Trajet direct'}
              </div>
              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <strong>{r.distanceKm} km</strong>
                  <span>Distance</span>
                </div>
                <div className={styles.metaItem}>
                  <strong>
                    {r.durationDays} j{r.durationDays > 1 ? '' : ''}
                  </strong>
                  <span>Durée estimée</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
