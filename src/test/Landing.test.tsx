import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Landing from '../pages/Landing'

// Mock RippleCanvas since it involves canvas and animation frames
vi.mock('@/components/landing/RippleCanvas', () => ({
    RippleCanvas: () => <div data-testid="ripple-canvas" />
}))

// Wrapper component for tests
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
)

describe('Landing Page', () => {
    it('renders the navbar', () => {
        render(<Landing />, { wrapper })
        // Navbar has 'Delta' logo/text
        expect(screen.getAllByText(/Delta/i).length).toBeGreaterThan(0)
    })

    it('renders the hero section with tagline', () => {
        render(<Landing />, { wrapper })

        // Check for the main tagline
        expect(screen.getByText(/Reflecting every change, preserving every insight./i)).toBeInTheDocument()

        // Check for "Explore more" button
        expect(screen.getByRole('button', { name: /Explore more/i })).toBeInTheDocument()
    })

    it('renders the about section with key features', () => {
        render(<Landing />, { wrapper })

        // Check for section heading
        expect(screen.getByText(/Keep your docs real./i)).toBeInTheDocument()

        // Check for features
        expect(screen.getByText(/Instant Updates/i)).toBeInTheDocument()
        expect(screen.getByText(/Smart Alerts/i)).toBeInTheDocument()
        expect(screen.getByText(/Safe Merges/i)).toBeInTheDocument()
    })

    it('renders the footer with copyright info', () => {
        render(<Landing />, { wrapper })

        expect(screen.getByText(/© 2025 Delta. All rights reserved./i)).toBeInTheDocument()
    })
})
