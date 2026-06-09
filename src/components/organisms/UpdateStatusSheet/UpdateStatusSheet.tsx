import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { STATUS_ORDER, STATUS_META, type PackageStatus } from '@/components/atoms/StatusBadge'
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
  const [status, setStatus] = useState<PackageStatus>(current)
  const [comment, setComment] = useState('')

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} />
        <div className={styles.title}>Mettre à jour le statut</div>
        <div className={styles.sub}>{trackingCode}</div>

        <label className={styles.label}>Nouveau statut</label>
        <div className={styles.options}>
          {STATUS_ORDER.map((s) => (
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
          placeholder="Ex. reçu au dépôt de Kinshasa…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className={styles.footer}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="button" variant="primary" onClick={() => onConfirm(status, comment)}>
            <i className="bi bi-check-lg" /> Valider
          </Button>
        </div>
      </div>
    </div>
  )
}
