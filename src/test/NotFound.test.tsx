import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import NotFound from '../pages/NotFound'

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
)

describe('NotFound Page', () => {
    it('renders the 404 page content', () => {
        render(<NotFound />, { wrapper })

        expect(screen.getByText('404')).toBeInTheDocument()
        expect(screen.getByText(/Page not found/i)).toBeInTheDocument()

        const dashboardLink = screen.getByRole('link', { name: /Dashboard/i })
        expect(dashboardLink).toBeInTheDocument()
        expect(dashboardLink).toHaveAttribute('href', '/dashboard')
    })
})
