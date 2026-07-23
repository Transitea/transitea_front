import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ColisDetailPage } from './ColisDetailPage'
import * as colisApi from '@/services/colisApi'
import * as offlineColisService from '@/offline/offlineColisService'
import type { ColisReponse } from '@/services/colisApi'

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
    statutActuel: 'ARRIVE_AGENCE',
    localId: null,
    version: 1,
    dateCreation: '2026-01-01T00:00:00',
    historique: [],
    ...overrides,
  }
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/colis/1']}>
      <Routes>
        <Route path="/colis/:id" element={<ColisDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ColisDetailPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders without crashing when the response is missing `historique` (BUG-06 regression)', async () => {
    // Le endpoint de mise à jour de statut ne renvoie pas l'historique complet ;
    // avant le correctif, `.map()` sur `undefined` faisait planter la page.
    const sansHistorique = colis()
    delete (sansHistorique as Partial<ColisReponse>).historique
    vi.spyOn(colisApi, 'obtenirColis').mockResolvedValue(sansHistorique)

    renderPage()

    expect(await screen.findByText('Marie')).toBeInTheDocument()
    expect(screen.queryByText(/colis introuvable/i)).not.toBeInTheDocument()
  })

  it('renders the status history when present', async () => {
    const avecHistorique = colis({
      historique: [
        {
          id: 1,
          statut: 'ENREGISTRE',
          ancienStatut: null,
          localisation: 'Paris',
          commentaire: null,
          utilisateurId: 1,
          dateCreation: '2026-01-01T10:00:00',
        },
      ],
    })
    vi.spyOn(colisApi, 'obtenirColis').mockResolvedValue(avecHistorique)

    renderPage()

    expect(await screen.findByText('Enregistré')).toBeInTheDocument()
  })

  it('shows a not-found message on fetch failure instead of crashing', async () => {
    vi.spyOn(colisApi, 'obtenirColis').mockRejectedValue(new Error('Erreur 404'))

    renderPage()

    expect(await screen.findByText('Erreur 404')).toBeInTheDocument()
  })

  it('re-fetches and displays the updated colis after a status update', async () => {
    const user = userEvent.setup()
    const initial = colis({ statutActuel: 'ARRIVE_AGENCE' })
    const updated = colis({ statutActuel: 'RETIRE' })

    vi.spyOn(colisApi, 'obtenirColis').mockResolvedValueOnce(initial).mockResolvedValueOnce(updated)
    vi.spyOn(offlineColisService, 'mettreAJourStatutResilient').mockResolvedValue({
      mode: 'server',
      colis: updated,
    })

    renderPage()

    await screen.findByText('Marie')
    await user.click(screen.getByRole('button', { name: /mettre à jour le statut/i }))
    await user.click(screen.getByRole('button', { name: 'Retiré' }))
    await user.click(screen.getByRole('button', { name: 'Valider' }))

    await waitFor(() => {
      expect(offlineColisService.mettreAJourStatutResilient).toHaveBeenCalledWith(1, 1, 'RETIRE', undefined)
    })
    expect(colisApi.obtenirColis).toHaveBeenCalledTimes(2)
    expect(await screen.findByText('Retiré')).toBeInTheDocument()
  })

  it('re-fetches and displays the updated colis after a retrait action', async () => {
    const user = userEvent.setup()
    const initial = colis({ statutActuel: 'ARRIVE_AGENCE' })
    const updated = colis({ statutActuel: 'RETIRE' })

    vi.spyOn(colisApi, 'obtenirColis').mockResolvedValueOnce(initial).mockResolvedValueOnce(updated)
    vi.spyOn(offlineColisService, 'retirerColisResilient').mockResolvedValue({
      mode: 'server',
      colis: updated,
    })

    renderPage()

    await screen.findByText('Marie')
    await user.click(screen.getByRole('button', { name: /valider le retrait/i }))

    await waitFor(() => {
      expect(offlineColisService.retirerColisResilient).toHaveBeenCalledWith(1, 'TRA-2026-AB12CD', 1)
    })
    expect(colisApi.obtenirColis).toHaveBeenCalledTimes(2)
    expect(await screen.findByText('Retiré')).toBeInTheDocument()
  })
})
