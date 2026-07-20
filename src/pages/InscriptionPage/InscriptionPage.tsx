import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { SelectField } from '@/components/molecules/SelectField'
import { useAuth } from '@/auth/AuthContext'
import { register as apiRegister } from '@/services/authApi'
import { listerAgences, type AgenceReponse } from '@/services/agenceApi'
import { paths } from '@/router/paths'
import styles from '../LoginPage/LoginPage.module.css'

const initialForm = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  motDePasse: '',
  agenceId: '',
}

export function InscriptionPage() {
  const [form, setForm] = useState(initialForm)
  const [agences, setAgences] = useState<AgenceReponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    listerAgences().then(setAgences).catch(() => {})
  }, [])

  const update = (field: keyof typeof initialForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.agenceId) {
      setError('Sélectionnez votre agence')
      return
    }

    setLoading(true)
    try {
      const data = await apiRegister({
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        telephone: form.telephone || undefined,
        motDePasse: form.motDePasse,
        agenceId: Number(form.agenceId),
      })
      login(data.accessToken, data.refreshToken, data.utilisateur)
      navigate(paths.dashboard)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inscription échouée')
    } finally {
      setLoading(false)
    }
  }

  const agenceOptions = agences.map((a) => ({ value: a.id, label: `${a.nom} (${a.ville})` }))

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
          <h2>Rejoignez votre agence sur Transitea.</h2>
          <p>
            Créez votre compte agent pour enregistrer des colis, notifier vos clients et suivre
            les retraits, même hors-ligne.
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
            <h2>Créer un compte agent</h2>
            <p>Renseignez vos informations et l'agence à laquelle vous êtes rattaché(e).</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <FormField
              id="prenom"
              label="Prénom"
              icon="bi-person"
              value={form.prenom}
              onChange={(e) => update('prenom', e.target.value)}
              required
            />
            <FormField
              id="nom"
              label="Nom"
              icon="bi-person"
              value={form.nom}
              onChange={(e) => update('nom', e.target.value)}
              required
            />
            <FormField
              id="email"
              label="Adresse email"
              type="email"
              icon="bi-envelope"
              placeholder="vous@exemple.com"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
            />
            <FormField
              id="telephone"
              label="Téléphone"
              icon="bi-telephone"
              placeholder="+243 …"
              value={form.telephone}
              onChange={(e) => update('telephone', e.target.value)}
            />
            <SelectField
              id="agenceId"
              label="Agence de rattachement"
              icon="bi-shop"
              placeholder="Sélectionner votre agence…"
              options={agenceOptions}
              value={form.agenceId}
              onChange={(e) => update('agenceId', e.target.value)}
              required
            />
            <FormField
              id="motDePasse"
              label="Mot de passe"
              type="password"
              icon="bi-lock"
              placeholder="8 caractères min., 1 majuscule, 1 chiffre, 1 spécial"
              value={form.motDePasse}
              onChange={(e) => update('motDePasse', e.target.value)}
              required
            />

            {error && <p className={styles.error}>{error}</p>}

            <Button type="submit" variant="primary" className={styles.submit} disabled={loading}>
              {loading ? (
                'Création du compte…'
              ) : (
                <><i className="bi bi-check-lg" /> Créer mon compte</>
              )}
            </Button>
          </form>

          <div className={styles.footer}>
            Déjà un compte ?{' '}
            <Link className={styles.link} to={paths.login}>
              Se connecter
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
