import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { paths } from '@/router/paths'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <div className={styles.code} aria-hidden="true">
        4<span>0</span>4
      </div>
      <h1 className={styles.title}>Page introuvable</h1>
      <p className={styles.text}>La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Button variant="primary" onClick={() => navigate(paths.dashboard)}>
        <i className="bi bi-house" /> Retour au tableau de bord
      </Button>
    </main>
  )
}
