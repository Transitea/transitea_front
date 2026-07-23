import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UpdateStatusSheet } from './UpdateStatusSheet'
import type { PackageStatus } from '@/components/atoms/StatusBadge'

function setup(current: PackageStatus) {
  const onConfirm = vi.fn()
  const onClose = vi.fn()
  render(
    <UpdateStatusSheet
      trackingCode="TRA-2026-AB12CD"
      current={current}
      onConfirm={onConfirm}
      onClose={onClose}
    />,
  )
  return { onConfirm, onClose }
}

describe('UpdateStatusSheet', () => {
  it.each<PackageStatus>(['RETIRE', 'RETOUR_EXPEDITEUR'])(
    'shows a "Fermer" button instead of "Valider" for the terminal status %s',
    (status) => {
      setup(status)

      expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Valider' })).not.toBeInTheDocument()
      expect(screen.getByText(/aucune transition possible, ce statut est terminal/i)).toBeInTheDocument()
    },
  )

  it('calls onClose when "Fermer" is clicked for a terminal status', async () => {
    const user = userEvent.setup()
    const { onClose } = setup('RETIRE')

    await user.click(screen.getByRole('button', { name: 'Fermer' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it.each<PackageStatus>(['ENREGISTRE', 'EN_TRANSIT', 'ARRIVE_AGENCE', 'REFUSE'])(
    'shows a "Valider" button (enabled by default) for the non-terminal status %s',
    (status) => {
      setup(status)

      expect(screen.getByRole('button', { name: 'Valider' })).toBeEnabled()
      expect(screen.queryByRole('button', { name: 'Fermer' })).not.toBeInTheDocument()
    },
  )

  it('calls onConfirm with the selected status and comment for a non-terminal status', async () => {
    const user = userEvent.setup()
    const { onConfirm } = setup('ENREGISTRE')

    await user.click(screen.getByRole('button', { name: 'En transit' }))
    await user.type(screen.getByPlaceholderText(/reçu à l'agence/i), 'Bien reçu')
    await user.click(screen.getByRole('button', { name: 'Valider' }))

    expect(onConfirm).toHaveBeenCalledWith('EN_TRANSIT', 'Bien reçu')
  })
})
