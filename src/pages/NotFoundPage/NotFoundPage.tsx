import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { paths } from '@/router/paths'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.code}>
        4<span>0</span>4
      </div>
      <div className={styles.title}>Page introuvable</div>
      <div className={styles.text}>La page que vous cherchez n'existe pas ou a été déplacée.</div>
      <Button variant="primary" onClick={() => navigate(paths.dashboard)}>
        <i className="bi bi-house" /> Retour au tableau de bord
      </Button>
    </div>
  )
}
