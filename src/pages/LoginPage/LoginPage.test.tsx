import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'
import { AuthProvider } from '@/auth/AuthContext'
import * as authApi from '@/services/authApi'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

function renderPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('submits the entered credentials and stores the returned tokens on success', async () => {
    const user = userEvent.setup()
    vi.spyOn(authApi, 'login').mockResolvedValue({
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
        telephone: '123',
        role: 'AGENT',
        statut: 'ACTIF',
        agenceId: 1,
        agenceNom: 'Paris',
      },
    })

    renderPage()

    await user.type(screen.getByLabelText('Adresse email'), 'jane@example.com')
    await user.type(screen.getByLabelText('Mot de passe'), 'Secret123!')
    await user.click(screen.getByRole('button', { name: /se connecter/i }))

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith('jane@example.com', 'Secret123!')
    })
    expect(localStorage.getItem('transitea_access')).toBe('access-1')
  })

  it('shows an error message when the login call fails', async () => {
    const user = userEvent.setup()
    vi.spyOn(authApi, 'login').mockRejectedValue(new Error('Identifiants invalides'))

    renderPage()

    await user.type(screen.getByLabelText('Adresse email'), 'jane@example.com')
    await user.type(screen.getByLabelText('Mot de passe'), 'wrong')
    await user.click(screen.getByRole('button', { name: /se connecter/i }))

    expect(await screen.findByText('Identifiants invalides')).toBeInTheDocument()
    expect(localStorage.getItem('transitea_access')).toBeNull()
  })
})
