import { Topbar } from '@/components/organisms/Topbar'
import { Card } from '@/components/molecules/Card'
import { FormField } from '@/components/molecules/FormField'
import { useAuth } from '@/auth/AuthContext'
import { ROLE_LABELS } from '@/services/authApi'
import styles from './ParametresPage.module.css'

interface ToggleRowProps {
  title: string
  description: string
  defaultChecked?: boolean
}

function ToggleRow({ title, description, defaultChecked }: ToggleRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.rowText}>
        <p>{title}</p>
        <span>{description}</span>
      </div>
      <label className={styles.toggle}>
        <input type="checkbox" defaultChecked={defaultChecked} />
        <span className={styles.slider} />
      </label>
    </div>
  )
}

export function ParametresPage() {
  const { user } = useAuth()

  return (
    <>
      <Topbar title="Paramètres" subtitle="Gérez votre compte et vos préférences" />

      <div className="app-content">
        <div className={styles.stack}>
          <Card title="Profil">
            <div className={styles.body}>
              <div className={styles.grid}>
                <FormField
                  id="name"
                  label="Nom complet"
                  icon="bi-person"
                  defaultValue={user ? `${user.prenom} ${user.nom}` : ''}
                />
                <FormField
                  id="role"
                  label="Rôle"
                  icon="bi-briefcase"
                  defaultValue={user ? ROLE_LABELS[user.role] : ''}
                  disabled
                />
                <FormField
                  id="agence"
                  label="Agence"
                  icon="bi-shop"
                  defaultValue={user?.agenceNom ?? 'Toutes les agences (enseigne)'}
                  disabled
                />
                <FormField
                  id="email2"
                  label="Email"
                  type="email"
                  icon="bi-envelope"
                  defaultValue={user?.email ?? ''}
                  disabled
                />
                <FormField
                  id="phone2"
                  label="Téléphone"
                  icon="bi-telephone"
                  defaultValue={user?.telephone ?? ''}
                  disabled
                />
              </div>
              <p className={styles.hint}>
                La modification du profil n'est pas encore disponible. Contactez votre administrateur pour toute mise à jour.
              </p>
            </div>
          </Card>

          <Card title="Synchronisation hors-ligne">
            <div className={styles.body}>
              <ToggleRow
                title="Mode hors-ligne"
                description="Continuer à enregistrer des colis sans connexion."
                defaultChecked
              />
              <ToggleRow
                title="Synchronisation automatique"
                description="Synchroniser dès que la connexion revient."
                defaultChecked
              />
              <ToggleRow
                title="Synchroniser en Wi-Fi uniquement"
                description="Limiter la consommation de données mobiles."
              />
            </div>
          </Card>

          <Card title="Notifications">
            <div className={styles.body}>
              <ToggleRow title="Notifications WhatsApp" description="Prévenir les clients par WhatsApp." defaultChecked />
              <ToggleRow title="Récapitulatif par email" description="Recevoir un résumé quotidien." defaultChecked />
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
