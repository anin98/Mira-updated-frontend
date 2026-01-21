import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [company, setCompany] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCompanyAuth, setIsCompanyAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()

    const handleStorageChange = () => {
      checkAuthStatus()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('loginStatusChanged', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('loginStatusChanged', handleStorageChange)
    }
  }, [])

  const checkAuthStatus = () => {
    try {
      const accessToken = localStorage.getItem('access_token')
      const companyAccessToken = localStorage.getItem('company_access_token')
      const userId = localStorage.getItem('userId')
      const companyData = localStorage.getItem('company_data')

      if (accessToken && userId) {
        setUser({
          id: userId,
          customerId: localStorage.getItem('customerId'),
          displayName: localStorage.getItem('displayName'),
          firstName: localStorage.getItem('firstName'),
          lastName: localStorage.getItem('lastName'),
          email: localStorage.getItem('email'),
          phone: localStorage.getItem('verifiedPhone'),
        })
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }

      if (companyAccessToken && companyData) {
        try {
          setCompany(JSON.parse(companyData))
          setIsCompanyAuth(true)
        } catch {
          setCompany(null)
          setIsCompanyAuth(false)
        }
      } else {
        setCompany(null)
        setIsCompanyAuth(false)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = (userData, tokens) => {
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    localStorage.setItem('userId', userData.id)
    if (userData.customerId) localStorage.setItem('customerId', userData.customerId)
    if (userData.displayName) localStorage.setItem('displayName', userData.displayName)
    if (userData.first_name) localStorage.setItem('firstName', userData.first_name)
    if (userData.last_name) localStorage.setItem('lastName', userData.last_name)
    if (userData.email) localStorage.setItem('email', userData.email)
    if (userData.phone) localStorage.setItem('verifiedPhone', userData.phone)

    setUser(userData)
    setIsAuthenticated(true)
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new CustomEvent('loginStatusChanged'))
  }

  const loginCompany = (companyData, token) => {
    localStorage.setItem('company_access_token', token)
    localStorage.setItem('company_data', JSON.stringify(companyData))

    setCompany(companyData)
    setIsCompanyAuth(true)
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new CustomEvent('loginStatusChanged'))
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('userId')
    localStorage.removeItem('customerId')
    localStorage.removeItem('displayName')
    localStorage.removeItem('firstName')
    localStorage.removeItem('lastName')
    localStorage.removeItem('email')
    localStorage.removeItem('verifiedPhone')

    setUser(null)
    setIsAuthenticated(false)
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new CustomEvent('loginStatusChanged'))
  }

  const logoutCompany = () => {
    localStorage.removeItem('company_access_token')
    localStorage.removeItem('company_data')

    setCompany(null)
    setIsCompanyAuth(false)
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new CustomEvent('loginStatusChanged'))
  }

  const updateUser = (userData) => {
    if (userData.displayName) localStorage.setItem('displayName', userData.displayName)
    if (userData.first_name) localStorage.setItem('firstName', userData.first_name)
    if (userData.last_name) localStorage.setItem('lastName', userData.last_name)
    if (userData.email) localStorage.setItem('email', userData.email)

    setUser(prev => ({ ...prev, ...userData }))
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <AuthContext.Provider value={{
      user,
      company,
      isAuthenticated,
      isCompanyAuth,
      loading,
      login,
      loginCompany,
      logout,
      logoutCompany,
      updateUser,
      checkAuthStatus,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
