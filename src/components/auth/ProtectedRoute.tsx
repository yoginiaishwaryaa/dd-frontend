import { Navigate, useLocation } from 'react-router-dom'
import { useDashboardStats } from '@/hooks/useDashboard'

interface ProtectedRouteProps {
    children: React.ReactNode
}

/**
 * ProtectedRoute - Ensures user is authenticated before accessing protected pages
 * Uses the dashboard stats API call to verify authentication via cookies
 * Redirects to login if unauthenticated
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation()
    const { isLoading, error } = useDashboardStats()

    // Check if there's an authentication error
    if (error) {
        const errorMessage = (error as Error).message.toLowerCase()
        if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
            return <Navigate to="/login" state={{ from: location }} replace />
        }
    }

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-deep-navy flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-ocean-city border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    <p className="mt-4 text-glacial-salt">Loading...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
