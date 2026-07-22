import Dexie, { type EntityTable } from 'dexie'
import type { PackageStatus } from '@/components/atoms/StatusBadge'

export type SyncStatus = 'pending' | 'synced' | 'error'

/**
 * Colis créé hors-ligne, en attente (ou en cours) de synchronisation.
 * localId est la clé auto-incrémentée par Dexie — c'est le même identifiant
 * envoyé au backend comme `localId` pour la déduplication (cf. CreationColisRequete).
 */
export interface ColisLocal {
  localId?: number
  serverId: number | null
  codeTracking: string | null
  syncStatus: SyncStatus
  erreurSync?: string
  /** true une fois synchronisé avec succès : autorise le nettoyage nocturne. */
  canDelete: boolean
  dateJournee: string
  dateCreation: string
  agenceOrigineId: number
  agenceOrigineNom?: string
  agenceRetraitId: number
  agenceRetraitNom?: string
  expediteurNom: string
  expediteurTelephone?: string
  expediteurEmail?: string
  destinataireNom: string
  destinataireTelephone?: string
  destinataireEmail?: string
  destinataireAdresse?: string
  destinataireVille?: string
  description?: string
  poids?: number
  statutActuel: PackageStatus
}

/**
 * Changement de statut (ou retrait) mis en file hors-ligne. Cible soit un
 * colis déjà connu du serveur (serverColisId), soit un brouillon local pas
 * encore synchronisé (localColisId) — cf. MiseAJourStatutSyncItem cote backend.
 */
export interface StatutQueueItem {
  id?: number
  localColisId?: number
  serverColisId?: number
  codeTracking?: string
  statut: PackageStatus
  commentaire?: string
  baseVersion?: number
  dateChangementClient: string
  syncStatus: SyncStatus
  erreurSync?: string
}

export interface SyncMetaEntry {
  cle: string
  valeur: string
}

class TransiteaDB extends Dexie {
  colisLocal!: EntityTable<ColisLocal, 'localId'>
  statutQueue!: EntityTable<StatutQueueItem, 'id'>
  syncMeta!: EntityTable<SyncMetaEntry, 'cle'>

  constructor() {
    super('TransiteaDB')
    this.version(1).stores({
      colisLocal: '++localId, serverId, codeTracking, syncStatus, dateJournee',
      statutQueue: '++id, localColisId, serverColisId, syncStatus',
      syncMeta: 'cle',
    })
  }
}

export const db = new TransiteaDB()
