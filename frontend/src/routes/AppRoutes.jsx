import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAssetifyStore } from '@/store/useAssetifyStore'

// Layouts
import { DashboardLayout } from '@/layouts/DashboardLayout'

// Pages
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { ForgotPassword } from '@/pages/ForgotPassword'
import { Onboarding } from '@/pages/Onboarding'
import { Dashboard } from '@/pages/Dashboard'
import { Learning } from '@/pages/Learning'
import { Sandbox } from '@/pages/Sandbox'
import { Advisor } from '@/pages/Advisor'
import { Knowledge } from '@/pages/Knowledge'
import { Certifications } from '@/pages/Certifications'
import { Market } from '@/pages/Market'
import { Community } from '@/pages/Community'

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAssetifyStore()
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Onboarding Protection Wrapper
const OnboardingRoute = ({ children }) => {
  const { user } = useAssetifyStore()
  if (!user.onboarded) {
    return <Navigate to="/onboarding" replace />
  }
  return children
}

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Onboarding Wizard */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Main Console Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <OnboardingRoute>
              <DashboardLayout />
            </OnboardingRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="learn" element={<Learning />} />
        <Route path="sandbox" element={<Sandbox />} />
        <Route path="advisor" element={<Advisor />} />
        <Route path="knowledge" element={<Knowledge />} />
        <Route path="certifications" element={<Certifications />} />
        <Route path="market" element={<Market />} />
        <Route path="community" element={<Community />} />
      </Route>

      {/* General Fallback Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
export default AppRoutes
