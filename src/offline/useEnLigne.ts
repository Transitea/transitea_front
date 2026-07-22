import { useEffect, useState } from 'react'

const URL_SONDAGE = '/api/actuator/health'
const TIMEOUT_SONDAGE_MS = 4000
const INTERVALLE_SONDAGE_MS = 20000

/**
 * navigator.onLine seul n'est pas fiable (peut rester à true en mode avion
 * selon les adaptateurs réseau actifs sur certaines configurations) : on le
 * confirme par un vrai appel réseau court plutôt que de lui faire confiance
 * aveuglément.
 */
async function sondageConnexion(): Promise<boolean> {
  if (!navigator.onLine) return false

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_SONDAGE_MS)
  try {
    await fetch(URL_SONDAGE, { method: 'GET', signal: controller.signal, cache: 'no-store' })
    return true
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Statut de connectivité réel (pas seulement navigator.onLine), partagé
 * entre le dashboard et le SyncProvider. Vérifié au montage, à chaque
 * événement 'online' du navigateur (pour le confirmer, pas juste le
 * croire), et périodiquement pour rattraper les cas où le navigateur ne
 * signale pas correctement la perte/le retour de connexion.
 */
export function useEnLigne(): boolean {
  const [enLigne, setEnLigne] = useState(navigator.onLine)

  useEffect(() => {
    let annule = false

    const verifier = async () => {
      const reel = await sondageConnexion()
      if (!annule) setEnLigne(reel)
    }

    verifier()

    const onOnline = () => verifier()
    const onOffline = () => setEnLigne(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    const intervalle = window.setInterval(verifier, INTERVALLE_SONDAGE_MS)

    return () => {
      annule = true
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      window.clearInterval(intervalle)
    }
  }, [])

  return enLigne
}
