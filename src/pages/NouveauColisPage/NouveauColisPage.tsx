import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { STATUS_ORDER, STATUS_META } from '@/components/atoms/StatusBadge'
import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { FormField } from '@/components/molecules/FormField'
import { paths } from '@/router/paths'
import styles from './NouveauColisPage.module.css'

const initialState = {
  client: '',
  phone: '',
  destination: '',
  via: '',
  weight: '',
  price: '',
  status: 'ENREGISTRE',
}

export function NouveauColisPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialState)

  const update = (field: keyof typeof initialState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // TODO: enregistrer via l'API (et en file de synchro hors-ligne) plus tard.
    console.log('Nouveau colis', form)
    navigate(paths.colis)
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
            <div className={styles.grid}>
              <FormField
                id="client"
                label="Client"
                icon="bi-person"
                placeholder="Nom du client"
                value={form.client}
                onChange={(e) => update('client', e.target.value)}
                required
              />
              <FormField
                id="phone"
                label="Téléphone"
                icon="bi-telephone"
                placeholder="+243 …"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                required
              />
              <FormField
                id="destination"
                label="Destination"
                icon="bi-geo-alt"
                placeholder="Ville de destination"
                value={form.destination}
                onChange={(e) => update('destination', e.target.value)}
                required
              />
              <FormField
                id="via"
                label="Itinéraire"
                icon="bi-signpost-split"
                placeholder="direct / via …"
                value={form.via}
                onChange={(e) => update('via', e.target.value)}
              />
              <FormField
                id="weight"
                label="Poids (kg)"
                type="number"
                icon="bi-box"
                placeholder="0.0"
                value={form.weight}
                onChange={(e) => update('weight', e.target.value)}
              />
              <FormField
                id="price"
                label="Montant"
                icon="bi-cash"
                placeholder="0 FC"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
              />
              <div className={styles.full}>
                <label className={styles.label} htmlFor="status">
                  Statut initial
                </label>
                <select
                  id="status"
                  className={styles.select}
                  value={form.status}
                  onChange={(e) => update('status', e.target.value)}
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_META[s].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.footer}>
              <Button type="button" variant="ghost" onClick={() => navigate(paths.colis)}>
                Annuler
              </Button>
              <Button type="submit" variant="primary">
                <i className="bi bi-check-lg" /> Enregistrer le colis
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}
