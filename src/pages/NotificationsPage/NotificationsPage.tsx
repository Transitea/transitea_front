import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { notifications } from '@/data/app'
import styles from './NotificationsPage.module.css'

export function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <>
      <Topbar title="Notifications" subtitle={`${unreadCount} non lue(s)`} />

      <div className="app-content">
        <Card>
          {notifications.map((n) => (
            <div key={n.id} className={`${styles.item} ${!n.read ? styles.unread : ''}`}>
              <div className={`${styles.dot} ${styles[n.tone]}`}>
                <i className={`bi ${n.icon}`} />
              </div>
              <div className={styles.text}>
                <div className={styles.title}>{n.title}</div>
                <div className={styles.meta}>{n.meta}</div>
              </div>
              {!n.read && <div className={styles.badge} />}
            </div>
          ))}
        </Card>
      </div>
    </>
  )
}
