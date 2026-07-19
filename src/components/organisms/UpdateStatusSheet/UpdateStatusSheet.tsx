import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { STATUS_META, STATUS_TRANSITIONS, type PackageStatus } from '@/components/atoms/StatusBadge'
import styles from './UpdateStatusSheet.module.css'

interface UpdateStatusSheetProps {
  /** Code du colis concerné (affiché en sous-titre). */
  trackingCode: string
  /** Statut courant (présélectionné). */
  current: PackageStatus
  onConfirm: (status: PackageStatus, comment: string) => void
  onClose: () => void
}

export function UpdateStatusSheet({
  trackingCode,
  current,
  onConfirm,
  onClose,
}: UpdateStatusSheetProps) {
  // Seules les transitions autorisées par le backend (ValidateurTransitionStatut) sont proposées.
  const nextStatuses = STATUS_TRANSITIONS[current]
  const [status, setStatus] = useState<PackageStatus | null>(nextStatuses[0] ?? null)
  const [comment, setComment] = useState('')

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} />
        <div className={styles.title}>Mettre à jour le statut</div>
        <div className={styles.sub}>{trackingCode}</div>

        {nextStatuses.length === 0 ? (
          <p className={styles.label}>
            Statut actuel « {STATUS_META[current].label} » : aucune transition possible, ce statut est terminal.
          </p>
        ) : (
          <>
            <label className={styles.label}>Nouveau statut</label>
            <div className={styles.options}>
              {nextStatuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`${styles.option} ${status === s ? styles.optionActive : ''}`}
                  onClick={() => setStatus(s)}
                >
                  {STATUS_META[s].label}
                </button>
              ))}
            </div>

            <label className={styles.label} htmlFor="comment">
              Commentaire (optionnel)
            </label>
            <textarea
              id="comment"
              className={styles.comment}
              placeholder="Ex. reçu à l'agence de Kinshasa…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </>
        )}

        <div className={styles.footer}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={!status}
            onClick={() => status && onConfirm(status, comment)}
          >
            <i className="bi bi-check-lg" /> Valider
          </Button>
        </div>
      </div>
    </div>
  )
}
