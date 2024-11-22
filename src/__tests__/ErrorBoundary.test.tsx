import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ErrorBoundary from '../components/ErrorBoundary'

describe('ErrorBoundary', () => {
  const originalConsoleError = console.error
  beforeAll(() => {
    console.error = vi.fn()
  })

  afterAll(() => {
    console.error = originalConsoleError
  })

  it('should render children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    )

    expect(getByText('Test Content')).toBeInTheDocument()
  })

  it('should render error UI when there is an error', () => {
    const ThrowError = () => {
      throw new Error('Test error')
    }

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('should handle reload button click', () => {
    const originalLocation = window.location
    const reloadMock = vi.fn()
    delete window.location
    window.location = { ...originalLocation, reload: reloadMock }

    const ThrowError = () => {
      throw new Error('Test error')
    }

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    fireEvent.click(screen.getByText('Try again'))
    expect(reloadMock).toHaveBeenCalled()

    window.location = originalLocation
  })

  it('should handle go home button click', () => {
    const originalLocation = window.location
    delete window.location
    window.location = { ...originalLocation, href: '' }

    const ThrowError = () => {
      throw new Error('Test error')
    }

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    fireEvent.click(screen.getByText('Go back home'))
    expect(window.location.href).toBe('/')

    window.location = originalLocation
  })
})
