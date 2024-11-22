import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Login from '../pages/Login'
import Register from '../pages/Register'
import { useAuth } from '../hooks/useAuth'

// Mock useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn()
}))

describe('Authentication Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  describe('Login Component', () => {
    it('should render login form', () => {
      const mockUseAuth = useAuth as jest.Mock
      mockUseAuth.mockReturnValue({
        signIn: vi.fn(),
        signInWithMagicLink: vi.fn(),
        isLoading: false
      })

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      )

      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('should handle login submission', async () => {
      const mockSignIn = vi.fn()
      const mockUseAuth = useAuth as jest.Mock
      mockUseAuth.mockReturnValue({
        signIn: mockSignIn,
        signInWithMagicLink: vi.fn(),
        isLoading: false
      })

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      )

      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' }
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'Password123!' }
      })
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'Password123!')
      })
    })

    it('should handle magic link submission', async () => {
      const mockSignInWithMagicLink = vi.fn()
      const mockUseAuth = useAuth as jest.Mock
      mockUseAuth.mockReturnValue({
        signIn: vi.fn(),
        signInWithMagicLink: mockSignInWithMagicLink,
        isLoading: false
      })

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      )

      // Click magic link option if it exists
      const magicLinkButton = screen.getByText(/sign in with magic link/i)
      fireEvent.click(magicLinkButton)

      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' }
      })
      fireEvent.click(screen.getByRole('button', { name: /send magic link/i }))

      await waitFor(() => {
        expect(mockSignInWithMagicLink).toHaveBeenCalledWith('test@example.com')
      })
    })
  })

  describe('Register Component', () => {
    it('should render register form', () => {
      const mockUseAuth = useAuth as jest.Mock
      mockUseAuth.mockReturnValue({
        signUp: vi.fn(),
        isLoading: false
      })

      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      )

      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
    })

    it('should handle registration submission', async () => {
      const mockSignUp = vi.fn()
      const mockUseAuth = useAuth as jest.Mock
      mockUseAuth.mockReturnValue({
        signUp: mockSignUp,
        isLoading: false
      })

      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      )

      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' }
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'Password123!' }
      })
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'Password123!')
      })
    })

    it('should validate password requirements', async () => {
      const mockSignUp = vi.fn()
      const mockUseAuth = useAuth as jest.Mock
      mockUseAuth.mockReturnValue({
        signUp: mockSignUp,
        isLoading: false
      })

      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      )

      // Try with weak password
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' }
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'weak' }
      })
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
      })
    })
  })
})
