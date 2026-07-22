import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { FormField } from '@/components/molecules/FormField'
import { SelectField } from '@/components/molecules/SelectField'
import { creerColisResilient } from '@/offline/offlineColisService'
import { listerAgencesResilient } from '@/offline/agenceCache'
import type { AgenceReponse } from '@/services/agenceApi'
import { useAuth } from '@/auth/AuthContext'
import { paths } from '@/router/paths'
import styles from './NouveauColisPage.module.css'

const initialState = {
  agenceOrigineId: '',
  agenceRetraitId: '',
  expediteurNom: '',
  expediteurTelephone: '',
  expediteurEmail: '',
  destinataireNom: '',
  destinataireTelephone: '',
  destinataireEmail: '',
  destinataireVille: '',
  destinataireAdresse: '',
  description: '',
  poids: '',
}

export function NouveauColisPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState(initialState)
  const [agences, setAgences] = useState<AgenceReponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listerAgencesResilient()
      .then((list) => {
        setAgences(list)
        // Présélectionne l'agence de dépôt avec celle de l'utilisateur connecté.
        if (user?.agenceId) {
          setForm((prev) => ({ ...prev, agenceOrigineId: String(user.agenceId) }))
        }
      })
      .catch(() => {
        setError(
          "Impossible de charger la liste des agences (ni en ligne, ni en cache local). "
          + 'Connectez-vous au réseau au moins une fois avant de pouvoir créer des colis hors-ligne.',
        )
      })
  }, [user])

  const update = (field: keyof typeof initialState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.agenceOrigineId || !form.agenceRetraitId) {
      setError("L'agence de dépôt et l'agence de retrait sont obligatoires")
      return
    }
    if (form.agenceOrigineId === form.agenceRetraitId) {
      setError("L'agence de retrait doit être différente de l'agence de dépôt")
      return
    }

    setLoading(true)
    try {
      const agenceOrigine = agences.find((a) => String(a.id) === form.agenceOrigineId)
      const agenceRetrait = agences.find((a) => String(a.id) === form.agenceRetraitId)

      const resultat = await creerColisResilient(
        {
          agenceOrigineId: Number(form.agenceOrigineId),
          agenceRetraitId: Number(form.agenceRetraitId),
          expediteurNom: form.expediteurNom,
          expediteurTelephone: form.expediteurTelephone || undefined,
          expediteurEmail: form.expediteurEmail || undefined,
          destinataireNom: form.destinataireNom,
          destinataireTelephone: form.destinataireTelephone || undefined,
          destinataireEmail: form.destinataireEmail || undefined,
          destinataireVille: form.destinataireVille || undefined,
          destinataireAdresse: form.destinataireAdresse || undefined,
          description: form.description || undefined,
          poids: form.poids ? Number(form.poids) : undefined,
        },
        { origine: agenceOrigine?.nom, retrait: agenceRetrait?.nom },
      )

      if (resultat.mode === 'local') {
        navigate(paths.colis, {
          state: { message: 'Colis enregistré localement : il sera synchronisé automatiquement dès le retour du réseau.' },
        })
      } else {
        navigate(paths.colis)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  const agenceOptions = agences.map((a) => ({ value: a.id, label: `${a.nom} (${a.ville})` }))

  return (
    <>
      <Topbar title="Nouveau colis" subtitle="Enregistrer un dépôt en agence" />

      <div className="app-content">
        <button className={styles.back} onClick={() => navigate(paths.colis)}>
          <i className="bi bi-arrow-left" /> Retour aux colis
        </button>

        <Card title="Informations du colis">
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && (
              <p style={{ color: 'var(--red, #dc2626)', margin: '0 0 8px', fontSize: 13 }}>{error}</p>
            )}
            <div className={styles.grid}>
              <SelectField
                id="agenceOrigineId"
                label="Agence de dépôt"
                icon="bi-shop"
                placeholder="Sélectionner l'agence de dépôt…"
                options={agenceOptions}
                value={form.agenceOrigineId}
                onChange={(e) => update('agenceOrigineId', e.target.value)}
                required
              />
              <SelectField
                id="agenceRetraitId"
                label="Agence de retrait"
                icon="bi-signpost-split"
                placeholder="Sélectionner l'agence de retrait…"
                options={agenceOptions}
                value={form.agenceRetraitId}
                onChange={(e) => update('agenceRetraitId', e.target.value)}
                required
              />
              <FormField
                id="expediteurNom"
                label="Expéditeur"
                icon="bi-person"
                placeholder="Nom de l'expéditeur"
                value={form.expediteurNom}
                onChange={(e) => update('expediteurNom', e.target.value)}
                required
              />
              <FormField
                id="expediteurTelephone"
                label="Téléphone expéditeur"
                icon="bi-telephone"
                placeholder="+33 …"
                value={form.expediteurTelephone}
                onChange={(e) => update('expediteurTelephone', e.target.value)}
              />
              <FormField
                id="expediteurEmail"
                label="Email expéditeur"
                type="email"
                icon="bi-envelope"
                placeholder="expediteur@exemple.com"
                value={form.expediteurEmail}
                onChange={(e) => update('expediteurEmail', e.target.value)}
              />
              <FormField
                id="destinataireNom"
                label="Destinataire"
                icon="bi-person-check"
                placeholder="Nom du destinataire"
                value={form.destinataireNom}
                onChange={(e) => update('destinataireNom', e.target.value)}
                required
              />
              <FormField
                id="destinataireTelephone"
                label="Téléphone destinataire"
                icon="bi-telephone"
                placeholder="+243 …"
                value={form.destinataireTelephone}
                onChange={(e) => update('destinataireTelephone', e.target.value)}
              />
              <FormField
                id="destinataireEmail"
                label="Email destinataire"
                type="email"
                icon="bi-envelope"
                placeholder="destinataire@exemple.com"
                value={form.destinataireEmail}
                onChange={(e) => update('destinataireEmail', e.target.value)}
              />
              <FormField
                id="destinataireVille"
                label="Ville du destinataire"
                icon="bi-geo-alt"
                placeholder="Lubumbashi, Goma…"
                value={form.destinataireVille}
                onChange={(e) => update('destinataireVille', e.target.value)}
              />
              <FormField
                id="destinataireAdresse"
                label="Adresse destinataire"
                icon="bi-signpost-split"
                placeholder="Adresse complète"
                value={form.destinataireAdresse}
                onChange={(e) => update('destinataireAdresse', e.target.value)}
              />
              <FormField
                id="poids"
                label="Poids (kg)"
                type="number"
                icon="bi-box"
                placeholder="0.0"
                value={form.poids}
                onChange={(e) => update('poids', e.target.value)}
              />
              <FormField
                id="description"
                label="Description"
                icon="bi-card-text"
                placeholder="Contenu du colis…"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
              />
            </div>

            <div className={styles.footer}>
              <Button type="button" variant="ghost" onClick={() => navigate(paths.colis)}>
                Annuler
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Enregistrement…' : <><i className="bi bi-check-lg" /> Enregistrer le colis</>}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}
