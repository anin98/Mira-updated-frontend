import { Link } from 'react-router-dom'
import { Menu, Home, User, Settings } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { Dropdown } from 'antd'

export default function ChatHeader({ onMenuClick }) {
  const { isAuthenticated, user, logout } = useAuth()

  const menuItems = [
    {
      key: 'home',
      label: <Link to="/" className="flex items-center gap-2"><Home size={16} /> Home</Link>,
    },
    ...(isAuthenticated ? [
      {
        key: 'profile',
        label: <Link to="/profile" className="flex items-center gap-2"><User size={16} /> Profile</Link>,
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: <button onClick={logout} className="flex items-center gap-2 text-red-500 w-full">Logout</button>,
      },
    ] : [
      {
        key: 'login',
        label: <Link to="/auth" className="flex items-center gap-2">Sign In</Link>,
      },
    ]),
  ]

  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Menu size={20} />
        </button>
        <Link to="/" className="flex items-center gap-2">
           <img src="/mira-ai.png" alt="MIRA AI" className="h-4 w-auto" />
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            {isAuthenticated && user?.displayName && (
              <span className="text-sm font-medium hidden sm:inline">{user.displayName}</span>
            )}
          </button>
        </Dropdown>
      </div>
    </header>
  )
}
