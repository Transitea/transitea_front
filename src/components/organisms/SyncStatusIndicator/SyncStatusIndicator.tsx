import { Pill } from '@/components/atoms/Pill'
import { useSync } from '@/offline/SyncProvider'
import styles from './SyncStatusIndicator.module.css'

function formatHeure(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getHours())}h${pad(date.getMinutes())}`
}

/** Indicateur de synchronisation, monté une fois dans AppLayout (visible sur tout l'écran protégé). */
export function SyncStatusIndicator() {
  const {
    enLigne,
    syncing,
    colisEnAttente,
    statutsEnAttente,
    derniereSyncA,
    derniereErreur,
    synchroniserMaintenant,
  } = useSync()
  const enAttenteTotal = colisEnAttente + statutsEnAttente

  return (
    <div className={styles.wrapper} role="region" aria-label="Statut de synchronisation">
      <Pill tone={enLigne ? 'success' : 'gold'} size="sm">
        <i className={`bi ${enLigne ? 'bi-wifi' : 'bi-wifi-off'}`} /> {enLigne ? 'En ligne' : 'Hors ligne'}
      </Pill>

      {enAttenteTotal > 0 && (
        <Pill tone="gold" size="sm">
          <i className="bi bi-clock-history" /> {enAttenteTotal} en attente
        </Pill>
      )}

      <button
        type="button"
        className={styles.syncButton}
        onClick={synchroniserMaintenant}
        disabled={syncing || !enLigne}
        aria-label={
          syncing
            ? 'Synchronisation en cours…'
            : derniereSyncA
              ? `Dernière synchro à ${formatHeure(derniereSyncA)} — cliquer pour resynchroniser`
              : 'Synchroniser maintenant'
        }
        title={
          syncing
            ? 'Synchronisation en cours…'
            : derniereSyncA
              ? `Dernière synchro à ${formatHeure(derniereSyncA)} — cliquer pour resynchroniser`
              : 'Synchroniser maintenant'
        }
      >
        <i className={`bi bi-arrow-repeat ${syncing ? styles.spin : ''}`} />
      </button>

      {derniereErreur && <span className={styles.erreur}>{derniereErreur}</span>}
    </div>
  )
}
