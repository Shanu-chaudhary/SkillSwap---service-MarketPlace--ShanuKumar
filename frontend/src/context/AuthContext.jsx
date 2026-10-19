import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi, userApi } from '../utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      userApi.getMe()
        .then(res => setUser(res.data))
        .catch(() => localStorage.clear())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login({ email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('refreshToken', data.refreshToken)
    setUser(data.user)
    return data
  }, [])

  const register = useCallback(async (name, email, password) => {
    const { data } = await authApi.register({ name, email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('refreshToken', data.refreshToken)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }))
  }, [])

  const refreshUser = useCallback(async () => {
    const { data } = await userApi.getMe()
    setUser(data)
    return data
  }, [])

  const isProvider = user?.roles?.includes('ROLE_PROVIDER')
  const isAdmin    = user?.roles?.includes('ROLE_ADMIN')

  return (
    <AuthContext.Provider value={{
      user, loading, isProvider, isAdmin,
      login, register, logout, updateUser, refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
