import { Navigate } from 'react-router-dom'

interface PublicRouteProps {
    children: React.ReactNode
    redirectIfAuthenticated?: boolean
}

/**
 * PublicRoute - For pages that should redirect authenticated users away
 * Example: Login and Signup pages should redirect to dashboard if already logged in
 * 
 * Note: Using simple localStorage check to avoid hanging on API calls
 */
export function PublicRoute({ children, redirectIfAuthenticated = false }: PublicRouteProps) {
    // Simple check using localStorage (tokens are stored there)
    const hasTokens = localStorage.getItem('access_token') || localStorage.getItem('token')

    // If we're checking for authentication and the user has tokens, redirect to repos
    if (redirectIfAuthenticated && hasTokens) {
        return <Navigate to="/repos" replace />
    }

    return <>{children}</>
}
