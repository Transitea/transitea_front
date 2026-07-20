import { Pill } from '@/components/atoms/Pill'
import { PALIER_LABELS, type EnseigneReponse } from '@/services/enseigneApi'
import styles from './EnseigneCard.module.css'

interface EnseigneCardProps {
  enseigne: EnseigneReponse
}

export function EnseigneCard({ enseigne }: EnseigneCardProps) {
  const pct = Math.min(100, Math.round(enseigne.pourcentageConsomme))
  const alerte = pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : 'ok'

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <h3>
          <i className="bi bi-building" /> {enseigne.nom}
        </h3>
        <Pill tone={enseigne.statut === 'ACTIF' ? 'success' : 'gold'} size="sm">
          {PALIER_LABELS[enseigne.palierAbonnement]}
        </Pill>
      </div>

      <div className={styles.row}>
        <span>Quota du mois</span>
        <strong>{enseigne.colisMoisCourant} / {enseigne.quotaColisMois} colis</strong>
      </div>

      <div className={styles.bar}>
        <div className={`${styles.barFill} ${styles[alerte]}`} style={{ width: `${pct}%` }} />
      </div>

      <div className={`${styles.note} ${styles[alerte]}`}>
        {pct}% du quota consommé
        {alerte === 'danger' && ' — quota atteint, dépassement facturé au colis'}
        {alerte === 'warning' && ' — seuil d’alerte 80% dépassé'}
      </div>
    </div>
  )
}
