import { Card } from '@/components/molecules/Card'
import { ActivityItem, type ActivityItemProps } from '@/components/molecules/ActivityItem'
import styles from './ActivityFeed.module.css'

interface ActivityFeedProps {
  items: ActivityItemProps[]
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card title="Activité récente">
      <div className={styles.list}>
        {items.map((item, i) => (
          <ActivityItem key={i} {...item} />
        ))}
      </div>
    </Card>
  )
}
