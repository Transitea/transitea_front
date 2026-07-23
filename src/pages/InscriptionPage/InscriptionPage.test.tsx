import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { InscriptionPage } from './InscriptionPage'
import { AuthProvider } from '@/auth/AuthContext'
import * as authApi from '@/services/authApi'
import * as agenceApi from '@/services/agenceApi'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

function renderPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <InscriptionPage />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('InscriptionPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    vi.spyOn(agenceApi, 'listerAgences').mockResolvedValue([
      { id: 1, uuid: 'a-1', nom: 'Agence Paris', ville: 'Paris', adresse: null, enseigneId: 1, dateCreation: '2026-01-01' },
    ])
  })

  it('blocks submission with an explicit error when no agence is selected', async () => {
    const user = userEvent.setup()
    vi.spyOn(authApi, 'register')

    renderPage()

    await screen.findByRole('option', { name: 'Agence Paris (Paris)' })
    await user.type(screen.getByLabelText('Prénom'), 'Jane')
    await user.type(screen.getByLabelText('Nom'), 'Doe')
    await user.type(screen.getByLabelText('Adresse email'), 'jane@example.com')
    await user.type(screen.getByLabelText('Mot de passe'), 'Secret123!')

    // Le champ agence porte l'attribut HTML `required` : un clic normal sur le
    // bouton serait bloqué par la validation native du navigateur avant même
    // d'atteindre le handler JS. On déclenche donc directement l'événement
    // `submit` pour exercer le garde-fou applicatif (`if (!form.agenceId)`).
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i })
    fireEvent.submit(submitButton.closest('form')!)

    expect(await screen.findByText('Sélectionnez votre agence')).toBeInTheDocument()
    expect(authApi.register).not.toHaveBeenCalled()
  })

  it('registers with the selected agence and stores the returned tokens', async () => {
    const user = userEvent.setup()
    vi.spyOn(authApi, 'register').mockResolvedValue({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      typeToken: 'Bearer',
      expirationAccessMs: 900000,
      utilisateur: {
        id: 1,
        uuid: 'u-1',
        nom: 'Doe',
        prenom: 'Jane',
        email: 'jane@example.com',
        telephone: '',
        role: 'AGENT',
        statut: 'ACTIF',
        agenceId: 1,
        agenceNom: 'Agence Paris',
      },
    })

    renderPage()

    await screen.findByRole('option', { name: 'Agence Paris (Paris)' })
    await user.type(screen.getByLabelText('Prénom'), 'Jane')
    await user.type(screen.getByLabelText('Nom'), 'Doe')
    await user.type(screen.getByLabelText('Adresse email'), 'jane@example.com')
    await user.type(screen.getByLabelText('Mot de passe'), 'Secret123!')
    await user.selectOptions(screen.getByLabelText('Agence de rattachement'), 'Agence Paris (Paris)')
    await user.click(screen.getByRole('button', { name: /créer mon compte/i }))

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        nom: 'Doe',
        prenom: 'Jane',
        email: 'jane@example.com',
        telephone: undefined,
        motDePasse: 'Secret123!',
        agenceId: 1,
      })
    })
    expect(localStorage.getItem('transitea_access')).toBe('access-1')
  })
})
