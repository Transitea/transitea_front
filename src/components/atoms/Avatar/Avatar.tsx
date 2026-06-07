import styles from './Avatar.module.css'

interface AvatarProps {
  /** Initiales affichées dans l'avatar, ex. "JM" */
  initials: string
}

export function Avatar({ initials }: AvatarProps) {
  return <div className={styles.avatar}>{initials}</div>
}
