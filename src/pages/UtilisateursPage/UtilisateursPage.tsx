import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { Pill } from '@/components/atoms/Pill'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { FormField } from '@/components/molecules/FormField'
import { SelectField } from '@/components/molecules/SelectField'
import { useAuth } from '@/auth/AuthContext'
import { ROLE_LABELS } from '@/services/authApi'
import { listerAgences, type AgenceReponse } from '@/services/agenceApi'
import {
  listerUtilisateurs,
  creerUtilisateur,
  mettreAJourStatutUtilisateur,
  type UtilisateurReponse,
} from '@/services/utilisateurApi'
import styles from './UtilisateursPage.module.css'

const initialForm = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  motDePasse: '',
  role: 'AGENT' as 'AGENT' | 'OPERATEUR',
  agenceId: '',
}

export function UtilisateursPage() {
  const { user } = useAuth()
  const [agences, setAgences] = useState<AgenceReponse[]>([])
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurReponse[]>([])
  const [filtreAgence, setFiltreAgence] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const estAdmin = user?.role === 'ADMIN'

  const fetchUtilisateurs = () => {
    if (!estAdmin) return
    setLoading(true)
    setError(null)
    listerUtilisateurs({ agenceId: filtreAgence ? Number(filtreAgence) : undefined, taille: 50 })
      .then((page) => setUtilisateurs(page.contenu))
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!estAdmin) return
    listerAgences().then(setAgences).catch(() => {})
  }, [estAdmin])

  useEffect(fetchUtilisateurs, [filtreAgence, estAdmin])

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!form.agenceId) {
      setFormError("L'agence de rattachement est obligatoire")
      return
    }

    setSubmitting(true)
    try {
      await creerUtilisateur({
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        telephone: form.telephone || undefined,
        motDePasse: form.motDePasse,
        role: form.role,
        agenceId: Number(form.agenceId),
      })
      setForm(initialForm)
      setFormOpen(false)
      fetchUtilisateurs()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erreur lors de la création')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleStatut = async (u: UtilisateurReponse) => {
    const nouveauStatut = u.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF'
    try {
      const updated = await mettreAJourStatutUtilisateur(u.id, nouveauStatut)
      setUtilisateurs((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    }
  }

  const agenceOptions = agences.map((a) => ({ value: a.id, label: `${a.nom} (${a.ville})` }))

  if (!estAdmin) {
    return (
      <>
        <Topbar title="Utilisateurs" />
        <div className="app-content">
          <Card>
            <div className={styles.empty}>
              <i className="bi bi-shield-lock" /> Cette page est réservée aux administrateurs.
            </div>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Topbar
        title="Utilisateurs"
        subtitle={loading ? 'Chargement…' : `${utilisateurs.length} compte${utilisateurs.length > 1 ? 's' : ''}`}
        actions={
          <Button variant="primary" onClick={() => setFormOpen((v) => !v)}>
            <i className="bi bi-person-plus" /> Nouvel utilisateur
          </Button>
        }
      />

      <div className="app-content">
        {formOpen && (
          <Card title="Créer un compte opérateur ou agent">
            <form className={styles.form} onSubmit={handleCreate}>
              {formError && (
                <p style={{ color: 'var(--red, #dc2626)', margin: '0 0 8px', fontSize: 13 }}>{formError}</p>
              )}
              <div className={styles.formGrid}>
                <FormField
                  id="nom"
                  label="Nom"
                  icon="bi-person"
                  value={form.nom}
                  onChange={(e) => setForm((p) => ({ ...p, nom: e.target.value }))}
                  required
                />
                <FormField
                  id="prenom"
                  label="Prénom"
                  icon="bi-person"
                  value={form.prenom}
                  onChange={(e) => setForm((p) => ({ ...p, prenom: e.target.value }))}
                  required
                />
                <FormField
                  id="email"
                  label="Email"
                  type="email"
                  icon="bi-envelope"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                />
                <FormField
                  id="telephone"
                  label="Téléphone"
                  icon="bi-telephone"
                  value={form.telephone}
                  onChange={(e) => setForm((p) => ({ ...p, telephone: e.target.value }))}
                />
                <FormField
                  id="motDePasse"
                  label="Mot de passe temporaire"
                  type="password"
                  icon="bi-lock"
                  placeholder="8 caractères minimum"
                  value={form.motDePasse}
                  onChange={(e) => setForm((p) => ({ ...p, motDePasse: e.target.value }))}
                  required
                />
                <SelectField
                  id="role"
                  label="Rôle"
                  icon="bi-briefcase"
                  options={[
                    { value: 'AGENT', label: ROLE_LABELS.AGENT },
                    { value: 'OPERATEUR', label: ROLE_LABELS.OPERATEUR },
                  ]}
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as 'AGENT' | 'OPERATEUR' }))}
                />
                <SelectField
                  id="agenceId"
                  label="Agence de rattachement"
                  icon="bi-shop"
                  placeholder="Sélectionner une agence…"
                  options={agenceOptions}
                  value={form.agenceId}
                  onChange={(e) => setForm((p) => ({ ...p, agenceId: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.formFooter}>
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Création…' : <><i className="bi bi-check-lg" /> Créer le compte</>}
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className={styles.filterRow}>
          <SelectField
            id="filtreAgence"
            label="Filtrer par agence"
            icon="bi-shop"
            placeholder="Toutes les agences"
            options={agenceOptions}
            value={filtreAgence}
            onChange={(e) => setFiltreAgence(e.target.value)}
          />
        </div>

        <Card>
          {error && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--red, #dc2626)' }}>{error}</div>
          )}
          {!error && (
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Agence</th>
                    <th>Statut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {utilisateurs.map((u) => (
                    <tr key={u.id}>
                      <td>{u.prenom} {u.nom}</td>
                      <td>{u.email}</td>
                      <td>{ROLE_LABELS[u.role]}</td>
                      <td>{u.agenceNom ?? '—'}</td>
                      <td>
                        <Pill tone={u.statut === 'ACTIF' ? 'success' : 'gold'} size="sm">
                          {u.statut === 'ACTIF' ? 'Actif' : 'Inactif'}
                        </Pill>
                      </td>
                      <td>
                        {u.role !== 'ADMIN' && (
                          <button className={styles.toggleBtn} onClick={() => toggleStatut(u)}>
                            {u.statut === 'ACTIF' ? 'Désactiver' : 'Activer'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && !error && utilisateurs.length === 0 && (
            <div className={styles.empty}>Aucun utilisateur ne correspond à ce filtre.</div>
          )}
        </Card>
      </div>
    </>
  )
}
