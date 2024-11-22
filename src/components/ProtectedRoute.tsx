import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && requireAuth && !user) {
      navigate(redirectTo)
    }
    // Redirect away from auth pages if already logged in
    if (!isLoading && !requireAuth && user) {
      navigate('/')
    }
  }, [user, isLoading, navigate, requireAuth, redirectTo])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // If we require auth and have a user, or don't require auth and don't have a user, render children
  if ((requireAuth && user) || (!requireAuth && !user)) {
    return <>{children}</>
  }

  // Otherwise render nothing while redirecting
  return null
}
