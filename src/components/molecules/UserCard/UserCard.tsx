import { Avatar } from '@/components/atoms/Avatar'
import styles from './UserCard.module.css'

export interface UserCardProps {
  initials: string
  name: string
  role: string
}

export function UserCard({ initials, name, role }: UserCardProps) {
  return (
    <div className={styles.card}>
      <Avatar initials={initials} />
      <div className={styles.info}>
        <p>{name}</p>
        <span>{role}</span>
      </div>
    </div>
  )
}
