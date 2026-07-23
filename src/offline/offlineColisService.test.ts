import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as colisApi from '@/services/colisApi'
import type { ColisReponse } from '@/services/colisApi'

const { dbMock } = vi.hoisted(() => ({
  dbMock: {
    statutQueue: { add: vi.fn() },
    colisLocal: { add: vi.fn(), get: vi.fn() },
  },
}))

vi.mock('./db', () => ({ db: dbMock }))
vi.mock('./quota', () => ({ verifierQuota: vi.fn() }))

import { estErreurReseau, mettreAJourStatutResilient, retirerColisResilient } from './offlineColisService'

function setOnline(value: boolean) {
  Object.defineProperty(navigator, 'onLine', { value, configurable: true })
}

function colis(overrides: Partial<ColisReponse> = {}): ColisReponse {
  return {
    id: 1,
    uuid: 'uuid-1',
    codeTracking: 'TRA-2026-AB12CD',
    agenceOrigineId: 1,
    agenceOrigineNom: 'Paris',
    agenceRetraitId: 2,
    agenceRetraitNom: 'Kinshasa',
    expediteurNom: 'Jean',
    expediteurTelephone: null,
    expediteurEmail: null,
    destinataireNom: 'Marie',
    destinataireTelephone: null,
    destinataireEmail: null,
    destinataireAdresse: null,
    destinataireVille: null,
    description: null,
    poids: null,
    statutActuel: 'RETIRE',
    localId: null,
    version: 2,
    dateCreation: '2026-01-01T00:00:00',
    historique: [],
    ...overrides,
  }
}

describe('estErreurReseau', () => {
  it('treats a TypeError (fetch failure) as a network error', () => {
    expect(estErreurReseau(new TypeError('Failed to fetch'))).toBe(true)
  })

  it('does not treat a business/HTTP error as a network error', () => {
    expect(estErreurReseau(new Error('Erreur 400'))).toBe(false)
  })
})

describe('mettreAJourStatutResilient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    dbMock.statutQueue.add.mockReset()
    setOnline(true)
  })

  it('calls the server directly and returns mode "server" when online', async () => {
    const updated = colis()
    vi.spyOn(colisApi, 'mettreAJourStatut').mockResolvedValue(updated)

    const resultat = await mettreAJourStatutResilient(1, 1, 'RETIRE', 'ok')

    expect(colisApi.mettreAJourStatut).toHaveBeenCalledWith(1, 'RETIRE', undefined, 'ok')
    expect(resultat).toEqual({ mode: 'server', colis: updated })
    expect(dbMock.statutQueue.add).not.toHaveBeenCalled()
  })

  it('falls back to the local queue when the network call fails with a network error', async () => {
    vi.spyOn(colisApi, 'mettreAJourStatut').mockRejectedValue(new TypeError('Failed to fetch'))

    const resultat = await mettreAJourStatutResilient(1, 1, 'RETIRE')

    expect(resultat).toEqual({ mode: 'local' })
    expect(dbMock.statutQueue.add).toHaveBeenCalledWith(
      expect.objectContaining({ serverColisId: 1, statut: 'RETIRE', baseVersion: 1, syncStatus: 'pending' }),
    )
  })

  it('re-throws business errors (e.g. HTTP 4xx) instead of queueing them', async () => {
    vi.spyOn(colisApi, 'mettreAJourStatut').mockRejectedValue(new Error('Erreur 409'))

    await expect(mettreAJourStatutResilient(1, 1, 'RETIRE')).rejects.toThrow('Erreur 409')
    expect(dbMock.statutQueue.add).not.toHaveBeenCalled()
  })

  it('queues directly without a network call when offline', async () => {
    setOnline(false)
    vi.spyOn(colisApi, 'mettreAJourStatut')

    const resultat = await mettreAJourStatutResilient(1, 1, 'RETIRE')

    expect(colisApi.mettreAJourStatut).not.toHaveBeenCalled()
    expect(resultat).toEqual({ mode: 'local' })
    expect(dbMock.statutQueue.add).toHaveBeenCalled()
  })
})

describe('retirerColisResilient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    dbMock.statutQueue.add.mockReset()
    setOnline(true)
  })

  it('calls the server directly and returns mode "server" when online', async () => {
    const updated = colis()
    vi.spyOn(colisApi, 'retirerColis').mockResolvedValue(updated)

    const resultat = await retirerColisResilient(1, 'TRA-2026-AB12CD', 1)

    expect(colisApi.retirerColis).toHaveBeenCalledWith('TRA-2026-AB12CD')
    expect(resultat).toEqual({ mode: 'server', colis: updated })
  })

  it('falls back to the local queue on a network error', async () => {
    vi.spyOn(colisApi, 'retirerColis').mockRejectedValue(new TypeError('Failed to fetch'))

    const resultat = await retirerColisResilient(1, 'TRA-2026-AB12CD', 1)

    expect(resultat).toEqual({ mode: 'local' })
    expect(dbMock.statutQueue.add).toHaveBeenCalledWith(
      expect.objectContaining({ serverColisId: 1, codeTracking: 'TRA-2026-AB12CD', statut: 'RETIRE' }),
    )
  })
})
