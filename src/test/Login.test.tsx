import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Login from '../pages/Login'

// Mock the hooks
vi.mock('@/hooks/useAuth', () => ({
  useLogin: () => ({
    mutate: vi.fn(),
    isPending: false,
    error: null,
    reset: vi.fn(),
  }),
}))

// Wrapper component for tests
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Login Page', () => {
  // Verify all core form elements are rendered
  it('renders the login form', () => {
    render(<Login />, { wrapper })

    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument()
  })

  // Submit should be disabled until both fields are filled
  it('has submit button disabled when form is empty', () => {
    render(<Login />, { wrapper })

    const submitButton = screen.getByRole('button', { name: /Sign in/i })
    expect(submitButton).toBeDisabled()
  })

  // Typing valid email + password should enable the submit button
  it('enables submit button when form is filled', async () => {
    const user = userEvent.setup()
    render(<Login />, { wrapper })

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    expect(submitButton).not.toBeDisabled()
  })

  // Clicking the eye icon toggles between password and text input type
  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    render(<Login />, { wrapper })

    const passwordInput = screen.getByLabelText(/Password/i)
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleButton = passwordInput.parentElement?.querySelector('button')
    if (toggleButton) {
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')

      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'password')
    }
  })

  // "Sign up" link should navigate to /signup
  it('displays link to signup page', () => {
    render(<Login />, { wrapper })

    const signupLink = screen.getByRole('link', { name: /Sign up/i })
    expect(signupLink).toBeInTheDocument()
    expect(signupLink).toHaveAttribute('href', '/signup')
  })
})
