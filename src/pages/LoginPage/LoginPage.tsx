import { useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { Pill } from '@/components/atoms/Pill'
import { FormField } from '@/components/molecules/FormField'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // TODO: brancher l'authentification (API) plus tard
    console.log('Connexion', { email, password })
  }

  return (
    <div className={styles.page}>
      {/* Panneau marque */}
      <aside className={styles.brand}>
        <div className={styles.logo}>
          <h1>
            Transi<span>tea</span>
          </h1>
          <p>Suivi de colis · RDC</p>
        </div>

        <div className={styles.pitch}>
          <h2>Gérez vos colis, même hors-ligne.</h2>
          <p>
            Suivez vos expéditions à travers la RDC, notifiez vos clients par WhatsApp et
            synchronisez vos données dès que la connexion revient.
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
            <Pill tone="success">Connecté · Synchro OK</Pill>
            <h2 style={{ marginTop: 14 }}>Bon retour 👋</h2>
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
