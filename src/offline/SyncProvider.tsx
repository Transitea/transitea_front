import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import { runSync, type ResumeSynchro } from './syncEngine'
import { purgerColisSynchronisesSiNecessaire } from './quota'
import { useEnLigne } from './useEnLigne'

const INTERVALLE_SYNC_MS = 15 * 60 * 1000

interface SyncContextValue {
  enLigne: boolean
  syncing: boolean
  colisEnAttente: number
  statutsEnAttente: number
  dernierResume: ResumeSynchro | null
  derniereSyncA: Date | null
  derniereErreur: string | null
  synchroniserMaintenant: () => Promise<void>
}

const SyncContext = createContext<SyncContextValue | undefined>(undefined)

/**
 * Déclencheurs de synchronisation (CDC 7.5) : connexion retrouvée, timer
 * périodique (15 min), bouton manuel (via le contexte) et fermeture de page.
 */
export function SyncProvider({ children }: { children: ReactNode }) {
  const enLigne = useEnLigne()
  const [syncing, setSyncing] = useState(false)
  const [dernierResume, setDernierResume] = useState<ResumeSynchro | null>(null)
  const [derniereSyncA, setDerniereSyncA] = useState<Date | null>(null)
  const [derniereErreur, setDerniereErreur] = useState<string | null>(null)

  const colisEnAttente = useLiveQuery(
    () => db.colisLocal.where('syncStatus').notEqual('synced').count(),
    [],
    0,
  )
  const statutsEnAttente = useLiveQuery(
    () => db.statutQueue.where('syncStatus').equals('pending').count(),
    [],
    0,
  )

  const synchroniserMaintenant = async () => {
    setSyncing(true)
    setDerniereErreur(null)
    try {
      const resume = await runSync()
      if (resume) {
        setDernierResume(resume)
        setDerniereSyncA(new Date())
      }
    } catch (err) {
      setDerniereErreur(err instanceof Error ? err.message : 'Erreur de synchronisation')
    } finally {
      setSyncing(false)
    }
  }

  // Purge nocturne + synchro au démarrage de l'application.
  useEffect(() => {
    purgerColisSynchronisesSiNecessaire().catch(() => {})
    synchroniserMaintenant()
  }, [])

  // Déclenchement automatique dès qu'une connexion est détectée.
  useEffect(() => {
    const onOnline = () => {
      synchroniserMaintenant()
    }
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [])

  // Synchronisation périodique toutes les 15 minutes si connecté.
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (navigator.onLine) synchroniserMaintenant()
    }, INTERVALLE_SYNC_MS)
    return () => window.clearInterval(timer)
  }, [])

  // Tentative best-effort avant fermeture de l'application.
  useEffect(() => {
    const onBeforeUnload = () => {
      runSync().catch(() => {})
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])

  return (
    <SyncContext.Provider
      value={{
        enLigne,
        syncing,
        colisEnAttente: colisEnAttente ?? 0,
        statutsEnAttente: statutsEnAttente ?? 0,
        dernierResume,
        derniereSyncA,
        derniereErreur,
        synchroniserMaintenant,
      }}
    >
      {children}
    </SyncContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSync() {
  const ctx = useContext(SyncContext)
  if (!ctx) throw new Error('useSync doit être utilisé dans un <SyncProvider>')
  return ctx
}
