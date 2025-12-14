// components/ProtectedRoute.tsx
// Component untuk protect admin routes (FIXED - no infinite loop)

import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import authService from '../services/authService'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        const isAuth = await authService.isAuthenticated()
        if (mounted) {
          setIsAuthenticated(isAuth)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        if (mounted) {
          setIsAuthenticated(false)
          setLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute