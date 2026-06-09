import { Button } from '@/components/atoms/Button'
import { Pill } from '@/components/atoms/Pill'
import styles from './Topbar.module.css'

interface TopbarProps {
  title: string
  subtitle: string
  onNewPackage?: () => void
}

export function Topbar({ title, subtitle, onNewPackage }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.sub}>{subtitle}</div>
      </div>
      <div className={styles.right}>
        <Pill tone="success">Connecté · Synchro OK</Pill>
        <Button variant="primary" onClick={onNewPackage}>
          <i className="bi bi-plus-lg" /> Nouveau colis
        </Button>
      </div>
    </header>
  )
}
