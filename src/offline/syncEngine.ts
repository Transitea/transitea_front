import { db } from './db'
import {
  syncUpload,
  syncDownload,
  type CreationColisPayload,
  type MiseAJourStatutSyncItemPayload,
} from '@/services/colisApi'

const CLE_DERNIERE_SYNC = 'lastSyncAt'
const MAX_PAR_BATCH = 100

export const EVENEMENT_SYNC_TERMINEE = 'transitea:sync-complete'

export interface ResumeSynchro {
  colisEnvoyes: number
  colisReussis: number
  colisEchecs: number
  statutsEnvoyes: number
  statutsReussis: number
  statutsConflits: number
  statutsEchecs: number
  colisRecus: number
}

let syncEnCours = false

async function obtenirDerniereSync(): Promise<string> {
  const entree = await db.syncMeta.get(CLE_DERNIERE_SYNC)
  return entree?.valeur ?? new Date(0).toISOString()
}

async function enregistrerDerniereSync(curseur: string): Promise<void> {
  await db.syncMeta.put({ cle: CLE_DERNIERE_SYNC, valeur: curseur })
}

/**
 * Exécute un cycle complet upload puis download (CDC 7.1/7.2). Verrouillé
 * (syncEnCours) pour éviter les exécutions concurrentes entre les différents
 * déclencheurs (connexion retrouvée, timer, bouton manuel, beforeunload).
 * Retourne null si déjà en cours ou hors-ligne — ce n'est pas une erreur.
 */
export async function runSync(): Promise<ResumeSynchro | null> {
  if (syncEnCours || !navigator.onLine) return null
  syncEnCours = true

  try {
    const colisEnAttente = await db.colisLocal
      .where('syncStatus')
      .equals('pending')
      .limit(MAX_PAR_BATCH)
      .toArray()
    const statutsEnAttente = await db.statutQueue
      .where('syncStatus')
      .equals('pending')
      .limit(MAX_PAR_BATCH)
      .toArray()

    let colisReussis = 0
    let colisEchecs = 0
    let statutsReussis = 0
    let statutsConflits = 0
    let statutsEchecs = 0

    if (colisEnAttente.length > 0 || statutsEnAttente.length > 0) {
      const colisPayload: CreationColisPayload[] = colisEnAttente.map((c) => ({
        agenceOrigineId: c.agenceOrigineId,
        agenceRetraitId: c.agenceRetraitId,
        expediteurNom: c.expediteurNom,
        expediteurTelephone: c.expediteurTelephone,
        expediteurEmail: c.expediteurEmail,
        destinataireNom: c.destinataireNom,
        destinataireTelephone: c.destinataireTelephone,
        destinataireEmail: c.destinataireEmail,
        destinataireAdresse: c.destinataireAdresse,
        destinataireVille: c.destinataireVille,
        description: c.description,
        poids: c.poids,
        localId: c.localId,
      }))

      const statutsPayload: MiseAJourStatutSyncItemPayload[] = statutsEnAttente.map((s) => ({
        colisId: s.serverColisId,
        localId: s.localColisId,
        nouveauStatut: s.statut,
        commentaire: s.commentaire,
        baseVersion: s.baseVersion,
        dateChangementClient: s.dateChangementClient,
      }))

      const reponse = await syncUpload({ colis: colisPayload, misesAJourStatut: statutsPayload })

      // Le serveur traite les listes dans l'ordre recu : correspondance par index.
      for (let i = 0; i < reponse.colisResultats.length; i++) {
        const resultat = reponse.colisResultats[i]
        const local = colisEnAttente[i]
        if (!local?.localId) continue

        if (resultat.succes) {
          colisReussis++
          await db.colisLocal.update(local.localId, {
            syncStatus: 'synced',
            codeTracking: resultat.codeTracking,
            canDelete: true,
            erreurSync: undefined,
          })
        } else {
          colisEchecs++
          await db.colisLocal.update(local.localId, {
            syncStatus: 'error',
            erreurSync: resultat.erreur ?? 'Echec de synchronisation',
          })
        }
      }

      for (let i = 0; i < reponse.statutResultats.length; i++) {
        const resultat = reponse.statutResultats[i]
        const item = statutsEnAttente[i]
        if (!item?.id) continue

        if (resultat.succes) {
          statutsReussis++
          await db.statutQueue.update(item.id, { syncStatus: 'synced' })
        } else if (resultat.conflit) {
          statutsConflits++
          await db.statutQueue.update(item.id, {
            syncStatus: 'error',
            erreurSync: resultat.erreur ?? 'Conflit de synchronisation',
          })
        } else {
          statutsEchecs++
          await db.statutQueue.update(item.id, {
            syncStatus: 'error',
            erreurSync: resultat.erreur ?? 'Echec de synchronisation',
          })
        }
      }
    }

    const depuis = await obtenirDerniereSync()
    const telechargement = await syncDownload(depuis)
    await enregistrerDerniereSync(telechargement.curseur)

    const resume: ResumeSynchro = {
      colisEnvoyes: colisEnAttente.length,
      colisReussis,
      colisEchecs,
      statutsEnvoyes: statutsEnAttente.length,
      statutsReussis,
      statutsConflits,
      statutsEchecs,
      colisRecus: telechargement.colis.length,
    }

    window.dispatchEvent(new CustomEvent(EVENEMENT_SYNC_TERMINEE, { detail: resume }))
    return resume
  } finally {
    syncEnCours = false
  }
}
