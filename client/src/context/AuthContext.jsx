import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))

  // Hydrate user on app load if token exists
  useEffect(() => {
    const hydrate = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      try {
        const res = await axios.get('/auth/me')
        setUser(res.data.data)
      } catch (err) {
        console.error('Auth hydrate failed:', err.message)
        // Clear invalid token
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      } finally {
        setLoading(false)
      }
    }

    hydrate()
  }, [token])

  const login = (newToken, userData) => {
    setToken(newToken)
    localStorage.setItem('token', newToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    setUser(userData)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    token,
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
