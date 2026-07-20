import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { useAuth } from '@/auth/AuthContext'
import { login as apiLogin } from '@/services/authApi'
import { paths } from '@/router/paths'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await apiLogin(email, password)
      login(data.accessToken, data.refreshToken, data.utilisateur)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion échouée')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Panneau marque */}
      <aside className={styles.brand}>
        <div className={styles.logo}>
          <h1>
            Transi<span>tea</span>
          </h1>
          <p>Suivi de colis</p>
        </div>

        <div className={styles.pitch}>
          <h2>Gérez vos colis, même hors-ligne.</h2>
          <p>
            Suivez vos expéditions, notifiez vos clients par WhatsApp et mail, et synchronisez
            vos données dès que la connexion revient.
          </p>
          <ul className={styles.features}>
            <li>
              <i className="bi bi-wifi-off" /> Mode hors-ligne intégré
            </li>
            <li>
              <i className="bi bi-whatsapp" /> Notifications WhatsApp
            </li>
            <li>
              <i className="bi bi-geo-alt" /> Réseau d'agences France ↔ RDC
            </li>
          </ul>
        </div>

        <div className={styles.copyright}>© 2026 Transitea · Tous droits réservés</div>
      </aside>

      {/* Panneau formulaire */}
      <main className={styles.formSide}>
        <div className={styles.card}>
          <div className={styles.head}>
            <h2>Bon retour</h2>
            <p>Connectez-vous pour accéder à votre tableau de bord.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <FormField
              id="email"
              label="Adresse email"
              type="email"
              icon="bi-envelope"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormField
              id="password"
              label="Mot de passe"
              type="password"
              icon="bi-lock"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.row}>
              <label className={styles.remember}>
                <input type="checkbox" /> Se souvenir de moi
              </label>
            </div>

            <Button type="submit" variant="primary" className={styles.submit} disabled={loading}>
              {loading ? (
                'Connexion…'
              ) : (
                <><i className="bi bi-box-arrow-in-right" /> Se connecter</>
              )}
            </Button>
          </form>

          <div className={styles.footer}>
            <p>
              Pas encore de compte agent ?{' '}
              <Link className={styles.link} to={paths.inscription}>
                Créer un compte
              </Link>
            </p>
            <p>
              Responsable d'agence ou administrateur ?{' '}
              <a className={styles.link} href="mailto:support@transitea.com">
                Contactez le support
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
