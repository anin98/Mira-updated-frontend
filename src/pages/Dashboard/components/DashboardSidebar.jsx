import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Building2,
  MessageSquare,
  Bot,
  X,
  LogOut,
  Home,
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'

const menuItems = [
  { id: 'dashboard', label: 'Sales Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'company', label: 'Company Settings', icon: Building2 },
  { id: 'conversations', label: 'Conversations', icon: MessageSquare },
  { id: 'ai-persona', label: 'AI Persona', icon: Bot },
]

export default function DashboardSidebar({ currentView, onViewChange, isOpen, onClose }) {
  const { logoutCompany, company } = useAuth()

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
                    <img src="/mira-ai.png" alt="MIRA AI" className="h-4 w-auto" />

        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
              currentView === item.id
                ? 'bg-primary text-white'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home size={20} />
          <span className="font-medium">Back to Home</span>
        </Link>
        <button
          onClick={logoutCompany}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-white">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-64 flex flex-col bg-white z-50 animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold">Menu</span>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
                <X size={20} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
