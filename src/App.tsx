import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Dashboard from '@/pages/Dashboard'
import Landing from '@/pages/Landing'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PublicRoute } from '@/components/auth/PublicRoute'
import { Toaster } from '@/components/shadcn/sonner'

import RepoList from '@/pages/RepoList'
import RepoSettings from '@/pages/RepoSettings'
import DriftEvents from '@/pages/DriftEvents'
import DriftEventDetail from '@/pages/DriftEventDetail'
import Notifications from '@/pages/Notifications'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />

        {/* Auth Routes - Redirect to repos if already authenticated */}
        <Route
          path="/login"
          element={
            <PublicRoute redirectIfAuthenticated>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute redirectIfAuthenticated>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected Routes - Require authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/repos"
          element={
            <ProtectedRoute>
              <RepoList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/repos/:repoId"
          element={
            <ProtectedRoute>
              <RepoSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/repos/:repoId/events"
          element={
            <ProtectedRoute>
              <DriftEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/repos/:repoId/events/:eventId"
          element={
            <ProtectedRoute>
              <DriftEventDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
