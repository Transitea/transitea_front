import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { FormField } from '@/components/molecules/FormField'
import { useAuth } from '@/auth/AuthContext'
import { listerAgences, creerAgence, type AgenceReponse } from '@/services/agenceApi'
import styles from './AgencesPage.module.css'

const initialForm = { nom: '', ville: '', adresse: '' }

export function AgencesPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const [agences, setAgences] = useState<AgenceReponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const fetchAgences = () => {
    setLoading(true)
    listerAgences()
      .then(setAgences)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(fetchAgences, [])

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)
    try {
      await creerAgence({
        nom: form.nom,
        ville: form.ville,
        adresse: form.adresse || undefined,
      })
      setForm(initialForm)
      setFormOpen(false)
      fetchAgences()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erreur lors de la création')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Topbar
        title="Agences"
        subtitle={loading ? 'Chargement…' : `${agences.length} agence${agences.length > 1 ? 's' : ''} de l'enseigne`}
        actions={
          isAdmin && (
            <Button variant="primary" onClick={() => setFormOpen((v) => !v)}>
              <i className="bi bi-plus-lg" /> Nouvelle agence
            </Button>
          )
        }
      />

      <div className="app-content">
        {isAdmin && formOpen && (
          <Card title="Créer une agence">
            <form className={styles.form} onSubmit={handleCreate}>
              {formError && (
                <p style={{ color: 'var(--red, #dc2626)', margin: '0 0 8px', fontSize: 13 }}>{formError}</p>
              )}
              <div className={styles.formGrid}>
                <FormField
                  id="nom"
                  label="Nom de l'agence"
                  icon="bi-shop"
                  placeholder="Transitea Paris 18e"
                  value={form.nom}
                  onChange={(e) => setForm((p) => ({ ...p, nom: e.target.value }))}
                  required
                />
                <FormField
                  id="ville"
                  label="Ville"
                  icon="bi-geo-alt"
                  placeholder="Paris, Kinshasa…"
                  value={form.ville}
                  onChange={(e) => setForm((p) => ({ ...p, ville: e.target.value }))}
                  required
                />
                <FormField
                  id="adresse"
                  label="Adresse"
                  icon="bi-signpost-split"
                  placeholder="Adresse complète (optionnel)"
                  value={form.adresse}
                  onChange={(e) => setForm((p) => ({ ...p, adresse: e.target.value }))}
                />
              </div>
              <div className={styles.formFooter}>
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Création…' : <><i className="bi bi-check-lg" /> Créer l'agence</>}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {error && (
          <Card>
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--red, #dc2626)' }}>{error}</div>
          </Card>
        )}

        {!error && (
          <div className={styles.grid}>
            {agences.map((a) => (
              <div key={a.id} className={styles.card}>
                <div className={styles.head}>
                  <i className="bi bi-shop" />
                  <div className={styles.name}>{a.nom}</div>
                </div>
                <div className={styles.city}>
                  <i className="bi bi-geo-alt" /> {a.ville}
                </div>
                {a.adresse && <div className={styles.address}>{a.adresse}</div>}
              </div>
            ))}
          </div>
        )}

        {!loading && !error && agences.length === 0 && (
          <div className={styles.empty}>Aucune agence enregistrée pour votre enseigne.</div>
        )}
      </div>
    </>
  )
}
