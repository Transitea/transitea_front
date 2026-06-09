import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { useAuth } from '@/auth/AuthContext'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // TODO: brancher l'authentification (API) plus tard.
    // Pour l'instant on simule une connexion réussie.
    login('demo-token')
    navigate('/')
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
              <i className="bi bi-geo-alt" /> Itinéraires sur tout le territoire
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

            <div className={styles.row}>
              <label className={styles.remember}>
                <input type="checkbox" /> Se souvenir de moi
              </label>
              <a className={styles.link} href="#">
                Mot de passe oublié ?
              </a>
            </div>

            <Button type="submit" variant="primary" className={styles.submit}>
              <i className="bi bi-box-arrow-in-right" /> Se connecter
            </Button>
          </form>

          <div className={styles.footer}>
            Pas encore de compte ?{' '}
            <a className={styles.link} href="#">
              Contactez votre administrateur
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
