import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ScanPage } from './ScanPage'
import { extractCode } from './extractCode'
import * as colisApi from '@/services/colisApi'
import type { ColisReponse, PageReponse } from '@/services/colisApi'

// La caméra (html5-qrcode) n'est pas disponible en jsdom : le composant QrScanner
// n'est jamais monté dans ces tests (on ne clique pas sur "Ouvrir la caméra").
vi.mock('@/components/organisms/QrScanner', () => ({
  QrScanner: () => null,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

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
    statutActuel: 'ENREGISTRE',
    localId: null,
    version: 1,
    dateCreation: '2026-01-01T00:00:00',
    historique: [],
    ...overrides,
  }
}

function page(contenu: ColisReponse[]): PageReponse<ColisReponse> {
  return { contenu, pageCourante: 0, totalPages: 1, totalElements: contenu.length, taillePage: 20, dernierePage: true }
}

describe('extractCode', () => {
  it('accepts the real alphanumeric tracking-code format (TRA-YYYY-XXXXXX)', () => {
    expect(extractCode('TRA-2026-AB12CD')).toBe('TRA-2026-AB12CD')
  })

  it('is case-insensitive and normalizes to uppercase', () => {
    expect(extractCode('tra-2026-ab12cd')).toBe('TRA-2026-AB12CD')
  })

  it('extracts the code out of a surrounding URL', () => {
    expect(extractCode('https://transitea.com/suivi/TRA-2026-AB12CD')).toBe('TRA-2026-AB12CD')
  })

  it('does not truncate an alphanumeric suffix down to digits only', () => {
    // Un ancien bug n'acceptait que des chiffres : un suffixe comme "A1B2C3" ne doit pas être rejeté ni tronqué.
    expect(extractCode('TRA-2026-A1B2C3')).toBe('TRA-2026-A1B2C3')
  })

  it('falls back to the trimmed, uppercased raw text when no match is found', () => {
    expect(extractCode('  some-manual-code  ')).toBe('SOME-MANUAL-CODE')
  })
})

describe('ScanPage manual code entry', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('finds an alphanumeric-coded colis and routes based on its status', async () => {
    const user = userEvent.setup()
    const found = colis({ statutActuel: 'ENREGISTRE' })
    vi.spyOn(colisApi, 'rechercherColis').mockResolvedValue(page([found]))

    render(
      <MemoryRouter>
        <ScanPage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Code de suivi'), 'tra-2026-ab12cd')
    await user.click(screen.getByRole('button', { name: /accéder au colis/i }))

    await waitFor(() => {
      expect(colisApi.rechercherColis).toHaveBeenCalledWith('TRA-2026-AB12CD')
    })
    expect(screen.queryByText(/aucun colis trouvé/i)).not.toBeInTheDocument()
  })

  it('shows an error when no colis matches the extracted code', async () => {
    const user = userEvent.setup()
    vi.spyOn(colisApi, 'rechercherColis').mockResolvedValue(page([]))

    render(
      <MemoryRouter>
        <ScanPage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Code de suivi'), 'TRA-2026-AB12CD')
    await user.click(screen.getByRole('button', { name: /accéder au colis/i }))

    expect(await screen.findByText(/aucun colis trouvé pour « TRA-2026-AB12CD »/i)).toBeInTheDocument()
  })
})
