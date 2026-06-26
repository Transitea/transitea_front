import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { FormField } from '@/components/molecules/FormField'
import { creerColis } from '@/services/colisApi'
import { paths } from '@/router/paths'
import styles from './NouveauColisPage.module.css'

const initialState = {
  expediteurNom: '',
  expediteurTelephone: '',
  destinataireNom: '',
  destinataireTelephone: '',
  destinataireVille: '',
  destinataireAdresse: '',
  description: '',
  poids: '',
}

export function NouveauColisPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (field: keyof typeof initialState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await creerColis({
        expediteurNom: form.expediteurNom,
        expediteurTelephone: form.expediteurTelephone || undefined,
        destinataireNom: form.destinataireNom,
        destinataireTelephone: form.destinataireTelephone || undefined,
        destinataireVille: form.destinataireVille || undefined,
        destinataireAdresse: form.destinataireAdresse || undefined,
        description: form.description || undefined,
        poids: form.poids ? Number(form.poids) : undefined,
      })
      navigate(paths.colis)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Topbar title="Nouveau colis" subtitle="Enregistrer une nouvelle expédition" />

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
                placeholder="+243 …"
                value={form.expediteurTelephone}
                onChange={(e) => update('expediteurTelephone', e.target.value)}
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
                id="destinataireVille"
                label="Ville de destination"
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
