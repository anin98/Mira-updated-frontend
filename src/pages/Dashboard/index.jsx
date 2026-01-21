import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import DashboardSidebar from './components/DashboardSidebar'
import DashboardHeader from './components/DashboardHeader'
import SalesView from './views/SalesView'
import ProductsView from './views/ProductsView'
import CompanyView from './views/CompanyView'
import ConversationsView from './views/ConversationsView'
import AIPersonaView from './views/AIPersonaView'
import { Menu } from 'lucide-react'

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { isCompanyAuth, company, loading } = useAuth()

  const currentView = searchParams.get('view') || 'dashboard'

  useEffect(() => {
    if (!loading && !isCompanyAuth) {
      navigate('/company-auth')
    }
  }, [loading, isCompanyAuth, navigate])

  const handleViewChange = (view) => {
    setSearchParams({ view })
    setSidebarOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8 border-primary" />
      </div>
    )
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <SalesView />
      case 'products':
        return <ProductsView />
      case 'company':
        return <CompanyView />
      case 'conversations':
        return <ConversationsView />
      case 'ai-persona':
        return <AIPersonaView />
      default:
        return <SalesView />
    }
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <DashboardHeader
          currentView={currentView}
          onMenuClick={() => setSidebarOpen(true)}
          company={company}
        />

        {/* View Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  )
}
