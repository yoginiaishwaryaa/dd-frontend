import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Landing from '../pages/Landing'

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
)

beforeEach(() => {
    class MockIntersectionObserver {
        observe = vi.fn()
        unobserve = vi.fn()
        disconnect = vi.fn()
    }
    window.IntersectionObserver = MockIntersectionObserver as any
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver as any)
})

describe('Landing Page', () => {
    it('renders the landing page with title and login button', () => {
        render(<Landing />, { wrapper })

        expect(screen.getByText(/Reflecting every change/i)).toBeInTheDocument()

        const loginLinks = screen.getAllByRole('link', { name: /Log in/i })
        expect(loginLinks.length).toBeGreaterThan(0)
        expect(loginLinks[0]).toHaveAttribute('href', '/login')
    })
})
