import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, MessageSquare, Store } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Dropdown } from 'antd'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // 1. Add state for company check
  const [hasCompany, setHasCompany] = useState(false)
  
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, isCompanyAuth, user, company, logout, logoutCompany } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  // 2. Check API for existing company if user is logged in
  useEffect(() => {
    const checkCompanyStatus = async () => {
      // If already logged in as company, we know they have one
      if (isCompanyAuth) {
        setHasCompany(true)
        return
      }

      const token = localStorage.getItem('access_token')
      // Only check if user is authenticated and has a token
      if (!isAuthenticated || !token) {
        setHasCompany(false)
        return
      }

      try {
        const response = await fetch('https://api.grayscale-technologies.com/api/v1/companies/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })

        if (response.ok) {
          const data = await response.json()
          // Check if user has any companies listed
          if (Array.isArray(data) && data.length > 0) {
            setHasCompany(true)
          }
        }
      } catch (error) {
        console.error('Error checking company status:', error)
      }
    }

    checkCompanyStatus()
  }, [isAuthenticated, isCompanyAuth])

  const handleLogout = () => {
    logout()
    logoutCompany()
    setHasCompany(false)
    navigate('/')
  }

  // 3. Update Menu Items Logic
  const userMenuItems = [
    {
      key: 'profile',
      label: (
        <Link to="/profile" className="flex items-center gap-2">
          <User size={16} />
          Profile
        </Link>
      ),
    },
    {
      key: 'chat',
      label: (
        <Link to="/chat" className="flex items-center gap-2">
          <MessageSquare size={16} />
          Chat
        </Link>
      ),
    },
    // Conditionally show Dashboard OR Register Business
    ...(isCompanyAuth || hasCompany ? [{
      key: 'dashboard',
      label: (
        <Link to="/dashboard" className="flex items-center gap-2">
          <LayoutDashboard size={16} />
          {isCompanyAuth ? 'Dashboard' : 'Manage Business'}
        </Link>
      ),
    }] : [{
      key: 'create-company',
      label: (
        <Link to="/company-auth" className="flex items-center gap-2">
          <Store size={16} />
          Register Business
        </Link>
      ),
    }]),
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 w-full">
          <LogOut size={16} />
          Logout
        </button>
      ),
    },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/mira-ai.png" alt="MIRA AI" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated || isCompanyAuth ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={['click']}
                placement="bottomRight"
              >
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium">
                    {user?.displayName || user?.firstName || company?.name || 'Account'}
                  </span>
                  <ChevronDown size={16} className="text-muted-foreground" />
                </button>
              </Dropdown>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/company-auth"
                  className="btn-primary px-5 py-2.5 text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              {isAuthenticated || isCompanyAuth ? (
                <>
                  <Link
                    to="/profile"
                    className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted flex items-center gap-2"
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <Link
                    to="/chat"
                    className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted flex items-center gap-2"
                  >
                    <MessageSquare size={18} />
                    Chat
                  </Link>
                  
                  {/* 4. Update Mobile Menu Logic */}
                  {(isCompanyAuth || hasCompany) ? (
                    <Link
                      to="/dashboard"
                      className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted flex items-center gap-2"
                    >
                      <LayoutDashboard size={18} />
                      {isCompanyAuth ? 'Dashboard' : 'Manage Business'}
                    </Link>
                  ) : (
                    <Link
                      to="/company-auth"
                      className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted flex items-center gap-2"
                    >
                      <Store size={18} />
                      Register Business
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/company-auth"
                    className="mx-4 btn-primary px-5 py-3 text-sm text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

