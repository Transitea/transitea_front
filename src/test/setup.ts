import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// @testing-library/react's auto-cleanup only self-registers when it detects
// Vitest's `globals: true`; we keep globals off (to avoid touching the app's
// tsconfig types) so unmounting between tests is wired up explicitly here.
afterEach(() => cleanup())
