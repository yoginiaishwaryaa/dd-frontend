import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Signup from '../pages/Signup'

// Mock the hooks
vi.mock('@/hooks/useAuth', () => ({
  useSignup: () => ({
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

describe('Signup Page', () => {
  // Verify all form fields and the submit button are rendered
  it('renders the signup form', () => {
    render(<Signup />, { wrapper })

    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create account/i })).toBeInTheDocument()
  })

  // Submit should be disabled until all required fields are valid
  it('has submit button disabled when form is empty', () => {
    render(<Signup />, { wrapper })

    const submitButton = screen.getByRole('button', { name: /Create account/i })
    expect(submitButton).toBeDisabled()
  })

  // Typing a short password should reveal the "at least 8 characters" hint
  it('shows password requirements when password is entered', async () => {
    const user = userEvent.setup()
    render(<Signup />, { wrapper })

    const passwordInput = screen.getByLabelText(/^Password$/i)

    await user.type(passwordInput, 'short')
    expect(screen.getByText(/At least 8 characters/i)).toBeInTheDocument()
  })

  // Matching passwords should show a "Passwords match" confirmation
  it('shows password match indicator when confirm password is entered', async () => {
    const user = userEvent.setup()
    render(<Signup />, { wrapper })

    const passwordInput = screen.getByLabelText(/^Password$/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)

    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')

    expect(screen.getByText(/Passwords match/i)).toBeInTheDocument()
  })

  // Mismatched passwords should show a "Passwords do not match" warning
  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup()
    render(<Signup />, { wrapper })

    const passwordInput = screen.getByLabelText(/^Password$/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)

    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'different')

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument()
  })

  // Filling all fields with valid data should enable the submit button
  it('enables submit button when form is valid', async () => {
    const user = userEvent.setup()
    render(<Signup />, { wrapper })

    const fullNameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/^Email$/i)
    const passwordInput = screen.getByLabelText(/^Password$/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)
    const submitButton = screen.getByRole('button', { name: /Create account/i })

    await user.type(fullNameInput, 'John Doe')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')

    expect(submitButton).not.toBeDisabled()
  })

  // Clicking the eye icon toggles between password and text input type
  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    render(<Signup />, { wrapper })

    const passwordInput = screen.getByLabelText(/^Password$/i)
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleButton = passwordInput.parentElement?.querySelector('button')
    if (toggleButton) {
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')

      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'password')
    }
  })

  // "Sign in" link should navigate to /login
  it('displays link to login page', () => {
    render(<Signup />, { wrapper })

    const loginLink = screen.getByRole('link', { name: /Sign in/i })
    expect(loginLink).toBeInTheDocument()
    expect(loginLink).toHaveAttribute('href', '/login')
  })
})
