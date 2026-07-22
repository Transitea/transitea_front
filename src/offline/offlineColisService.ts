import { db, type ColisLocal } from './db'
import { verifierQuota } from './quota'
import {
  creerColis,
  mettreAJourStatut,
  retirerColis,
  type ColisReponse,
  type CreationColisPayload,
} from '@/services/colisApi'
import type { PackageStatus } from '@/components/atoms/StatusBadge'

/** Un fetch() qui n'atteint pas le réseau (offline, DNS, etc.) lève un TypeError. */
export function estErreurReseau(err: unknown): boolean {
  return err instanceof TypeError
}

export type ResultatCreationColis =
  | { mode: 'server'; colis: ColisReponse }
  | { mode: 'local'; colisLocal: ColisLocal }

/**
 * Tente une création en ligne ; bascule silencieusement sur la file locale
 * (IndexedDB) si le réseau n'est pas joignable ou si le navigateur est hors-ligne.
 * Les erreurs métier (validation, 4xx/5xx) ne sont jamais mises en file : elles
 * remontent normalement à l'appelant.
 */
export async function creerColisResilient(
  payload: CreationColisPayload,
  nomsAgences: { origine?: string; retrait?: string } = {},
): Promise<ResultatCreationColis> {
  if (navigator.onLine) {
    try {
      const colis = await creerColis(payload)
      return { mode: 'server', colis }
    } catch (err) {
      if (!estErreurReseau(err)) throw err
    }
  }

  const etatQuota = await verifierQuota()
  if (etatQuota.bloque) {
    throw new Error(
      'Stockage hors-ligne plein (2000 colis ou espace disque insuffisant) : synchronisez avant de continuer.',
    )
  }

  const maintenant = new Date().toISOString()
  const localId = await db.colisLocal.add({
    serverId: null,
    codeTracking: null,
    syncStatus: 'pending',
    canDelete: false,
    dateJournee: maintenant.slice(0, 10),
    dateCreation: maintenant,
    agenceOrigineId: payload.agenceOrigineId,
    agenceOrigineNom: nomsAgences.origine,
    agenceRetraitId: payload.agenceRetraitId,
    agenceRetraitNom: nomsAgences.retrait,
    expediteurNom: payload.expediteurNom,
    expediteurTelephone: payload.expediteurTelephone,
    expediteurEmail: payload.expediteurEmail,
    destinataireNom: payload.destinataireNom,
    destinataireTelephone: payload.destinataireTelephone,
    destinataireEmail: payload.destinataireEmail,
    destinataireAdresse: payload.destinataireAdresse,
    destinataireVille: payload.destinataireVille,
    description: payload.description,
    poids: payload.poids,
    statutActuel: 'ENREGISTRE',
  })

  const colisLocal = await db.colisLocal.get(localId)
  return { mode: 'local', colisLocal: colisLocal as ColisLocal }
}

export type ResultatMiseAJourStatut =
  | { mode: 'server'; colis: ColisReponse }
  | { mode: 'local' }

/**
 * Change le statut d'un colis déjà connu du serveur. En ligne : appel direct.
 * Hors-ligne (ou échec réseau) : mise en file, appliquée au prochain sync
 * (résolution de conflit Last-Write-Wins côté serveur si la version a changé).
 */
export async function mettreAJourStatutResilient(
  colisId: number,
  baseVersion: number,
  statut: PackageStatus,
  commentaire?: string,
): Promise<ResultatMiseAJourStatut> {
  if (navigator.onLine) {
    try {
      const colis = await mettreAJourStatut(colisId, statut, undefined, commentaire)
      return { mode: 'server', colis }
    } catch (err) {
      if (!estErreurReseau(err)) throw err
    }
  }

  await db.statutQueue.add({
    serverColisId: colisId,
    statut,
    commentaire,
    baseVersion,
    dateChangementClient: new Date().toISOString(),
    syncStatus: 'pending',
  })

  return { mode: 'local' }
}

export async function retirerColisResilient(
  colisId: number,
  codeTracking: string,
  baseVersion: number,
): Promise<ResultatMiseAJourStatut> {
  if (navigator.onLine) {
    try {
      const colis = await retirerColis(codeTracking)
      return { mode: 'server', colis }
    } catch (err) {
      if (!estErreurReseau(err)) throw err
    }
  }

  await db.statutQueue.add({
    serverColisId: colisId,
    codeTracking,
    statut: 'RETIRE',
    baseVersion,
    dateChangementClient: new Date().toISOString(),
    syncStatus: 'pending',
  })

  return { mode: 'local' }
}
