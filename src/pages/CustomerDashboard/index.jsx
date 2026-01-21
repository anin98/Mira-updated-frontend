import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ShoppingBag,
  Package,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  Truck,
  ArrowRight,
} from 'lucide-react'
import { Table, Tag } from 'antd'
import { useAuth } from '../../contexts/AuthContext'

const mockOrders = [
  {
    id: '#12345',
    date: '2024-01-15',
    items: ['Wireless Headphones', 'Phone Case'],
    total: '৳2,999',
    status: 'delivered',
  },
  {
    id: '#12344',
    date: '2024-01-12',
    items: ['Smart Watch Pro'],
    total: '৳5,000',
    status: 'shipped',
  },
  {
    id: '#12343',
    date: '2024-01-10',
    items: ['Bluetooth Speaker', 'USB Cable'],
    total: '৳1,850',
    status: 'processing',
  },
]

const statusConfig = {
  pending: { color: 'orange', icon: Clock, text: 'Pending' },
  processing: { color: 'blue', icon: Package, text: 'Processing' },
  shipped: { color: 'cyan', icon: Truck, text: 'Shipped' },
  delivered: { color: 'green', icon: CheckCircle, text: 'Delivered' },
}

export default function CustomerDashboard() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }
    setTimeout(() => setLoading(false), 500)
  }, [isAuthenticated, navigate])

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <span className="font-medium">{id}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <span className="text-muted-foreground">
          {items.length > 1 ? `${items[0]} +${items.length - 1} more` : items[0]}
        </span>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => <span className="font-semibold">{total}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = statusConfig[status]
        return (
          <Tag color={config.color} className="flex items-center gap-1 w-fit">
            <config.icon size={12} />
            {config.text}
          </Tag>
        )
      },
    },
  ]

  const stats = [
    { label: 'Total Orders', value: mockOrders.length, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'In Progress', value: 2, icon: Truck, color: 'bg-orange-500' },
    { label: 'Delivered', value: 1, icon: CheckCircle, color: 'bg-green-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container-custom">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {user?.displayName || user?.firstName || 'Customer'}!
              </h1>
              <p className="text-white/80">
                Track your orders and manage your account
              </p>
            </div>
            <Link
              to="/chat"
              className="btn bg-white text-primary hover:bg-white/90 px-6 py-3 gap-2 self-start"
            >
              <MessageSquare size={18} />
              Start Shopping
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="card flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Orders Table */}
          <div className="lg:col-span-2">
            <div className="card p-0 overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Orders</h2>
                <Link to="/orders" className="text-primary text-sm hover:underline flex items-center gap-1">
                  View All
                  <ArrowRight size={14} />
                </Link>
              </div>
              <Table
                dataSource={mockOrders}
                columns={orderColumns}
                rowKey="id"
                pagination={false}
                loading={loading}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/chat"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Chat with MIRA</p>
                    <p className="text-sm text-muted-foreground">Get shopping assistance</p>
                  </div>
                  <ArrowRight size={18} className="text-muted-foreground" />
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <User size={20} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Edit Profile</p>
                    <p className="text-sm text-muted-foreground">Update your information</p>
                  </div>
                  <ArrowRight size={18} className="text-muted-foreground" />
                </Link>

                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Package size={20} className="text-orange-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">Track Order</p>
                    <p className="text-sm text-muted-foreground">Check delivery status</p>
                  </div>
                  <ArrowRight size={18} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Account Info</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{user?.email || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{user?.phone || 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
