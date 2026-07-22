import { db } from './db'
import { listerAgences, type AgenceReponse } from '@/services/agenceApi'

const CLE_CACHE_AGENCES = 'agencesCache'

/**
 * Liste des agences avec repli sur le dernier resultat connu si hors-ligne
 * ou en cas d'echec reseau. Necessaire pour que le formulaire de creation de
 * colis reste utilisable sans connexion (cf. CDC : enregistrement de colis
 * hors-ligne) — sans agences disponibles, le formulaire est inexploitable
 * meme si la mise en file du colis lui-meme fonctionne.
 */
export async function listerAgencesResilient(): Promise<AgenceReponse[]> {
  try {
    const agences = await listerAgences()
    await db.syncMeta.put({ cle: CLE_CACHE_AGENCES, valeur: JSON.stringify(agences) })
    return agences
  } catch (err) {
    const cache = await db.syncMeta.get(CLE_CACHE_AGENCES)
    if (cache) {
      return JSON.parse(cache.valeur) as AgenceReponse[]
    }
    throw err
  }
}
