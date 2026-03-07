import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Dashboard from '@/pages/Dashboard'
import Landing from '@/pages/Landing'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PublicRoute } from '@/components/auth/PublicRoute'
import { Toaster } from '@/components/shadcn/sonner'

import RepoList from '@/pages/RepoList'
import RepoSettings from '@/pages/RepoSettings'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App
