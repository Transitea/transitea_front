import { db } from './db'

const SEUIL_ALERTE = 1500
const SEUIL_BLOCAGE = 2000
const QUOTA_DISPONIBLE_MIN_POURCENT = 20
const CLE_DERNIERE_PURGE = 'dernierePurge'

export interface EtatQuota {
  colisEnAttente: number
  pourcentageUtiliseStockage: number | null
  alerte: boolean
  bloque: boolean
}

/** Cf. CDC 4.1.1/7.6 : alerte au-delà de 1500 colis en attente, blocage à 2000 ou si quota dispo < 20 %. */
export async function verifierQuota(): Promise<EtatQuota> {
  const colisEnAttente = await db.colisLocal.where('syncStatus').notEqual('synced').count()

  let pourcentageUtiliseStockage: number | null = null
  if (navigator.storage?.estimate) {
    const estimation = await navigator.storage.estimate()
    if (estimation.quota && estimation.usage !== undefined) {
      pourcentageUtiliseStockage = (estimation.usage / estimation.quota) * 100
    }
  }

  const quotaDisponibleFaible =
    pourcentageUtiliseStockage !== null && 100 - pourcentageUtiliseStockage < QUOTA_DISPONIBLE_MIN_POURCENT

  return {
    colisEnAttente,
    pourcentageUtiliseStockage,
    alerte: colisEnAttente > SEUIL_ALERTE,
    bloque: colisEnAttente >= SEUIL_BLOCAGE || quotaDisponibleFaible,
  }
}

/** Nettoyage nocturne (CDC 7.6) : supprime les brouillons synchronisés, une fois par jour maximum. */
export async function purgerColisSynchronisesSiNecessaire(): Promise<void> {
  const aujourdHui = new Date().toISOString().slice(0, 10)
  const entree = await db.syncMeta.get(CLE_DERNIERE_PURGE)
  if (entree?.valeur === aujourdHui) return

  await db.colisLocal
    .where('syncStatus')
    .equals('synced')
    .filter((c) => c.canDelete)
    .delete()

  await db.syncMeta.put({ cle: CLE_DERNIERE_PURGE, valeur: aujourdHui })
}
