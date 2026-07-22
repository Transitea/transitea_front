import { useEffect, useState } from 'react'

/** Statut de connectivité réel du navigateur, partagé entre le dashboard et le SyncProvider. */
export function useEnLigne(): boolean {
  const [enLigne, setEnLigne] = useState(navigator.onLine)
  useEffect(() => {
    const onOnline = () => setEnLigne(true)
    const onOffline = () => setEnLigne(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])
  return enLigne
}
