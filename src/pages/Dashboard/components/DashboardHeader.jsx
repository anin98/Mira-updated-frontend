import { Menu, Bell, Search, User } from 'lucide-react'
import { Dropdown, Badge } from 'antd'

const viewTitles = {
  dashboard: 'Sales Dashboard',
  products: 'Products Management',
  company: 'Company Settings',
  conversations: 'Conversations',
  'ai-persona': 'AI Persona Configuration',
}

export default function DashboardHeader({ currentView, onMenuClick, company }) {
  const notificationItems = [
    { key: '1', label: <span className="text-sm">New order received - #12345</span> },
    { key: '2', label: <span className="text-sm">Customer inquiry pending</span> },
    { key: '3', label: <span className="text-sm">Weekly report ready</span> },
  ]

  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg md:text-xl font-semibold">
          {viewTitles[currentView] || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-0 focus:outline-none text-sm w-40"
          />
        </div>

        {/* Notifications */}
        <Dropdown
          menu={{ items: notificationItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell size={20} className="text-muted-foreground" />
            <Badge
              count={3}
              size="small"
              className="absolute -top-1 -right-1"
            />
          </button>
        </Dropdown>

        {/* User */}
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={18} className="text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-tight">
              {company?.name || 'Company'}
            </p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
