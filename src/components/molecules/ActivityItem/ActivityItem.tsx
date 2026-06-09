import styles from './ActivityItem.module.css'

export interface ActivityItemProps {
  icon: string
  tone: 'gold' | 'blue' | 'green'
  text: string
  meta: string
}

export function ActivityItem({ icon, tone, text, meta }: ActivityItemProps) {
  return (
    <div className={styles.item}>
      <div className={`${styles.dot} ${styles[tone]}`}>
        <i className={`bi ${icon}`} style={{ fontSize: 15 }} />
      </div>
      <div className={styles.text}>
        <p>{text}</p>
        <span>{meta}</span>
      </div>
    </div>
  )
}
